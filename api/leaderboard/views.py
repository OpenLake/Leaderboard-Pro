from leaderboard.models import CodeforcesUser, CodeforcesUserRatingUpdate
from leaderboard.serializers import Cf_Serializer, Cf_User_Serializer
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics, mixins, status

from datetime import datetime, timedelta
from random import randint, choice
import requests

MAX_DATE_TIMESTAMP = datetime.max.timestamp()


class GithubUserAPI(APIView):
    """
    Collects Github data for registered users
    """

    REGISTERED_GH_USERS = [
        "KShivendu",
        "ArsphreetS",
        # Contributors may add their Github username here
    ]

    def _get_github_data(self, username: str, days_passed=7):
        """
        TODO
        """

        return {
            "username": username,
            "commits": randint(1, 100),
            "rank": randint(1, 100),
        }

    def get(self, request, format=None):
        gh_users = [
            self._get_github_data(gh_username)
            for gh_username in self.REGISTERED_GH_USERS
        ]
        gh_users.sort(key=lambda r: r.get("rank", 0))

        return Response(gh_users)


class GithubOrganisationAPI(APIView):
    """
    Collects Github data for GH_ORG
    """

    GH_ORG = "OpenLake"

    def _get_github_data(self, days_passed=7):
        """
        TODO:
        """

        repos = requests.get("https://api.github.com/users/OpenLake/repos").json()
        return [
            {
                "username": f"gh_user_{i}",
                "commits": randint(1, 100),
                "rank": randint(1, 100),
                "contributions": {choice(repos)["name"]: randint(1, 100)},
            }
            for i in range(10)
        ]

    def get(self, request, format=None):
        gh_users = self._get_github_data()
        gh_users.sort(key=lambda r: r.get("rank", 0))

        return Response(gh_users)


class CodeforcesLeaderboard(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    """
    Collects data from codeforces API
    """

    queryset = CodeforcesUser.objects.all()
    serializer_class = Cf_Serializer

    def _check_for_updates(self, cf_users):
        cf_outdated_users = []
        for cf_user in cf_users:
            if cf_user.is_outdated:
                cf_outdated_users.append(cf_user.username)

        cf_api_response = {}

        if len(cf_outdated_users) > 0:
            url = f"https://codeforces.com/api/user.info?handles={';'.join(cf_outdated_users)}"
            cf_api_response = requests.get(url).json()
            cf_api_response = cf_api_response["result"]

        outdated_counter = 0
        for i, cf_user in enumerate(cf_users):

            if cf_user.is_outdated:
                user_info = cf_api_response[outdated_counter]
                outdated_counter += 1

                # TODO: Use serialier for saving data from codeforces API
                cf_user.max_rating = user_info.get("max_rating", 0)
                cf_user.rating = user_info.get("rating", 0)
                cf_user.last_activity = user_info.get(
                    "lastOnlineTimeSeconds", MAX_DATE_TIMESTAMP
                )
                cf_user.avatar = user_info.get("avatar", "")
                cf_user.save()

                url = (
                    f"https://codeforces.com/api/user.rating?handle={cf_user.username}"
                )
                rating_update_api_response = requests.get(url).json()
                if rating_update_api_response.get("status", "FAILED") != "OK":
                    continue

                cf_user = CodeforcesUser.objects.get(username=cf_user.username)

                rating_updates = rating_update_api_response.get("result", [])
                stored_rating_count = CodeforcesUserRatingUpdate.objects.count()
                new_rating_updates = rating_updates[stored_rating_count:]

                for i, rating_update in enumerate(new_rating_updates):
                    new_index = i + stored_rating_count
                    cf_rating_update = CodeforcesUserRatingUpdate(
                        cf_user=cf_user,
                        index=new_index,
                        prev_index=new_index - 1 if new_index > 0 else 0,
                        rating=rating_update.get("newRating", 0),
                        timestamp=rating_update.get(
                            "ratingUpdateTimeSeconds", MAX_DATE_TIMESTAMP
                        ),
                    )
                    cf_rating_update.save()

        return cf_users

    def get(self, request):
        cf_users = self._check_for_updates(self.get_queryset())
        serializer = Cf_Serializer(cf_users, many=True)
        return Response(serializer.data)

    def post(self, request):
        """
        Registers a new username in the list
        """
        username = request.data["username"]
        cf_user = CodeforcesUser(username=username)
        cf_user.save()

        return Response(Cf_Serializer(cf_user).data, status=status.HTTP_201_CREATED)
    
    def submissions(username,days_passed):
        response=requests.get(f'https://codeforces.com/api/user.status?handle={username}&from=1&count=1000') 
        practise_correct_count=0
        practise_wrong_count=0
        contest_correct_count=0
        contest_wrong_count=0
        seconds_in_a_day=86400
        times=seconds_in_a_day*days_passed
        for i in range(1000):
            result=response.json()['result'][i]
            creation_time=datetime.fromtimestamp(result['creationTimeSeconds'])
            duration=(datetime.now()-creation_time).total_seconds()
        
            if int(duration) <= (times):
                #contesttype
                contesttype=result['author']['participantType']
                if contesttype=="PRACTICE":
                    verdict=result['verdict']
                    if verdict=="OK":
                        practise_correct_count+=1
                    else:
                        practise_wrong_count+=1
                else:
                    verdict=result['verdict']
                    if verdict=="OK":
                        contest_correct_count+=1
                    else:
                        contest_wrong_count+=1
            else:
                break
        data= {
            "practise_correct" : practise_correct_count,
            "practise_wrong" : practise_wrong_count,
            "contest_correct" :contest_correct_count,
            "contest_wrong" : contest_wrong_count,
        }
            
        return data



class CodeforcesUserAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = CodeforcesUser.objects.all()
    serializer_class = Cf_User_Serializer


class CodechefAPI(APIView):
    """
    TODO
    """

    def get(self, request, format=None):
        # TODO

        return Response("TODO")

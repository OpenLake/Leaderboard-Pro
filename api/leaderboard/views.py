from leaderboard.models import CodeforcesUser
from leaderboard.serializers import Cf_Serializer
from rest_framework.response import Response
from rest_framework.views import APIView

from datetime import datetime, timedelta
from random import randint, choice
import requests
import json


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


class CodeforcesAPI(APIView):
    """
    Collects data from codeforces API
    """

    REGISTERED_CF_USERS = [
        "DmitriyH",
        "Fefer_Ivan",
        "tourist",
        # Contributors may add their Github username here
    ]

    def _check_for_updates(self, cf_users):
        cf_outdated_users = []
        for cf_user in cf_users:
            if cf_user.is_outdated:
                cf_outdated_users.append(cf_user.username)
        
        url = f"https://codeforces.com/api/user.info?handles={';'.join(cf_outdated_users)}"
        cf_api_response = requests.get(url).json()["result"]
        
        outdated_counter = 0
        for i, cf_user in enumerate(cf_users):
            
            if cf_user.is_outdated:
                user_info = cf_api_response[outdated_counter]
                outdated_counter += 1

                # TODO: Use serialier for saving data from codeforces API
                cf_user.max_rating = user_info.get('max_rating',0)
                cf_user.rating = user_info.get('rating', 0)
                cf_user.last_activity = user_info.get('lastOnlineTimeSeconds', datetime.max.timestamp())
                cf_user.save()

   

    def get(self, request, format=None):
        cf_users = CodeforcesUser.objects.all()
        self._check_for_updates(cf_users)
        
        return Response(Cf_Serializer(cf_users,many=True).data)

    def post(self, request, format=None):
        """
        Registers a new username
        """
        username = request.data["username"]
        cf_user = CodeforcesUser(username=username)
        cf_user.save()
        
        return Response(Cf_Serializer(cf_user).data)

    
    def delete(self, request, format=None):
        """
        Removes a registered username
        """
        username = request.data["username"]
        cf_user = CodeforcesUser.objects.get(username=username)
        cf_user.delete()
        
        return Response(Cf_Serializer(cf_user).data) # id == null


class CodechefAPI(APIView):
    """
    TODO
    """

    def get(self, request, format=None):
        # TODO

        return Response("TODO")

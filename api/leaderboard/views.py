from leaderboard.models import (
    codeforcesUser,
    codeforcesUserRatingUpdate,
    githubUser,
    codechefUser,
    openlakeContributor,
    LeetcodeUser,
    Contest,
    Contestant
)
from leaderboard.serializers import (
    Cf_Serializer,
    Cf_User_Serializer,
    CC_Serializer,
    GH_Serializer,
    OL_Serializer,
    LT_Serializer
)
from knox.models import AuthToken
from rest_framework.response import Response


from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.reverse import reverse
from rest_framework import generics, mixins, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from datetime import datetime
import requests

from django.http import JsonResponse
# from leaderboard.celery import get_ranking
# from .tasks import get_rankings


import logging
logger = logging.getLogger(__name__)
from django.http import JsonResponse

MAX_DATE_TIMESTAMP = datetime.max.timestamp()




@api_view(["GET"])
@permission_classes((AllowAny,))
def api_root(request, format=None):
    return Response(
        {
            "codeforces": reverse(
                "codeforces-leaderboard", request=request, format=format
            ),
            "codechef": reverse(
                "codechef-leaderboard", request=request, format=format
            ),
            "github": reverse(
                "github-leaderboard", request=request, format=format
            ),
            "openlake": reverse(
                "openlake-leaderboard", request=request, format=format
            ),
            # urls from from router:
            "users": reverse("user-list", request=request, format=format),
            "groups": reverse("group-list", request=request, format=format),
        }
    )


class GithubUserAPI(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    """
    Collects Github data for registered users
    """

    queryset = githubUser.objects.all()
    serializer_class = GH_Serializer

    def get(self, request):
        gh_users = githubUser.objects.all()
        serializer = GH_Serializer(gh_users, many=True)
        return Response(serializer.data)    

    def post(self, request):
        username = request.data["username"]
        gh_user = githubUser(username=username)
        
        gh_user.save()
        return Response(
            GH_Serializer(gh_user).data, status=status.HTTP_201_CREATED
        )


class GithubOrganisationAPI(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    """
    Collects Github data for GH_ORG
    """

    queryset = openlakeContributor.objects.all()
    serializer_class = OL_Serializer

    def get(self, request):
        ol_contributors = openlakeContributor.objects.all()
        serializer = OL_Serializer(ol_contributors, many=True)
        return Response(serializer.data)


class CodeforcesLeaderboard(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    queryset = codeforcesUser.objects.all()
    serializer_class = Cf_Serializer
    # MAX_DATE_TIMESTAMP = datetime.max.timestamp()

    def _check_for_updates(self, cf_users):
        cf_outdated_users = []
        for cf_user in cf_users:
            if cf_user.is_outdated:
                cf_outdated_users.append(cf_user.username)

        cf_api_response = {}

        if len(cf_outdated_users) > 0:
            url = f"https://codeforces.com/api/user.info?handles=\{';'.join(cf_outdated_users)}"
            cf_api_response = requests.get(url).json()
            cf_api_response = cf_api_response["result"]

        outdated_counter = 0
        for i, cf_user in enumerate(cf_users):

            if cf_user.is_outdated:
                user_info = cf_api_response[outdated_counter]
                outdated_counter += 1
                # TODO: Use serialier for saving data from codeforces API
                cf_user.max_rating = user_info.get("maxRating", 0)
                cf_user.rating = user_info.get("rating", 0)
                cf_user.last_activity = user_info.get(
                    "lastOnlineTimeSeconds", MAX_DATE_TIMESTAMP
                )
                cf_user.avatar = user_info.get("avatar", "")
                cf_user.save()

                url = f"https://codeforces.com/api/user.rating?handle=\{cf_user.username}"
                rating_update_api_response = requests.get(url).json()
                if rating_update_api_response.get("status", "FAILED") != "OK":
                    continue

                cf_user = codeforcesUser.objects.get(username=cf_user.username)

                rating_updates = rating_update_api_response.get("result", [])
                stored_rating_count = (
                    codeforcesUserRatingUpdate.objects.count()
                )
                new_rating_updates = rating_updates[stored_rating_count:]

                for i, rating_update in enumerate(new_rating_updates):
                    new_index = i + stored_rating_count
                    cf_rating_update = codeforcesUserRatingUpdate(
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
        cf_user = codeforcesUser(username=username)
        cf_user.save()

        return Response(
            Cf_Serializer(cf_user).data, status=status.HTTP_201_CREATED
        )

    def submissions(username, days_passed):
        response = requests.get(
            f"https://codeforces.com/api/user.status?handle=\
            {username}&from=1&count=1000"
        )
        practise_correct_count = 0
        practise_wrong_count = 0
        contest_correct_count = 0
        contest_wrong_count = 0
        seconds_in_a_day = 86400
        times = seconds_in_a_day * days_passed
        for i in range(1000):
            result = response.json()["result"][i]
            creation_time = datetime.fromtimestamp(
                result["creationTimeSeconds"]
            )
            duration = (datetime.now() - creation_time).total_seconds()

            if int(duration) <= (times):
                # contesttype
                contesttype = result["author"]["participantType"]
                if contesttype == "PRACTICE":
                    verdict = result["verdict"]
                    if verdict == "OK":
                        practise_correct_count += 1
                    else:
                        practise_wrong_count += 1
                else:
                    verdict = result["verdict"]
                    if verdict == "OK":
                        contest_correct_count += 1
                    else:
                        contest_wrong_count += 1
            else:
                break
        data = {
            "practise_correct": practise_correct_count,
            "practise_wrong": practise_wrong_count,
            "contest_correct": contest_correct_count,
            "contest_wrong": contest_wrong_count,
        }

        return data


class codeforcesUserAPI(generics.RetrieveUpdateDestroyAPIView):
    queryset = codeforcesUser.objects.all()
    serializer_class = Cf_User_Serializer


class CodechefLeaderboard(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    queryset = codechefUser.objects.all()
    serializer_class = CC_Serializer
    def get(self, request):
        cc_users = codechefUser.objects.all()
        serializer = CC_Serializer(cc_users, many=True)
        return Response(serializer.data)

    def post(self, request):
        username = request.data["username"]
        cc_user = codechefUser(username=username)
        cc_user.save()
        return Response(
            CC_Serializer(cc_user).data, status=status.HTTP_201_CREATED
        )
        
class LeetcodeLeaderboard(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    queryset = LeetcodeUser.objects.all()
    serializer_class = LT_Serializer
    def get(self, request):
        lt_users = LeetcodeUser.objects.all()
        serializer = LT_Serializer(lt_users, many=True)
        return Response(serializer.data)

    def post(self, request):
        username = request.data["username"]
        lt_user = LeetcodeUser(username=username)
        lt_user.save()
        return Response(
            LT_Serializer(lt_user).data, status=status.HTTP_201_CREATED
        )


import requests
import urllib.parse

# def get_rankings_ccps(usernames, contestID):
#     base_url = 'https://leetcode.com/graphql'
#     data_list = []
#     contest_data = []

#     for username in usernames:
#         # Construct the query parameters
#         query = f'query {{ userContestRankingHistory(username:"{username}") {{ attended ranking contest {{ title startTime }} }} }}'
#         query_params = {'query': query}
        
#         # Encode the query parameters
#         encoded_params = urllib.parse.urlencode(query_params)
        
#         # Construct the full URL with the encoded query parameters
#         url = f'{base_url}?{encoded_params}'

#         try:
#             response = requests.get(url)
#             data = response.json()
#             user_rankingdata = data['data']['userContestRankingHistory']
#             if user_rankingdata is not None:
#                 for user_data in user_rankingdata:
#                     if user_data is not None:
#                         if user_data['attended'] != False:
#                             if user_data['contest']['title'] == contestID:
#                                 # print(user_data)
#                                 contest_info = {
#                                     'username':username,
#                                     'ranking':user_data['ranking'],
#                                     'startTime':user_data['contest']['startTime']
#                                 }
#                                 contest_data.append(contest_info)
            
            # Process the retrieved data as per your requirements
            
            # data_object = {
            #     'username': username,
            #     'data': data
            # }
            # data_list.append(data_object)
          
        # except requests.exceptions.RequestException as e:
            # Handle any errors that occurred during the request
            # print(f"Error: {e}")

    # for item in data_list:
    #     username = item['username']
    #     user_data = item['data']['data']['userContestRankingHistory']
      
    #     if user_data is not None:
    #         for contest in user_data:
    #             if contest['contest']['title'] == contestID:
    #                 contest_info = {
    #                     'username': username,
    #                     'ranking': contest['ranking'],
    #                     'startTime': contest['contest']['startTime']
    #                 }
    #                 contest_data.append(contest_info)
    # sorted_contest_data = sorted(contest_data, key=lambda x: x['ranking'], reverse=False)
    
    # return sorted_contest_data



# class ContestRankingsAPIView(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
#     queryset = codeforcesUser.objects.all()
#     def get(self, request):
#         contest = request.GET.get('contest')
#         usernames = request.GET.getlist('usernames[]')

#         task = get_ranking.delay(contest, usernames)

#         return Response({'task_id': task.id})
# usernames_ccps = ['rutor', 'abhinaykalavakuri1289', 'abhiojha251198', 'divyanshu_k2003', 'akashdeeptemp1', 'AKH9090', 'An333it', 'ankush57', 'anshukumar_729', 'aritradeb', 'Aman_1610', 'AAli001', 'Athulitha', 'sribhanu', 'Chandramalika', 'devildev98', 'dommatirohith', 'Ragzz258', 'gubbalavenugopal', 'hrishik_1208', 'jaysoni3010', 'kammelaaditya', 'mohan_706', 'kotaajaykumar', 'swarupsai112002', 'Manish_5746', '_neha_panjabi', 'Manjeet_2003', 'Dixiebloom', 'poppy21', 'mratunjay095', 'nancyy_24_', 'nbsbharath', 'paruld', 'PiyushPancholi', 'DarkHorse__', 'pra8186', 'prathameshgujar2002', 'attadapravalika', 'priyatomar721', 'proddutooriv', 'rishitha_90', 'riyadhiman', 'riyanshi_goyal', 'sahan_18', 'Sanat_Tudu', 'user7410oi', 'adityadss', 'notshashwat', 'shivam1412', 'TheAlgorithm', 'khairnarshreyash', 'user7576R', '123_sonu', 'Sujata_C11', 'suresh0405bairwa', 'the_detective', 'harveySpector', 'usha_729', 'utkarsh789', 'vaishnavi_2211', 'karthik_leet111', 'Tarun_142333', 'vetsatarun', 'thakurvishesh1', 'dan3121', 'gmansi1811', 'user3679lh', 'Pallavi_Pandey', 'ransh5523', 'prajjwalk', 'Arnav_kiba', 'satyamss2812', 'shaikrahul000', 'vaibhavarora2182', 'siddharthgupta_20', 'Sharishth47', 'maya12_', 'akshaywairagade2', 'mundrusrinidhi', 'kira_11', 'shady7', 'coding_spot', 'sunnny129', 'Randolph_Cole', 'Mayank_Chaturvedi', 'basantsolanky', 'ashmesh', 'user8078yb', 'spandan-04', 'dakshrajsadashiv', 'user3486g', 'imdad18', 'sowdagar3', 'cbcode', 'ShaleenM', 'parzival2_0', 'Amitjakhar', 'Sahithi_Ampolu', 'ayushkd']
# usernames_ccps=['TheAlgorithm']

# def ContestRankingsAPICCPSView(request):
#         if request.method=="GET":
#             contestID = request.GET.get('contest')
#             usernames = usernames_ccps
#             # logger.error(contest)
#             task = get_rankings_ccps(usernames, contestID)

#         return JsonResponse(task, safe=False)
    
import os
import json
file_path = os.path.join(os.path.dirname(__file__), 'contest_data.json')

with open(file_path, 'r') as file:
  json_data = json.load(file)

contest_list = json_data[0:]

contest_name = contest_list[0]
contest = Contest(name=contest_name)
contest.save()

for contestant in contest_list[1:]:
    username = contestant['username']
    ranking = contestant['ranking']
    start_time = datetime.fromtimestamp(contestant['startTime'])
    
    contestant_instance = Contestant(contest=contest, username=username, ranking=ranking, startTime=start_time)
    contestant_instance.save()

def LeetcodeCCPSAPIView(request):
    contests = Contest.objects.prefetch_related('contestant_set').values('id', 'name', 'contestant__username', 'contestant__ranking', 'contestant__startTime')

    return JsonResponse(list(contests), safe=False)
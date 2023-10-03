from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import permissions,status
from rest_framework.decorators import api_view,permission_classes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserNamesSerializer,LeetcodeFriendsSerializer,GithubFriendsSerializer,CodechefFriendsSerializer,CodeforcesFriendsSerializer
from leaderboard.serializers import CF_Serializer,CC_Serializer,LT_Serializer,GH_Serializer,OL_Serializer
from leaderboard.models import UserNames,githubUser,codechefUser,codeforcesUser,LeetcodeUser,openlakeContributor,GithubFriends,LeetcodeFriends,CodechefFriends,CodeforcesFriends,OpenlakeFriends
from rest_framework.generics import ListCreateAPIView,RetrieveUpdateDestroyAPIView
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
import requests


import logging
logger = logging.getLogger(__name__)



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
@permission_classes((permissions.AllowAny,))
def getRoutes(request):
    routes=[
        '/api/token',
         'api/token/refresh'
    ]
    return Response(routes)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    user = request.user
    return Response({
        'username': user.username,
        'email': user.email,
    })
@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def post_UserNames(request):
    
    try:
        # data['user']=request.user.username
        # data=request.data
        username_cc=request.data["cc_uname"]
        username_cf=request.data["cf_uname"]
        username_gh=request.data["gh_uname"]
        username_lt=request.data["lt_uname"]
        user=request.user
        
        if UserNames.objects.filter(user=user).exists():
            t = UserNames.objects.get(user=user)
            if username_cc!="":
                codechefUser.objects.filter(username=t.cc_uname).delete()
                t.cc_uname=username_cc
                cc_user = codechefUser(username=username_cc)
                cc_user.save()
            if username_cf!="":
                codeforcesUser.objects.filter(username=t.cf_uname).delete()
                t.cf_uname=username_cf             
                cf_user = codeforcesUser(username=username_cf)
                cf_user.save()
            if username_gh!="":
                githubUser.objects.filter(username=t.gh_uname).delete()
                t.gh_uname=username_gh
                gh_user = githubUser(username=username_gh)
                gh_user.save()
            if username_lt!="":
                LeetcodeUser.objects.filter(username=t.lt_uname).delete()
                t.lt_uname=username_lt
                lt_user = LeetcodeUser(username=username_lt)
                lt_user.save()
            t.save()
        else:
            if user!="":
                userName=UserNames(user=user,cc_uname=username_cc,cf_uname=username_cf,gh_uname=username_gh,lt_uname=username_lt)
                userName.save()
            if username_cc!="":
                cc_user = codechefUser(username=username_cc)
                cc_user.save()
                
            # username_cf = request.data["cf_uname"]
            if username_cf!="":
                cf_user = codeforcesUser(username=username_cf)
                cf_user.save()
             
            # username_gh = request.data["gh_uname"]
            if username_gh!="":
                gh_user = githubUser(username=username_gh)
                gh_user.save()
            if username_lt!="":
                lt_user = LeetcodeUser(username=username_lt)
                lt_user.save()
        return Response({
            'status':200,
            'message':"Success",
        },status=status.HTTP_201_CREATED)
        # else:
        #     return Response({
        #         'status':400,
        #         'message':"Wrong",
        #     },status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:  
        print(e)
        return Response({
            'status':400,
            'message':"Wrong"
        },status=status.HTTP_400_BAD_REQUEST)
        
@api_view(["POST"])
@permission_classes((permissions.AllowAny,))
def registerUser(request):
    
    try:
        first_name = request.data["first_name"]
        last_name=request.data['last_name']
        email=request.data['email']
        username = request.data["username"]
        password = request.data["password"]
        cc_uname=request.data["cc_uname"]
        cf_uname=request.data["cf_uname"]
        gh_uname=request.data["gh_uname"]
        lt_uname=request.data["lt_uname"]
        user = User.objects.create_user(username=username, password=password, first_name=first_name,last_name=last_name,email=email)
        if first_name!="" and  email!="" and username!="" and password!="":
            user.save()
            userName=UserNames(user=user,cc_uname=cc_uname,cf_uname=cf_uname,gh_uname=gh_uname,lt_uname=lt_uname)
            userName.save()
            
            if cc_uname!="":
                cc_user = codechefUser(username=cc_uname)
                cc_user.save()
            if cf_uname!="":
               
                cf_user = codeforcesUser(username=cf_uname)
               
                cf_user.save()
            if gh_uname!="":
                gh_user = githubUser(username=gh_uname)
                gh_user.save()
            if lt_uname!="":
                lt_user = LeetcodeUser(username=lt_uname)
                lt_user.save()
            return Response({
                    'status':200,
                    'message':"Success",
                },status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({
            'status':400,
            'message':"Wrong"
        },status=status.HTTP_400_BAD_REQUEST)
        


# def get_ranking(contest, usernames):
#     API_URL_FMT = 'https://leetcode.com/contest/api/ranking/{}/?pagination={}&region=global'
#     page = 1
#     total_rank = []
#     retry_cnt = 0
    
#     while retry_cnt<10:
#         try:
            
#             url = API_URL_FMT.format(contest, page)
#             # if page == 3 :
#             #     break
#             resp = requests.get(url).json()
#             page_rank = resp['total_rank']
#             if len(page_rank) == 0:
#                 break
#             total_rank.extend(page_rank)
#             print(f'Retrieved ranking from page {page}. {len(total_rank)} retrieved.')
            
#             # logger.info(f'Retrieved ranking from page {page}. {len(total_rank)} retrieved.')
#             page += 1
#             if(page==3):
#                 break
#             retry_cnt = 0
#         except:
#             print(f'Failed to retrieve data of page {page}...retry...{retry_cnt}')
#             retry_cnt += 1

#     # Discard and transform fields
#     for rank in total_rank:
#         rank.pop('contest_id', None)
#         rank.pop('user_slug', None)
#         rank.pop('country_code', None)
#         rank.pop('global_ranking', None)
#         finish_timestamp = rank.pop('finish_time', None)
#         if finish_timestamp:
#             rank['finish_time'] = datetime.fromtimestamp(int(finish_timestamp)).isoformat()

#     # Filter rankings based on usernames
    
#     filtered_rankings = [rank for rank in total_rank if rank['username'] in usernames]
    
#     filtered_rankings.sort(key=lambda obj: obj["rank"])
    
#     return filtered_rankings



import requests
import urllib.parse

def get_data_from_url(usernames, contestID):
    base_url = 'https://leetcode.com/graphql'
    data_list = []
    contest_data = []

    for username in usernames:
        # Construct the query parameters
        query = f'query {{ userContestRankingHistory(username:"{username}") {{ attended ranking contest {{ title startTime }} }} }}'
        query_params = {'query': query}
        
        # Encode the query parameters
        encoded_params = urllib.parse.urlencode(query_params)
        
        # Construct the full URL with the encoded query parameters
        url = f'{base_url}?{encoded_params}'

        try:
            response = requests.get(url)
            data = response.json()
            
            # Process the retrieved data as per your requirements
            
            data_object = {
                'username': username,
                'data': data
            }
            data_list.append(data_object)
          
        except requests.exceptions.RequestException as e:
            # Handle any errors that occurred during the request
            print(f"Error: {e}")

    for item in data_list:
        username = item['username']
        user_data = item['data']['data']['userContestRankingHistory']
      
        if user_data is not None:
            for contest in user_data:
                if contest['contest']['title'] == contestID:
                    contest_info = {
                        'username': username,
                        'ranking': contest['ranking'],
                        'startTime': contest['contest']['startTime']
                    }
                    contest_data.append(contest_info)
    sorted_contest_data = sorted(contest_data, key=lambda x: x['ranking'], reverse=True)
    
    return sorted_contest_data

def ContestRankingsAPIView(request):
        
        if request.method=="GET":
            contest = request.GET.get('contest')
            
            usernames = [user.username for user in LeetcodeUser.objects.all()]
      
            task = get_data_from_url(usernames,contest)

        return JsonResponse(task, safe=False)

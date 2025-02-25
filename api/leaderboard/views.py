from leaderboard.models import (
    codeforcesUser,
    codeforcesUserRatingUpdate,
    githubUser,
    codechefUser,
    openlakeContributor,
    LeetcodeUser,
    UserTasks,
)
from leaderboard.serializers import (
    CF_Serializer,
    CC_Serializer,
    GH_Serializer,
    OL_Serializer,
    LT_Serializer,
    Task_Serializer,
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

import requests
import urllib.parse
    

import re

import logging
logger = logging.getLogger(__name__)
from django.http import JsonResponse

MAX_DATE_TIMESTAMP = datetime.now().timestamp()

from django.db import connection
from django.db.utils import OperationalError

import requests
from rest_framework import generics, mixins, status
from rest_framework.response import Response
from .models import githubUser
from .serializers import GH_Serializer

class GithubUserAPI(mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView):
    """
    Collects Github data for registered users
    """
    queryset = githubUser.objects.all()
    serializer_class = GH_Serializer

    def fetch_github_contributions(self, username):
        url = f"https://github-contributions-api.deno.dev/{username}.json"
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data.get("totalContributions", 0)
        return 0

    def fetch_github_data(self, username):
        url = f"https://api.github.com/users/{username}"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            return {
                "avatar": data.get("avatar_url", ""),
                "repositories": data.get("public_repos", 0),
                "stars": self.fetch_starred_repos(username),
                "contributions": self.fetch_github_contributions(username),
                "last_updated": datetime.now().timestamp(),
            }
        return None

    def fetch_starred_repos(self, username):
        url = f"https://api.github.com/users/{username}/starred"
        response = requests.get(url)
        if response.status_code == 200:
            return len(response.json())  # Count starred repos
        return 0

    def get(self, request):
        gh_users = githubUser.objects.all()
        if not gh_users.exists():
            return Response({"message": "No users found"}, status=status.HTTP_404_NOT_FOUND)

        for user in gh_users:
            github_data = self.fetch_github_data(user.username)
            if github_data:
                user.avatar = github_data["avatar"]
                user.repositories = github_data["repositories"]
                user.stars = github_data["stars"]
                user.contributions = github_data["contributions"]
                user.last_updated = github_data["last_updated"]
                user.save()

        serializer = GH_Serializer(gh_users, many=True)
        return Response(serializer.data)

    def post(self, request):
        username = request.data.get("username")
        if not username:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Create user and fetch GitHub data
        github_data = self.fetch_github_data(username)
        if not github_data:
            return Response({"error": "GitHub user not found"}, status=status.HTTP_404_NOT_FOUND)

        gh_user = githubUser(
            username=username,
            avatar=github_data["avatar"],
            repositories=github_data["repositories"],
            stars=github_data["stars"],
            contributions=github_data["contributions"],
            last_updated=github_data["last_updated"],
        )
        gh_user.save()

        return Response(GH_Serializer(gh_user).data, status=status.HTTP_201_CREATED)


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


from rest_framework import mixins, generics, status
from rest_framework.response import Response
import requests
from .models import codeforcesUser
from .serializers import CF_Serializer

MAX_DATE_TIMESTAMP = 0  # Define this if needed

class CodeforcesLeaderboard(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    def get_codeforces_submission_stats(self, username):
        """
        Fetches the total number of submissions and unique solved problems for a given Codeforces username.
        
        Returns:
            dict: {
                "total_solved": int,
                "total_submissions": int
            }
        """
        url = f"https://codeforces.com/api/user.status?handle={username}"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "OK":
                total_submissions = len(data["result"])  # Count all submissions
                solved_problems = set()

                for submission in data["result"]:
                    if submission.get("verdict") == "OK":
                        problem_id = f"{submission['problem'].get('contestId', '')}{submission['problem'].get('index', '')}"
                        solved_problems.add(problem_id)

                return {
                    "total_solved": len(solved_problems),  # Count unique problems solved
                    "total_submissions": total_submissions
                }
        
        return {"total_solved": 0, "total_submissions": 0}

    def get_codeforces_data(self, username):
        url = f"https://codeforces.com/api/user.info?handles={username}"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "OK" and data.get("result"):
                user_data = data["result"][0]
                return {
                    "rating": user_data.get("rating", 0),
                    "max_rating": user_data.get("maxRating", 0),
                    "last_activity": user_data.get("lastOnlineTimeSeconds", MAX_DATE_TIMESTAMP),
                    "avatar": user_data.get("titlePhoto", ""),
                }

    queryset = codeforcesUser.objects.all()
    serializer_class = CF_Serializer

    def get(self, request):
        cf_users = codeforcesUser.objects.all()

        for user in cf_users:
            user_data = self.get_codeforces_data(user.username)
            user_submission_stats = self.get_codeforces_submission_stats(user.username)
            if user_submission_stats:
                user.total_solved = user_submission_stats["total_solved"]
                user.total_submissions = user_submission_stats["total_submissions"]
            if user_data:
                user.rating = user_data["rating"]
                user.max_rating = user_data["max_rating"]
                user.last_activity = user_data["last_activity"]
                user.avatar = user_data["avatar"]
            user.save()

        serializer = CF_Serializer(cf_users, many=True)
        return Response(serializer.data)

    def post(self, request):
        username = request.data["username"]
        cf_user = codeforcesUser(username=username)
        cf_user.save()
        return Response(
            CF_Serializer(cf_user).data, status=status.HTTP_201_CREATED
        )



class CodechefLeaderboard(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):

    def get_codechef_data(self, username):
        url = f"https://codechef-api.vercel.app/handle/{username}"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            if data.get("status") == 200:
                return {
                    "rating": data.get("currentRating", 0),
                    "highest_rating": data.get("highestRating", 0),
                    "global_rank": data.get("globalRank", -1),
                    "country_rank": data.get("countryRank", -1),
                    "avatar": data.get("profile", ""),
                    "last_updated": datetime.now().timestamp(),
                }

    queryset = codechefUser.objects.all()
    serializer_class = CC_Serializer

    def get(self, request):
        cc_users = codechefUser.objects.all()

        for user in cc_users:
            user_data = self.get_codechef_data(user.username)
            if user_data:
                user.rating = user_data["rating"]
                user.max_rating = user_data["highest_rating"]
                user.Global_rank = user_data["global_rank"]
                user.Country_rank = user_data["country_rank"]
                user.avatar = user_data["avatar"]
                user.last_updated = datetime.now()
                user.save()

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
    
    def get_leetcode_data(self, username):
        url = f"https://alfa-leetcode-api.onrender.com/userProfile/{username}"
        response = requests.get(url)

        if response.status_code == 200:
            data = response.json()
            return {
                "ranking": data.get("ranking", 0),
                "easy_solved": data.get("easySolved", 0),
                "medium_solved": data.get("mediumSolved", 0),
                "hard_solved": data.get("hardSolved", 0),
                "avatar": data.get("avatar", ""),
                "last_updated": datetime.now().timestamp(),
                "total_solved": data.get("totalSolved", 0),
            }

    queryset = LeetcodeUser.objects.all()
    serializer_class = LT_Serializer
    def get(self, request):
        lt_users = LeetcodeUser.objects.all()

        for user in lt_users:
            if user.is_outdated:
                user_data = self.get_leetcode_data(user.username)
                if user_data:
                    user.ranking = user_data["ranking"]
                    user.easy_solved = user_data["easy_solved"]
                    user.medium_solved = user_data["medium_solved"]
                    user.hard_solved = user_data["hard_solved"]
                    user.avatar = user_data["avatar"]
                    user.total_solved = user_data["total_solved"]
                    user.last_updated = datetime.now()
                    user.save()

        serializer = LT_Serializer(lt_users, many=True)
        return Response(serializer.data)

    def post(self, request):
        username = request.data["username"]
        lt_user = LeetcodeUser(username=username)
        lt_user.save()
        return Response(
            LT_Serializer(lt_user).data, status=status.HTTP_201_CREATED
        )


from django.db import connection
from django.db.utils import OperationalError

def get_table_data():
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM ccpsleetcoderanking")
            columns = [col[0] for col in cursor.description]  # Get the column names
            data = cursor.fetchall()

            results = []
        
            for row in data:
                result = {}
                for i, value in enumerate(row):
                    result[columns[i]] = value
                results.append(result)

            return results
    except OperationalError as e:
        print(f"Error: {e}")

def LeetcodeCCPSAPIView(request):
    
    
   

    data = get_table_data()
    

   
   
    return JsonResponse(data, safe=False)

from rest_framework import mixins, generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import Task_Serializer


class UserTasksManage(APIView):  # Inherit from APIView
    def get(self, request, *args, **kwargs):
        req_username = request.query_params.get("username")
        print("Received username:", req_username)
        if not req_username:
            return Response({"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST)

        user_tasks = UserTasks.objects.filter(username__username=req_username)
        print("Filtered tasks:", user_tasks)
        serialized_tasks = Task_Serializer(user_tasks, many=True)
        
        return Response(serialized_tasks.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        try:
            user = User.objects.get(username=request.data["username"])
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        user_task = UserTasks.objects.create(
            username=user,
            problem=request.data["problem"],
            dueDate=request.data["dueDate"],
            title=request.data["title"],
            discription=request.data["discription"],
            completed=request.data["completed"],
            starred=request.data["starred"],
            solved=request.data["solved"]
        )

        return Response(Task_Serializer(user_task).data, status=status.HTTP_201_CREATED)

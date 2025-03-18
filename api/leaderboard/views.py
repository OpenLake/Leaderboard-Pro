from leaderboard.models import (
    codeforcesUser,
    codeforcesUserRatingUpdate,
    githubUser,
    codechefUser,
    openlakeContributor,
    LeetcodeUser,
    UserTasks,
    DiscussionPost,
    ReplyPost,
)
from leaderboard.serializers import (
    CF_Serializer,
    CC_Serializer,
    GH_Serializer,
    OL_Serializer,
    LT_Serializer,
    Task_Serializer,
    DiscussionPost_Serializer,
    ReplyPost_Serializer
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
    def get_codeforces_solved(self, username):
        try:
            codeforcesSolved = codeforcesUser.objects.get(username=username)
            return codeforcesSolved.total_solved
        except:
            return 100

    # Helper to fetch solved problems count from Leetcode
    def get_leetcode_solved(self, username):
        try:
            leetcodeSolved = LeetcodeUser.objects.get(username=username)
            return leetcodeSolved.total_solved
        except:
            return 56

    # Update the task's progress based on the current solved counts.
    def update_task_progress(self, task):
        # Here we assume that task.username is a Django User model and that
        # its username is used as the handle for both Codeforces and Leetcode.
        user_handle = task.username  
        current_cf = self.get_codeforces_solved(user_handle)
        current_lt = self.get_leetcode_solved(user_handle)
        current_total = current_cf + current_lt

        # Calculate the number of problems solved since the task was created.
        new_solved = current_total - task.total_solved_now
        new_solved = max(new_solved, 0)  # Ensure it doesn't go negative

        # Update the task progress.
        if new_solved >= task.problem:
            task.solved = task.problem  # Cap solved to the task's problem count
            task.completed = True
        else:
            task.solved = new_solved
        task.save()

    # GET method now updates each task's progress before returning the tasks.
    def get(self, request, *args, **kwargs):
        req_username = request.query_params.get("username")
        if not req_username:
            return Response(
                {"error": "Username is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        user_tasks = UserTasks.objects.filter(username__username=req_username)
        # Update progress for each task by checking Codeforces and Leetcode solved counts
        for task in user_tasks:
            self.update_task_progress(task)

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
            solved=request.data["solved"],
            total_solved_now=request.data["totalSolvedNow"],
        )

        return Response(Task_Serializer(user_task).data, status=status.HTTP_201_CREATED)
    
    def put(self, request, *args, **kwargs):
        try:
            user = User.objects.get(username=request.data["username"])
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            user_task = UserTasks.objects.get(username=user, title=request.data["title"])
        except UserTasks.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)

        # Update fields dynamically
        for field in ["problem", "dueDate", "title", "discription", "completed", "starred", "solved"]:
            if field in request.data:
                setattr(user_task, field, request.data[field])

        user_task.save()

        return Response(Task_Serializer(user_task).data, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        try:
            user = User.objects.get(username=request.data["username"])
        except UserTasks.DoesNotExist:
            return Response({"error": "User Not Found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            user_task = UserTasks.objects.get(username=user, title=request.data["title"])
        except UserTasks.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
        
        user_task.delete()

        return Response(Task_Serializer(user_task).data, status=status.HTTP_200_OK)


class DiscussionPostManage(APIView):
    def get(self, request):
        posts = DiscussionPost.objects.all()
        serialized_posts = DiscussionPost_Serializer(posts, many=True)
        return Response(serialized_posts.data, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            user = User.objects.get(username=request.data["username"])
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        post = DiscussionPost.objects.create(
            username=user,  
            title=request.data["title"],
            discription=request.data["discription"],
            likes=0,
            dislikes=0,
            comments=0,
        )

        serialized_post = DiscussionPost_Serializer(post)
        return Response(serialized_post.data, status=status.HTTP_201_CREATED)

    def put(self, request):
        try:
            user = User.objects.get(username=request.data["username"])
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            post = DiscussionPost.objects.get(user=user, title=request.data["title"])
        except DiscussionPost.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        
        for field in ["title", "description", "likes", "dislikes", "comments"]:
            if field in request.data:
                setattr(post, field, request.data[field])
        
        post.save()
        return Response(DiscussionPost_Serializer(post).data, status=status.HTTP_200_OK)

    def delete(self, request):
        try:
            user = User.objects.get(username=request.data["username"])
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            post = DiscussionPost.objects.get(user=user, title=request.data["title"])
        except DiscussionPost.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        
        post.delete()
        return Response({"message": "Post deleted successfully"}, status=status.HTTP_200_OK)
class DiscussionReplyManage(APIView):
    def get(self, request):
        # Retrieve discussion post using query parameters
        title = request.query_params.get("title")
        try:
            post = DiscussionPost.objects.get(title=title)
        except DiscussionPost.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Filter replies using the correct field name
        replies = ReplyPost.objects.filter(parent=post)
        if not replies.exists():
            return Response({"error": "No replies found"}, status=status.HTTP_404_NOT_FOUND)
        
        serialized_replies = ReplyPost_Serializer(replies, many=True)
        return Response(serialized_replies.data, status=status.HTTP_200_OK)

    def post(self, request):
        try:
            user = User.objects.get(username=request.data["username"])
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            post = DiscussionPost.objects.get(title=request.data["title"])
        except DiscussionPost.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Create the reply using the correct field names
        reply = ReplyPost.objects.create(
            username=user,
            parent=post,
            discription=request.data["discription"],  # corrected field name
            likes=0,
            dislikes=0,
        )
        serialized_reply = ReplyPost_Serializer(reply)
        return Response(serialized_reply.data, status=status.HTTP_201_CREATED)

    def put(self, request):
        try:
            user = User.objects.get(username=request.data["username"])
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            post = DiscussionPost.objects.get(title=request.data["title"])
        except DiscussionPost.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            reply = ReplyPost.objects.get(username=user, parent=post)
        except ReplyPost.DoesNotExist:
            return Response({"error": "Reply not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Update allowed fields
        for field in ["description", "likes", "dislikes"]:
            if field in request.data:
                setattr(reply, field, request.data[field])
        
        reply.save()
        return Response(ReplyPost_Serializer(reply).data, status=status.HTTP_200_OK)

    def delete(self, request):
        try:
            user = User.objects.get(username=request.data["username"])
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            post = DiscussionPost.objects.get(title=request.data["title"])
        except DiscussionPost.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            reply = ReplyPost.objects.get(username=user, parent=post)
        except ReplyPost.DoesNotExist:
            return Response({"error": "Reply not found"}, status=status.HTTP_404_NOT_FOUND)
        
        reply.delete()
        return Response({"message": "Reply deleted successfully"}, status=status.HTTP_200_OK)

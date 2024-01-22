"""leaderboard URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth.models import User, Group
from rest_framework import serializers, viewsets, routers, permissions
from leaderboard import views, root, friends, users
from rest_framework.authtoken.views import obtain_auth_token


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ["url", "username", "email", "is_staff", "groups"]


class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ["url", "name"]


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


router = routers.DefaultRouter()
router.register(r"users", UserViewSet)
router.register(r"groups", GroupViewSet)


urlpatterns = [
    path("", root.api_root),
    path('api/',include('leaderboard.api.urls')),
    path('accounts/', include('allauth.urls')),
    path('api/token/', obtain_auth_token, name='api_token_auth'),
    #path('accounts/profile/', views.UserProfileView.as_view(), name='user_profile'),
    path(
        "codeforces/",
        views.CodeforcesLeaderboard.as_view(),
        name="codeforces-leaderboard",
    ),
    path('contest-rankings/',views.LeetcodeCCPSAPIView),
    path(
        "leetcode/",
        views.LeetcodeLeaderboard.as_view(),
        name="leetcode-leaderboard",
    ),
    path(
        "codechef/",
        views.CodechefLeaderboard.as_view(),
        name="codechef-leaderboard",
    ),
    path("github/", views.GithubUserAPI.as_view(), name="github-leaderboard"),
    path(
        "openlake/",
        views.GithubOrganisationAPI.as_view(),
        name="openlake-leaderboard",
    ),
    path(
        "codeforcesFA/",
        friends.codeforcesFriendAddition,
        name="codeforcesFA",
    ),
    path(
        "codeforcesFD/",
        friends.codeforcesFriendDeletion,
        name="codeforcesFD",
    ),
    path(
        "codeforcesFL/",
        friends.codeforcesFriendList,
        name="codeforcesFL",
    ),
    path(
        "codechefFA/",
        friends.codechefFriendAddition,
        name="codechefFA",
    ),
    path(
        "codechefFD/",
        friends.codechefFriendDeletion,
        name="codechefFD",
    ),
    path(
        "codechefFL/",
        friends.codechefFriendList,
        name="codechefFL",
    ),
    path(
        "leetcodeFA/",
        friends.leetcodeFriendAddition,
        name="leetcodeFA",
    ),
    path(
        "leetcodeFD/",
        friends.leetcodeFriendDeletion,
        name="leetcodeFD",
    ),
    path(
        "leetcodeFL/",
        friends.leetcodeFriendList,
        name="leetcodeFL",
    ),
    path(
        "githubFA/",
        friends.githubFriendAddition,
        name="githubFA",
    ),
    path(
        "githubFD/",
        friends.githubFriendDeletion,
        name="githubFD",
    ),
    path(
        "githubFL/",
        friends.githubFriendList,
        name="githubFL",
    ),
    path(
        "openlakeFA/",
        friends.openlakeFriendAddition,
        name="openlakeFA",
    ),
    path(
        "openlakeFD/",
        friends.openlakeFriendDeletion,
        name="openlakeFD",
    ),
    path(
        "openlakeFL/",
        friends.openlakeFriendList,
        name="openlakeFL",
    ),
    path(
        "userDetails/",
        users.getUserDetails,
        name="userDetails",
    ),
    path("admin/", admin.site.urls),
]

urlpatterns += router.urls

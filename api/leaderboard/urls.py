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

from django.contrib import admin
from django.contrib.auth.models import Group
from django.urls import include, path
from rest_framework import permissions, routers, serializers, viewsets
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from leaderboard import friends, root, users, views

from .models import User

from .analytics_views import UnifiedAnalyticsView

from leaderboard.trends_views import (
    leetcode_heatmap,
    leetcode_linechart,
    codeforces_heatmap,
    codeforces_linechart,
    unified_heatmap,
    unified_linechart,
)

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
    path("api/", include("leaderboard.api.urls")),
    path(
        "codeforces/",
        views.CodeforcesLeaderboard.as_view(),
        name="codeforces-leaderboard",
    ),
    path("contest-rankings/", views.LeetcodeCCPSAPIView),
    path(
        "leetcode/",
        views.LeetcodeLeaderboard.as_view(),
        name="leetcode-leaderboard",
    ),
    path(
        "usertasks/",
        views.UserTasksManage.as_view(),
        name="user-tasks",
    ),
    path(
        "discussionpost/",
        views.DiscussionPostManage.as_view(),
        name="discussion-post",
    ),
    path(
        "replypost/",
        views.DiscussionReplyManage.as_view(),
        name="discussion-reply",
    ),
    path(
        "codechef/",
        views.CodechefLeaderboard.as_view(),
        name="codechef-leaderboard",
    ),
    path(
        "atcoder/",
        views.AtcoderViewSet.as_view(),
        name="atcoder-leaderboard",
    ),
    path("github/", views.GithubUserAPI.as_view(), name="github-leaderboard"),
    path(
        "openlake/",
        views.GithubOrganisationAPI.as_view(),
        name="openlake-leaderboard",
    ),
    path(
        "achievements/",
        views.AchievementManage.as_view(),
        name="achievements",
    ),
    path(
        "achievements/unlock/",
        views.AchievementUnlock.as_view(),
        name="achievement-unlock",
    ),
    path(
        "usernames/",
        views.UserNamesList.as_view(),
        name="usernames-list",
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
        "atcoderFA/",
        friends.atcoderFriendAddition,
        name="atcoderFA",
    ),
    path(
        "atcoderFD/",
        friends.atcoderFriendDeletion,
        name="atcoderFD",
    ),
    path(
        "atcoderFL/",
        friends.atcoderFriendList,
        name="atcoderFL",
    ),
    path(
        "userDetails/",
        users.getUserDetails,
        name="userDetails",
    ),
    
    path("admin/", admin.site.urls),
    path("analytics/unified/", UnifiedAnalyticsView.as_view(), name="unified-analytics"),
    path("trends/leetcode/heatmap/",     leetcode_heatmap,      name="lt-trend-heatmap"),
    path("trends/leetcode/linechart/",   leetcode_linechart,    name="lt-trend-linechart"),
    path("trends/codeforces/heatmap/",   codeforces_heatmap,    name="cf-trend-heatmap"),
    path("trends/codeforces/linechart/", codeforces_linechart,  name="cf-trend-linechart"),
    path("trends/unified/heatmap/",      unified_heatmap,       name="unified-trend-heatmap"),
    path("trends/unified/linechart/",    unified_linechart,     name="unified-trend-linechart"),
]

urlpatterns += router.urls

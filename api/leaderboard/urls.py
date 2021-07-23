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
from django.urls import path, include
from django.contrib.auth.models import User, Group

from rest_framework import serializers, viewsets, routers, permissions
from leaderboard import views


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
    path("", views.api_root),
    path("api-auth/", include("rest_framework.urls", namespace="rest_framework")),
    path("github/user", views.GithubUserAPI.as_view(), name="gh-user-details"),
    path(
        "github/organisation",
        views.GithubOrganisationAPI.as_view(),
        name="gh-org-leaderboard",
    ),
    path(
        "codeforces/",
        views.CodeforcesLeaderboard.as_view(),
        name="codeforces-leaderboard",
    ),
    path(
        "codeforces/<int:pk>",
        views.CodeforcesUserAPI.as_view(),
        name="codeforces-user-details",
    ),
    path("codechef/", views.CodechefAPI.as_view(), name="codechef-leaderboard"),
    path("admin/", admin.site.urls),
]

urlpatterns += router.urls

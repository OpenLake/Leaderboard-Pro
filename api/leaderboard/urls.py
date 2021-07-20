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
from django.urls import path

from leaderboard import views

urlpatterns = [
    path('github/user', views.GithubUserAPI.as_view()),
    path('github/organisation', views.GithubOrganisationAPI.as_view()),
    path('codeforces/', views.CodeforcesAPI.as_view()),
    path('codechef/', views.CodechefAPI.as_view()),
    path('admin/', admin.site.urls),
]

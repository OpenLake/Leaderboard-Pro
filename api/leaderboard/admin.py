from django.contrib import admin
from leaderboard.models import CodeforcesUser, GitHubUser

admin.site.register(CodeforcesUser)
admin.site.register(GitHubUser)

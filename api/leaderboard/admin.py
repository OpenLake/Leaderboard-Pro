from django.contrib import admin
from leaderboard.models import CodeforcesUser, GitHubUser, CodechefUser

admin.site.register(CodeforcesUser)
admin.site.register(GitHubUser)
admin.site.register(CodechefUser)
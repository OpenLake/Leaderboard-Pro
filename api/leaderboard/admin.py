from django.contrib import admin
from leaderboard.models import (
    codeforcesUser,
    githubUser,
    codechefUser,
    openlakeContributor,
    AppUser
)

admin.site.register(codeforcesUser)
admin.site.register(githubUser)
admin.site.register(codechefUser)
admin.site.register(openlakeContributor)
admin.site.register(AppUser)

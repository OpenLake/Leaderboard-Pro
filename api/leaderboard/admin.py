from django.contrib import admin
from leaderboard.models import (
    codeforcesUser,
    githubUser,
    codechefUser,
    openlakeContributor,
)

admin.site.register(codeforcesUser)
admin.site.register(githubUser)
admin.site.register(codechefUser)
admin.site.register(openlakeContributor)

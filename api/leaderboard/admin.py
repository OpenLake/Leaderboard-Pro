from django.contrib import admin
from leaderboard.models import (
    codeForcesUser,
    gitHubUser,
    codeChefUser,
    openLakeContributor,
)

admin.site.register(codeForcesUser)
admin.site.register(gitHubUser)
admin.site.register(codeChefUser)
admin.site.register(openLakeContributor)

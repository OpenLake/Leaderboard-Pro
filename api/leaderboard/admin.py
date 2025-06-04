from django.contrib import admin

from leaderboard.models import (LeetcodeUser, UserNames, UserTasks,
                                codechefUser, codeforcesUser, githubUser,
                                openlakeContributor)

admin.site.register(codeforcesUser)
admin.site.register(githubUser)
admin.site.register(codechefUser)
admin.site.register(openlakeContributor)
admin.site.register(UserNames)
admin.site.register(LeetcodeUser)
admin.site.register(UserTasks)

from leaderboard.models import CodeforcesUser

#

CF_USERS = ["DmitriyH", "Fefer_Ivan", "tourist"]
for username in CF_USERS:
    CodeforcesUser(username=username).save()

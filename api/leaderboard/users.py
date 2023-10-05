from leaderboard.serializers import CC_Serializer, CF_Serializer, OL_Serializer, LT_Serializer, GH_Serializer, UserNamesSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import permission_classes, api_view
from leaderboard.models import UserNames, codechefUser, codeforcesUser, LeetcodeUser, githubUser, openlakeContributor

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def getUserDetails(request):
    user = request.user
    username = user.username
    email = user.email
    userDetails = UserNames.objects.get(user=user)
    userDetails = UserNamesSerializer(userDetails).data
    try:
        codechefDetails = codechefUser.objects.get(username=userDetails["cc_uname"])
        codechefDetails = CC_Serializer(codechefDetails).data
    except:
        codechefDetails = {}
    try:
        codeforcesDetails = codeforcesUser.objects.get(username=userDetails["cf_uname"])
        codeforcesDetails = CF_Serializer(codeforcesDetails).data
    except:
        codeforcesDetails = {}
    try:
        leetcodeDetails = LeetcodeUser.objects.get(username=userDetails["lt_uname"])
        leetcodeDetails = LT_Serializer(leetcodeDetails).data
    except:
        leetcodeDetails = {}
    try:
        githubDetails = githubUser.objects.get(username=userDetails["gh_uname"])
        githubDetails = GH_Serializer(githubDetails).data
    except:
        githubDetails = {}
    try:
        openlakeDetails = openlakeContributor.objects.get(username=userDetails["ol_uname"])
        openlakeDetails = OL_Serializer(openlakeDetails).data
    except:
        openlakeDetails = {}
    return Response({
        "username" : username,
        "email" : email,
        "codechef" : codechefDetails,
        "codeforces" : codeforcesDetails,
        "github" : githubDetails,
        "leetcode" : leetcodeDetails,
        "openlake" : openlakeDetails
    })
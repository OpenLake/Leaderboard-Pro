from rest_framework.decorators import api_view, permission_classes
from rest_framework.reverse import reverse
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(["GET"])
@permission_classes((AllowAny,))
def api_root(request, format=None):
    return Response(
        {
            "codeforces": reverse(
                "codeforces-leaderboard", request=request, format=format
            ),
            "codechef": reverse(
                "codechef-leaderboard", request=request, format=format
            ),
            "github": reverse(
                "github-leaderboard", request=request, format=format
            ),
            "openlake": reverse(
                "openlake-leaderboard", request=request, format=format
            ),
            "leetcode": reverse(
                "leetcode-leaderboard", request=request, format=format
            ),
            "codeforces-friend-addition" : reverse(
                "codeforcesFA", request=request, format=format
            ),
            "codeforces-friend-deletion" : reverse(
                "codeforcesFD", request=request, format=format
            ),
            "codeforces-friend-list" : reverse(
                "codeforcesFL", request=request, format=format
            ),
            "codechef-friend-addition" : reverse(
                "codechefFA", request=request, format=format
            ),
            "codechef-friend-deletion" : reverse(
                "codechefFD", request=request, format=format
            ),
            "codechef-friend-list" : reverse(
                "codechefFL", request=request, format=format
            ),
            "leetcode-friend-addition" : reverse(
                "leetcodeFA", request=request, format=format
            ),
            "leetcode-friend-deletion" : reverse(
                "leetcodeFD", request=request, format=format
            ),
            "leetcode-friend-list" : reverse(
                "leetcodeFL", request=request, format=format
            ),
            "github-friend-addition" : reverse(
                "githubFA", request=request, format=format
            ),
            "github-friend-deletion" : reverse(
                "githubFD", request=request, format=format
            ),
            "github-friend-list" : reverse(
                "githubFL", request=request, format=format
            ),
            "openlake-friend-addition" : reverse(
                "openlakeFA", request=request, format=format
            ),
            "openlake-friend-deletion" : reverse(
                "openlakeFD", request=request, format=format
            ),
            "openlake-friend-list" : reverse(
                "openlakeFL", request=request, format=format
            ),
            "user-details" : reverse(
                "userDetails", request=request, format=format
            ),
            # urls from from router:
            "users": reverse("user-list", request=request, format=format),
            "groups": reverse("group-list", request=request, format=format),
        }
    )
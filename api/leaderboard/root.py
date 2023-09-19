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
            "codeforces-friend-addition" : reverse(
                "codeforcesFA", request=request, format=format
            ),
            "codeforces-friend-deletion" : reverse(
                "codeforcesFD", request=request, format=format
            ),
            "codeforces-friend-list" : reverse(
                "codeforcesFL", request=request, format=format
            ),
            # urls from from router:
            "users": reverse("user-list", request=request, format=format),
            "groups": reverse("group-list", request=request, format=format),
        }
    )
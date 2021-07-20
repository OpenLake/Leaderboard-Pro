from rest_framework.response import Response
from rest_framework.views import APIView

from datetime import datetime
from random import randint, choice
import requests


class GithubUserAPI(APIView):
    """
    Collects Github data for registered users
    """

    REGISTERED_GH_USERS = [
        "KShivendu",
        "ArsphreetS",
        # Contributors may add their Github username here
    ]

    def _get_github_data(self, username: str, days_passed=7):
        """
        TODO
        """

        return {
            "username": username,
            "commits": randint(1, 100),
            "rank": randint(1, 100),
        }

    def get(self, request, format=None):
        gh_users = [
            self._get_github_data(gh_username)
            for gh_username in self.REGISTERED_GH_USERS
        ]
        gh_users.sort(key=lambda r: r.get("rank", 0))

        return Response(gh_users)


class GithubOrganisationAPI(APIView):
    """
    Collects Github data for GH_ORG
    """

    GH_ORG = "OpenLake"

    def _get_github_data(self, days_passed=7):
        """
        TODO:
        """

        repos = requests.get("https://api.github.com/users/OpenLake/repos").json()

        return [
            {
                "username": f"gh_user_{i}",
                "commits": randint(1, 100),
                "rank": randint(1, 100),
                "contributions": {choice(repos)["name"]: randint(1, 100)},
            }
            for i in range(10)
        ]

    def get(self, request, format=None):
        gh_users = self._get_github_data()
        gh_users.sort(key=lambda r: r.get("rank", 0))

        return Response(gh_users)


class CodeforcesAPI(APIView):
    """
    Collects data from codeforces API
    """

    REGISTERED_CF_USERS = [
        "DmitriyH",
        "Fefer_Ivan",
        "tourist",
        # Contributors may add their Github username here
    ]

    def _get_cf_data(self, days_passed=7):
        """
        TODO:
        """

        res = []
        for cf_user in self.REGISTERED_CF_USERS:
            user_info = requests.get(f"https://codeforces.com/api/user.info?handles={cf_user}") \
                .json()["result"][0]

            res.append({
                "username": cf_user,
                "maxRating": user_info.get('max_rating',0),
                "rating": user_info.get('rating', 0),
                "lastActivity": user_info.get('lastOnlineTimeSeconds', datetime.max.timestamp()),
            })

        return res

    def get(self, request, format=None):
        gh_users = self._get_cf_data()
        gh_users.sort(key=lambda r: -r.get("rating", 0))

        return Response(gh_users)


class CodechefAPI(APIView):
    """
    TODO
    """

    def get(self, request, format=None):
        # TODO

        return Response("TODO")

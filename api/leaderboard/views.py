from leaderboard.models import (
    codeforcesUser,
    codeforcesUserRatingUpdate,
    githubUser,
    codechefUser,
    openlakeContributor,
    LeetcodeUser,

)
from leaderboard.serializers import (
    CF_Serializer,
    CC_Serializer,
    GH_Serializer,
    OL_Serializer,
    LT_Serializer
)
from knox.models import AuthToken
from rest_framework.response import Response


from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework.reverse import reverse
from rest_framework import generics, mixins, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model
from datetime import datetime
import requests

from django.http import JsonResponse

import requests
import urllib.parse
    

import re

import logging
logger = logging.getLogger(__name__)
from django.http import JsonResponse

#MAX_DATE_TIMESTAMP = datetime.max.timestamp()

from django.db import connection
from django.db.utils import OperationalError

class GithubUserAPI(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    """
    Collects Github data for registered users
    """

    queryset = githubUser.objects.all()
    serializer_class = GH_Serializer

    def get(self, request):
        gh_users = githubUser.objects.all()
        serializer = GH_Serializer(gh_users, many=True)
        return Response(serializer.data)    

    def post(self, request):
        username = request.data["username"]
        gh_user = githubUser(username=username)
        
        gh_user.save()
        return Response(
            GH_Serializer(gh_user).data, status=status.HTTP_201_CREATED
        )


class GithubOrganisationAPI(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    """
    Collects Github data for GH_ORG
    """

    queryset = openlakeContributor.objects.all()
    serializer_class = OL_Serializer

    def get(self, request):
        ol_contributors = openlakeContributor.objects.all()
        serializer = OL_Serializer(ol_contributors, many=True)
        return Response(serializer.data)


class CodeforcesLeaderboard(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    queryset = codeforcesUser.objects.all()
    serializer_class = CF_Serializer

    def get(self, request):
        cf_users = codeforcesUser.objects.all()
        serializer = CF_Serializer(cf_users, many=True)
        return Response(serializer.data)

    def post(self, request):
        username = request.data["username"]
        cf_user = codeforcesUser(username=username)
        cf_user.save()

        return Response(
            CF_Serializer(cf_user).data, status=status.HTTP_201_CREATED
        )


class CodechefLeaderboard(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    queryset = codechefUser.objects.all()
    serializer_class = CC_Serializer
    def get(self, request):
        cc_users = codechefUser.objects.all()
        serializer = CC_Serializer(cc_users, many=True)
        return Response(serializer.data)

    def post(self, request):
        username = request.data["username"]
        cc_user = codechefUser(username=username)
        cc_user.save()
        return Response(
            CC_Serializer(cc_user).data, status=status.HTTP_201_CREATED
        )
        
class LeetcodeLeaderboard(
    mixins.ListModelMixin, mixins.CreateModelMixin, generics.GenericAPIView
):
    queryset = LeetcodeUser.objects.all()
    serializer_class = LT_Serializer
    def get(self, request):
        lt_users = LeetcodeUser.objects.all()
        serializer = LT_Serializer(lt_users, many=True)
        return Response(serializer.data)

    def post(self, request):
        username = request.data["username"]
        lt_user = LeetcodeUser(username=username)
        lt_user.save()
        return Response(
            LT_Serializer(lt_user).data, status=status.HTTP_201_CREATED
        )


from django.db import connection
from django.db.utils import OperationalError

def get_table_data():
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT * FROM ccpsleetcoderanking")
            columns = [col[0] for col in cursor.description]  # Get the column names
            data = cursor.fetchall()

            results = []
        
            for row in data:
                result = {}
                for i, value in enumerate(row):
                    result[columns[i]] = value
                results.append(result)

            return results
    except OperationalError as e:
        print(f"Error: {e}")

def LeetcodeCCPSAPIView(request):
    
    
   

    data = get_table_data()
    

   
   
    return JsonResponse(data, safe=False)
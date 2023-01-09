from rest_framework.serializers import ModelSerializer
from leaderboard.models import UserNames,LeetcodeFriends,GithubFriends,CodeforcesFriends,CodechefFriends
from rest_framework import serializers
from django.contrib.auth.models import User

class UserNamesSerializer(ModelSerializer):
    class Meta:
        model=UserNames
        fields='__all__'
class CodeforcesFriendsSerializer(ModelSerializer):
    class Meta:
        model=CodeforcesFriends
        fields='__all__'
class CodechefFriendsSerializer(ModelSerializer):
    class Meta:
        model=CodechefFriends
        fields='__all__'
class LeetcodeFriendsSerializer(ModelSerializer):
    class Meta:
        model=LeetcodeFriends
        fields='__all__'
class GithubFriendsSerializer(ModelSerializer):
    class Meta:
        model=GithubFriends
        fields='__all__'
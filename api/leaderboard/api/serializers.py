from rest_framework.serializers import ModelSerializer
from leaderboard.models import UserNames
from rest_framework import serializers
from django.contrib.auth.models import User

class UserNamesSerializer(ModelSerializer):
    class Meta:
        model=UserNames
        fields='__all__'
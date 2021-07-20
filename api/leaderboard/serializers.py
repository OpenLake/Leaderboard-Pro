from django.db.models import fields
from rest_framework import serializers
from leaderboard.models import CodeforcesUser

class Cf_Serializer(serializers.ModelSerializer):
    """
    TODO
    """
    maxRating = serializers.IntegerField(source='max_rating')
    lastActivity = serializers.IntegerField(source='last_activity')

    class Meta:
        model = CodeforcesUser
        fields = ["id", "username", "rating", "maxRating", "lastActivity"]
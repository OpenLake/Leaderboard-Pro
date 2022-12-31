from rest_framework.serializers import ModelSerializer
from leaderboard.models import UserNames


class UserNamesSerializer(ModelSerializer):
    class Meta:
        model=UserNames
        fields='__all__'
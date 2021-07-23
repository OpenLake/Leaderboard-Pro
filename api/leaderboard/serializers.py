from django.db.models import fields
from rest_framework import serializers
from leaderboard.models import CodeforcesUser, CodeforcesUserRatingUpdate


class Cf_Serializer(serializers.ModelSerializer):
    """
    TODO
    """

    def create(self, validated_data):
        return CodeforcesUser.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `CodeforcesUser` instance, given the validated data.
        """
        instance.rating = validated_data.get("rating", instance.rating)
        instance.max_rating = validated_data.get("maxRating", instance.max_rating)
        instance.last_activity = validated_data.get(
            "lastActivity", instance.last_activity
        )
        instance.save()
        return instance

    class Meta:
        model = CodeforcesUser
        fields = ["id", "username", "rating", "avatar", "max_rating", "last_activity"]


class Cf_RatingUpdate_Serializer(serializers.ModelSerializer):
    class Meta:
        model = CodeforcesUserRatingUpdate
        fields = ["rating", "timestamp"]


class Cf_User_Serializer(Cf_Serializer):
    rating_updates = Cf_RatingUpdate_Serializer(many=True)

    class Meta:
        model = CodeforcesUser
        fields = [
            "id",
            "username",
            "rating",
            "avatar",
            "max_rating",
            "last_activity",
            "rating_updates",
        ]

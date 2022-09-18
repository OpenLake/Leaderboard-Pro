from django.db.models import fields
from rest_framework import serializers
from leaderboard.models import CodeforcesUser, CodeforcesUserRatingUpdate, CodechefUser, GitHubUser


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

class CC_Serializer(serializers.ModelSerializer):
    """
    TODO
    """

    def create(self, validated_data):
        return CodechefUser.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `CodechefUser` instance, given the validated data.
        """
        instance.rating = validated_data.get("rating", instance.rating)
        instance.max_rating = validated_data.get("maxRating", instance.max_rating)
        instance.Global_rank = validated_data.get("globalrank", instance.Global_rank)
        instance.Country_rank = validated_data.get("countryrank", instance.Country_rank)
        instance.save()
        return instance

    class Meta:
        model = CodechefUser
        fields = ["id", "username", "rating", "max_rating", "Global_rank", "Country_rank"]


class GH_Serializer(serializers.ModelSerializer):
    """
    TODO
    """

    def create(self, validated_data):
        return GitHubUser.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `CodechefUser` instance, given the validated data.
        """
        instance.contributions = validated_data.get("contributions", instance.contributions)
        instance.repositories = validated_data.get("repositories", instance.repositories)
        instance.stars = validated_data.get("stars", instance.stars)
        instance.save()
        return instance

    class Meta:
        model = GitHubUser
        fields = ["id", "username", "contributions", "repositories", "stars"]
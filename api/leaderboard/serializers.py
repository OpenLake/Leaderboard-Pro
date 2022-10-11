from rest_framework import serializers
from leaderboard.models import (
    codeForcesUser,
    codeForcesUserRatingUpdate,
    codeChefUser,
    gitHubUser,
    openLakeContributor,
)


class Cf_Serializer(serializers.ModelSerializer):
    """
    TODO
    """

    def create(self, validated_data):
        return codeForcesUser.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `codeForcesUser`
        instance, given the validated data.
        """
        instance.rating = validated_data.get("rating", instance.rating)
        instance.max_rating = validated_data.get(
            "maxRating", instance.max_rating
        )
        instance.last_activity = validated_data.get(
            "lastActivity", instance.last_activity
        )
        instance.save()
        return instance

    class Meta:
        model = codeForcesUser
        fields = [
            "id",
            "username",
            "rating",
            "avatar",
            "max_rating",
            "last_activity",
        ]


class Cf_RatingUpdate_Serializer(serializers.ModelSerializer):
    class Meta:
        model = codeForcesUserRatingUpdate
        fields = ["rating", "timestamp"]


class Cf_User_Serializer(Cf_Serializer):
    rating_updates = Cf_RatingUpdate_Serializer(many=True)

    class Meta:
        model = codeForcesUser
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
        return codeChefUser.objects.create(**validated_data)

    # def update(self, instance, validated_data):
    #     """
    #     Update and return an existing `codechefUser`
    #     instance, given the validated data.
    #     """
    #     instance.rating = validated_data.get("rating", instance.rating)
    #     instance.max_rating = validated_data.get("maxRating",
    #     instance.max_rating)
    #     instance.Global_rank = validated_data.get("globalrank",
    #     instance.Global_rank)
    #     instance.Country_rank = validated_data.get("countryrank",
    #     instance.Country_rank)
    #     instance.save()
    #     return instance

    class Meta:
        model = codeChefUser
        fields = [
            "id",
            "username",
            "rating",
            "max_rating",
            "Global_rank",
            "Country_rank",
        ]


class GH_Serializer(serializers.ModelSerializer):
    """
    TODO
    """

    def create(self, validated_data):
        return gitHubUser.objects.create(**validated_data)

    # def update(self, instance, validated_data):
    #     """
    #     Update and return an existing `GithubUser`
    #     instance, given the validated data.
    #     """
    #     instance.contributions = validated_data.get("contributions",
    #     instance.contributions)
    #     instance.repositories = validated_data.get("repositories",
    #     instance.repositories)
    #     instance.stars = validated_data.get("stars", instance.stars)
    #     instance.save()
    #     return instance

    class Meta:
        model = gitHubUser
        fields = ["id", "username", "contributions", "repositories", "stars"]


class OL_Serializer(serializers.ModelSerializer):
    """
    TODO
    """

    def create(self, validated_data):
        return openLakeContributor.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `OpenLake Contributor` instance,
        given the validated data.
        """
        instance.contributions = validated_data.get(
            "contributions", instance.contributions
        )
        instance.save()
        return instance

    class Meta:
        model = openLakeContributor
        fields = ["id", "username", "contributions"]

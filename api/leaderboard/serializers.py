from rest_framework import serializers
from leaderboard.models import (
    codeforcesUser,
    codeforcesUserRatingUpdate,
    codechefUser,
    githubUser,
    openlakeContributor,
    LeetcodeUser
)

class UpdateListSerializer(serializers.ListSerializer):
  
    def update(self, instances, validated_data):      
        instance_hash = {index: instance for index, instance in enumerate(instances)}
        result = [
            self.child.update(instance_hash[index], attrs)
            for index, attrs in enumerate(validated_data)
        ]
        return result

class Cf_Serializer(serializers.ModelSerializer):
    """
    TODO
    """

    def create(self, validated_data):
        return codeforcesUser.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `codeforcesUser`
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
        model = codeforcesUser
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
        model = codeforcesUserRatingUpdate
        fields = ["rating", "timestamp"]


class Cf_User_Serializer(Cf_Serializer):
    rating_updates = Cf_RatingUpdate_Serializer(many=True)

    class Meta:
        model = codeforcesUser
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

    class Meta:
        model = codechefUser
        fields = '__all__'


class CC_Update_Serializer(serializers.ModelSerializer):

    class Meta:
        model = codechefUser
        fields = '__all__'
        read_only_fields = ("username",)
        list_serializer_class = UpdateListSerializer


class LT_Serializer(serializers.ModelSerializer):

    class Meta:
        model = LeetcodeUser
        fields = '__all__'


class LT_Update_Serializer(serializers.ModelSerializer):

    class Meta:
        model = LeetcodeUser
        fields = '__all__'
        read_only_fields = ("username",)
        list_serializer_class = UpdateListSerializer


class GH_Serializer(serializers.ModelSerializer):

    class Meta:
        model = githubUser
        fields = '__all__'


class GH_Update_Serializer(serializers.ModelSerializer):

    class Meta:
        model = githubUser
        fields = '__all__'
        read_only_fields = ("username",)
        list_serializer_class = UpdateListSerializer


class OL_Serializer(serializers.ModelSerializer):
    """
    TODO
    """

    def create(self, validated_data):
        return openlakeContributor.objects.create(**validated_data)

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
        model = openlakeContributor
        fields = ["id", "username", "contributions"]
        
class Name_Serializer(serializers.Serializer):
    friendName = serializers.CharField(max_length=100)
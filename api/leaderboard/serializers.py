from rest_framework import serializers
from leaderboard.models import (
    codeforcesUser,
    codeforcesUserRatingUpdate,
    codechefUser,
    githubUser,
    openlakeContributor,
    LeetcodeUser,
    UserNames,
    UserTasks,
)

class UpdateListSerializer(serializers.ListSerializer):
  
    def update(self, instances, validated_data):      
        instance_hash = {index: instance for index, instance in enumerate(instances)}
        result = [
            self.child.update(instance_hash[index], attrs)
            for index, attrs in enumerate(validated_data)
        ]
        return result

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

class CF_Serializer(serializers.ModelSerializer):

    class Meta:
        model = codeforcesUser
        fields = '__all__'

class CF_Update_Serializer(serializers.ModelSerializer):

    class Meta:
        model = codeforcesUser
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

class UserNamesSerializer(serializers.ModelSerializer):
    class Meta:
        model=UserNames
        fields='__all__'


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

class Task_Serializer(serializers.Serializer):
    
    class Meta:
        model = UserTasks
        fields = '__all__'

class Task_Update_Serializer(serializers.Serializer):
    class Meta:
        model = UserTasks
        fields = '__all__'
        read_only_fields = ("user",)
        list_serializer_class = UpdateListSerializer
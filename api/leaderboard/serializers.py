from rest_framework import serializers

from leaderboard.models import (
    DiscussionPost,
    LeetcodeUser,
    ReplyPost,
    UserNames,
    UserTasks,
    codechefUser,
    codeforcesUser,
    codeforcesUserRatingUpdate,
    githubUser,
    openlakeContributor,
    AtcoderUser,
    Achievement,
    Organization,
    OrganizationMember
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
        fields = "__all__"


class CC_Update_Serializer(serializers.ModelSerializer):

    class Meta:
        model = codechefUser
        fields = "__all__"
        read_only_fields = ("username",)
        list_serializer_class = UpdateListSerializer


class CF_Serializer(serializers.ModelSerializer):

    class Meta:
        model = codeforcesUser
        fields = "__all__"


class CF_Update_Serializer(serializers.ModelSerializer):

    class Meta:
        model = codeforcesUser
        fields = "__all__"
        read_only_fields = ("username",)
        list_serializer_class = UpdateListSerializer


class LT_Serializer(serializers.ModelSerializer):

    class Meta:
        model = LeetcodeUser
        fields = "__all__"


class LT_Update_Serializer(serializers.ModelSerializer):

    class Meta:
        model = LeetcodeUser
        fields = "__all__"
        read_only_fields = ("username",)
        list_serializer_class = UpdateListSerializer


class GH_Serializer(serializers.ModelSerializer):

    class Meta:
        model = githubUser
        fields = "__all__"


class GH_Update_Serializer(serializers.ModelSerializer):

    class Meta:
        model = githubUser
        fields = "__all__"
        read_only_fields = ("username",)
        list_serializer_class = UpdateListSerializer


class UserNamesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNames
        fields = "__all__"


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


class Task_Serializer(serializers.ModelSerializer):
    class Meta:
        model = UserTasks
        fields = "__all__"


class Task_Update_Serializer(serializers.Serializer):
    class Meta:
        model = UserTasks
        fields = "__all__"
        read_only_fields = ("user",)
        list_serializer_class = UpdateListSerializer


class DiscussionPost_Serializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="username.username")

    class Meta:
        model = DiscussionPost
        fields = "__all__"


class ReplyPost_Serializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="username.username")

    class Meta:
        model = ReplyPost
        fields = "__all__"


class AtcoderUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AtcoderUser
        fields = "__all__"


class AC_Update_Serializer(serializers.ModelSerializer):
    class Meta:
        model = AtcoderUser
        fields = "__all__"
        read_only_fields = ("username",)
        list_serializer_class = UpdateListSerializer


class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = "__all__"


class OrganizationSerializer(serializers.ModelSerializer):
    admin_username = serializers.ReadOnlyField(source="admin.username")
    member_count = serializers.SerializerMethodField()
    is_admin = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = [
            "id",
            "name",
            "description",
            "admin",
            "admin_username",
            "is_private",
            "join_code",
            "created_at",
            "member_count",
            "is_admin",
        ]
        read_only_fields = ["admin", "join_code", "created_at"]

    def get_member_count(self, obj):
        return obj.memberships.count()

    def get_is_admin(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return obj.admin == request.user
        return False


class OrganizationMemberSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source="user.username")
    organization_name = serializers.ReadOnlyField(source="organization.name")

    class Meta:
        model = OrganizationMember
        fields = [
            "id",
            "organization",
            "organization_name",
            "user",
            "username",
            "joined_at",
        ]
import logging

import pymongo
from leaderboard.serializers import Name_Serializer
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

logging.getLogger("pymongo").setLevel(logging.ERROR)
client = pymongo.MongoClient("localhost", 27017)
myDB = client["Friends"]
codechefFriends = myDB["Codechef"]
codeforcesFriends = myDB["Codeforces"]
leetcodeFriends = myDB["Leetcode"]
githubFriends = myDB["Github"]
openlakeFriends = myDB["Openlake"]

import logging

logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def codeforcesFriendAddition(request):
    try:
        logger.error(request.user)
        user = request.user.username
        serializer = Name_Serializer(data=request.data)
        if serializer.is_valid():
            friendEntry = codeforcesFriends.find_one({"_id": user})
            friendName = serializer.validated_data["friendName"]
            if friendEntry is not None:
                friendsList = friendEntry["Friends"]
                if friendName not in friendsList:
                    friendsList.append(friendName)
                filter_criteria = {"_id": user}
                update_operation = {"$set": {"Friends": friendsList}}
                codeforcesFriends.update_one(filter_criteria, update_operation)
            else:
                friendsList = []
                friendsList.append(friendName)
                codeforcesFriends.insert_one({"_id": user, "Friends": friendsList})
            return Response(
                {
                    "status": 200,
                    "message": "Success",
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response({serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response(
            {"status": 400, "message": "Wrong"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def codeforcesFriendDeletion(request):
    try:
        logger.error(request)
        user = request.user.username
        serializer = Name_Serializer(data=request.data)
        if serializer.is_valid():
            friendEntry = codeforcesFriends.find_one({"_id": user})
            friendName = serializer.validated_data["friendName"]
            if friendEntry is not None:
                friendsList = friendEntry["Friends"]
                if friendName in friendsList:
                    friendsList.remove(friendName)
                filter_criteria = {"_id": user}
                update_operation = {"$set": {"Friends": friendsList}}
                codeforcesFriends.update_one(filter_criteria, update_operation)
            else:
                return Response(
                    {"status": 400, "message": "Wrong"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response(
                {
                    "status": 200,
                    "message": "Success",
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response({serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response(
            {"status": 400, "message": "Wrong"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def codeforcesFriendList(request):
    try:
        user = request.user.username
        friendEntry = codeforcesFriends.find_one({"_id": user})
        logger.error(friendEntry)
        friendList = []
        if friendEntry:
            for i in friendEntry["Friends"]:
                friendList.append({"friendName": i})
        serializer = Name_Serializer(friendList, many=True)
        logger.error(serializer.data)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {"status": 400, "message": "Wrong"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def codechefFriendAddition(request):
    try:

        user = request.user.username
        serializer = Name_Serializer(data=request.data)

        if serializer.is_valid():
            friendEntry = codechefFriends.find_one({"_id": user})
            friendName = serializer.validated_data["friendName"]
            if friendEntry is not None:
                friendsList = friendEntry["Friends"]
                if friendName not in friendsList:
                    friendsList.append(friendName)
                filter_criteria = {"_id": user}
                update_operation = {"$set": {"Friends": friendsList}}
                codechefFriends.update_one(filter_criteria, update_operation)
            else:
                friendsList = []
                friendsList.append(friendName)
                codechefFriends.insert_one({"_id": user, "Friends": friendsList})
            return Response(
                {
                    "status": 200,
                    "message": "Success",
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response({serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response(
            {"status": 400, "message": "Wrong"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def codechefFriendDeletion(request):
    try:
        user = request.user.username
        serializer = Name_Serializer(data=request.data)
        if serializer.is_valid():
            friendEntry = codechefFriends.find_one({"_id": user})
            friendName = serializer.validated_data["friendName"]
            if friendEntry is not None:
                friendsList = friendEntry["Friends"]
                if friendName in friendsList:
                    friendsList.remove(friendName)
                filter_criteria = {"_id": user}
                update_operation = {"$set": {"Friends": friendsList}}
                codechefFriends.update_one(filter_criteria, update_operation)
            else:
                return Response(
                    {"status": 400, "message": "Wrong"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response(
                {
                    "status": 200,
                    "message": "Success",
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response({serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response(
            {"status": 400, "message": "Wrong"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def codechefFriendList(request):
    try:
        user = request.user.username
        friendEntry = codechefFriends.find_one({"_id": user})
        friendList = []
        if friendEntry:
            for i in friendEntry["Friends"]:
                friendList.append({"friendName": i})
        serializer = Name_Serializer(friendList, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {"status": 400, "message": "Wrong"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def leetcodeFriendAddition(request):
    try:
        user = request.user.username
        serializer = Name_Serializer(data=request.data)
        if serializer.is_valid():
            friendEntry = leetcodeFriends.find_one({"_id": user})
            friendName = serializer.validated_data["friendName"]
            if friendEntry is not None:
                friendsList = friendEntry["Friends"]
                if friendName not in friendsList:
                    friendsList.append(friendName)
                filter_criteria = {"_id": user}
                update_operation = {"$set": {"Friends": friendsList}}
                leetcodeFriends.update_one(filter_criteria, update_operation)
            else:
                friendsList = []
                friendsList.append(friendName)
                leetcodeFriends.insert_one({"_id": user, "Friends": friendsList})
            return Response(
                {
                    "status": 200,
                    "message": "Success",
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response({serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response(
            {"status": 400, "message": "Wrong"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def leetcodeFriendDeletion(request):
    try:
        user = request.user.username
        serializer = Name_Serializer(data=request.data)
        if serializer.is_valid():
            friendEntry = leetcodeFriends.find_one({"_id": user})
            friendName = serializer.validated_data["friendName"]
            if friendEntry is not None:
                friendsList = friendEntry["Friends"]
                if friendName in friendsList:
                    friendsList.remove(friendName)
                filter_criteria = {"_id": user}
                update_operation = {"$set": {"Friends": friendsList}}
                leetcodeFriends.update_one(filter_criteria, update_operation)
            else:
                return Response(
                    {"status": 400, "message": "Wrong"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response(
                {
                    "status": 200,
                    "message": "Success",
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response({serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response(
            {"status": 400, "message": "Wrong"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def leetcodeFriendList(request):
    try:
        user = request.user.username
        friendEntry = leetcodeFriends.find_one({"_id": user})
        friendList = []
        if friendEntry:
            for i in friendEntry["Friends"]:
                friendList.append({"friendName": i})
        serializer = Name_Serializer(friendList, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {"status": 400, "message": "Wrong"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def githubFriendAddition(request):
    try:
        user = request.user.username
        serializer = Name_Serializer(data=request.data)
        if serializer.is_valid():
            friendEntry = githubFriends.find_one({"_id": user})

            friendName = serializer.validated_data["friendName"]
            if friendEntry is not None:
                friendsList = friendEntry["Friends"]
                if friendName not in friendsList:
                    friendsList.append(friendName)
                filter_criteria = {"_id": user}
                update_operation = {"$set": {"Friends": friendsList}}
                githubFriends.update_one(filter_criteria, update_operation)
            else:
                friendsList = []
                friendsList.append(friendName)
                githubFriends.insert_one({"_id": user, "Friends": friendsList})
            return Response(
                {
                    "status": 200,
                    "message": "Success",
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response({serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response(
            {"status": 400, "message": "Wrong"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def githubFriendDeletion(request):
    try:
        user = request.user.username
        serializer = Name_Serializer(data=request.data)
        if serializer.is_valid():
            friendEntry = githubFriends.find_one({"_id": user})
            friendName = serializer.validated_data["friendName"]
            if friendEntry is not None:
                friendsList = friendEntry["Friends"]
                if friendName in friendsList:
                    friendsList.remove(friendName)
                filter_criteria = {"_id": user}
                update_operation = {"$set": {"Friends": friendsList}}
                githubFriends.update_one(filter_criteria, update_operation)
            else:
                return Response(
                    {"status": 400, "message": "Wrong"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response(
                {
                    "status": 200,
                    "message": "Success",
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response({serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response(
            {"status": 400, "message": "Wrong"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def githubFriendList(request):
    try:
        user = request.user.username
        friendEntry = githubFriends.find_one({"_id": user})
        friendList = []
        if friendEntry:
            for i in friendEntry["Friends"]:
                friendList.append({"friendName": i})
        serializer = Name_Serializer(friendList, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {"status": 400, "message": "Wrong"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def openlakeFriendAddition(request):
    try:
        user = request.user.username
        logger.error(user)
        serializer = Name_Serializer(data=request.data)
        if serializer.is_valid():
            friendEntry = openlakeFriends.find_one({"_id": user})
            friendName = serializer.validated_data["friendName"]
            if friendEntry is not None:
                friendsList = friendEntry["Friends"]
                if friendName not in friendsList:
                    friendsList.append(friendName)
                filter_criteria = {"_id": user}
                update_operation = {"$set": {"Friends": friendsList}}
                openlakeFriends.update_one(filter_criteria, update_operation)
            else:
                friendsList = []
                friendsList.append(friendName)
                openlakeFriends.insert_one({"_id": user, "Friends": friendsList})
            return Response(
                {
                    "status": 200,
                    "message": "Success",
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response({serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response(
            {"status": 400, "message": "Wrong"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def openlakeFriendDeletion(request):
    try:
        user = request.user.username
        serializer = Name_Serializer(data=request.data)
        if serializer.is_valid():
            friendEntry = openlakeFriends.find_one({"_id": user})
            friendName = serializer.validated_data["friendName"]
            if friendEntry is not None:
                friendsList = friendEntry["Friends"]
                if friendName in friendsList:
                    friendsList.remove(friendName)
                filter_criteria = {"_id": user}
                update_operation = {"$set": {"Friends": friendsList}}
                openlakeFriends.update_one(filter_criteria, update_operation)
            else:
                return Response(
                    {"status": 400, "message": "Wrong"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            return Response(
                {
                    "status": 200,
                    "message": "Success",
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response({serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response(
            {"status": 400, "message": "Wrong"}, status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def openlakeFriendList(request):
    try:
        user = request.user.username
        friendEntry = openlakeFriends.find_one({"_id": user})
        friendList = []
        if friendEntry:
            for i in friendEntry["Friends"]:
                friendList.append({"friendName": i})
        serializer = Name_Serializer(friendList, many=True)
        return Response(serializer.data)
    except Exception as e:
        return Response(
            {"status": 400, "message": "Wrong"}, status=status.HTTP_400_BAD_REQUEST
        )

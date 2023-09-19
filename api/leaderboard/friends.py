from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import permission_classes, api_view
from leaderboard.serializers import Name_Serializer
from rest_framework.permissions import IsAuthenticated
import pymongo

client = pymongo.MongoClient('localhost', 27017)
myDB = client["Friends"]
codechefFriends = myDB["Codechef"]
codeforcesFriends = myDB["Codeforces"]
leetcodeFriends = myDB["Leetcode"]
githubFriends = myDB["Github"]
openlakeFriends = myDB['Openlake']

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def codeforcesFriendAddition(request):
    try:
        user = request.user.username
        serializer = Name_Serializer(data=request.data)
        if (serializer.is_valid()):
            friendEntry = codeforcesFriends.find_one({"_id" : user})
            friendName = serializer.validated_data['friendName']
            if (friendEntry is not None):
                friendsList = friendEntry["Friends"]
                if friendName not in friendsList:
                    friendsList.append(friendName)
                filter_criteria = {"_id": user} 
                update_operation = {
                    "$set": {
                        "Friends": friendsList
                    }
                }
                codeforcesFriends.update_one(filter_criteria, update_operation)
            else:
                friendsList = []
                friendsList.append(friendName)
                codeforcesFriends.insert_one({"_id" : user, "Friends" : friendsList})
            return Response({
                'status': 200,
                'message': "Success",
                }, status=status.HTTP_200_OK)
        else:
            return Response({
                serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({
            'status': 400,
            'message': "Wrong"
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def codeforcesFriendDeletion(request):
    try:
        user = request.user.username
        serializer = Name_Serializer(data=request.data)
        if (serializer.is_valid()):
            friendEntry = codeforcesFriends.find_one({"_id" : user})
            friendName = serializer.validated_data['friendName']
            if (friendEntry is not None):
                friendsList = friendEntry["Friends"]
                if friendName in friendsList:
                    friendsList.remove(friendName)
                filter_criteria = {"_id": user} 
                update_operation = {
                    "$set": {
                        "Friends": friendsList
                    }
                }
                codeforcesFriends.update_one(filter_criteria, update_operation)
            else:
                return Response({
                    'status': 400,
                    'message': "Wrong"
                    }, status=status.HTTP_400_BAD_REQUEST)
            return Response({
                'status': 200,
                'message': "Success",
                }, status=status.HTTP_200_OK)
        else:
            return Response({
                serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:
        return Response({
            'status': 400,
            'message': "Wrong"
        }, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def codeforcesFriendList(request):
    try:
        user = request.user.username
        friendEntry = codeforcesFriends.find_one({"_id" : user})
        friendList = []
        for i in friendEntry["Friends"]:
            friendList.append({"friendName" : i})
        serialier = Name_Serializer(friendList, many=True)
        return Response(serialier.data)
    except Exception as e:
        return Response({
            'status': 400,
            'message': "Wrong"
        }, status=status.HTTP_400_BAD_REQUEST)
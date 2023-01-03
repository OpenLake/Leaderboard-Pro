from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import permissions,status
from rest_framework.decorators import api_view,permission_classes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserNamesSerializer
from leaderboard.serializers import Cf_Serializer
from leaderboard.models import UserNames,githubUser,codechefUser,codeforcesUser
from rest_framework.generics import ListCreateAPIView,RetrieveUpdateDestroyAPIView
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        # ...
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

@api_view(['GET'])
@permission_classes((permissions.AllowAny,))
def getRoutes(request):
    routes=[
        '/api/token',
         'api/token/refresh'
    ]
    return Response(routes)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    user = request.user
    return Response({
        'username': user.username,
        'email': user.email,
    })
@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def post_UserNames(request):
    try:
        data=request.data
        # data['user']=request.user.username
        serializer=UserNamesSerializer(data=data)
        if serializer.is_valid():
            # print(request.user.username)
            serializer.save(user=request.user)
            return Response({
                'status':200,
                'message':"Success",
                'data':serializer.data
            })
        username_cc = request.data["cc_uname"]
        cc_user = codechefUser(username=username_cc)
        cc_user.save()
        username_cf = request.data["cf_uname"]
        cf_user = codeforcesUser(username=username_cf)
        cf_user.save()
        username_gh = request.data["gh_uname"]
        gh_user = githubUser(username=username_gh)
        gh_user.save()
    except Exception as e:  
        print(e)
        return Response({
            'status':400,
            'message':"Wrong"
        })
@api_view(["POST"])
@permission_classes((permissions.AllowAny,))
def registerUser(request):
    first_name = request.data["first_name"]
    username = request.data["username"]
    password = request.data["password"]
    try:
        user = User.objects.create_user(username=username, password=password, first_name=first_name)
        if first_name!="" and username!="" and password!="":
            user.save()
            return Response({
                    'status':200,
                    'message':"Success",
                })
    except Exception as e:
        print(e)
        return Response({
            'status':400,
            'message':"Wrong"
        })


from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import permissions,status
from rest_framework.decorators import api_view,permission_classes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserNamesSerializer
from leaderboard.models import UserNames
from rest_framework.generics import ListCreateAPIView,RetrieveUpdateDestroyAPIView

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
    except Exception as e:  
        print(e)
        return Response({
            'status':400,
            'message':"Wrong"
        })


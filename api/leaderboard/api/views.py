from django.http import JsonResponse
from rest_framework.response import Response
from rest_framework import permissions,status
from rest_framework.decorators import api_view,permission_classes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from .serializers import UserNamesSerializer
from leaderboard.serializers import Cf_Serializer
from leaderboard.models import UserNames,githubUser,codechefUser,codeforcesUser,LeetcodeUser,openlakeContributor
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
        # data['user']=request.user.username
        # data=request.data
        username_cc=request.data["cc_uname"]
        username_cf=request.data["cf_uname"]
        username_gh=request.data["gh_uname"]
        username_lt=request.data["lt_uname"]
        user=request.user
        if UserNames.objects.filter(user=user).exists():
            t = UserNames.objects.get(user=user)
            if username_cc!="":
                codechefUser.objects.filter(username=t.cc_uname).delete()
                t.cc_uname=username_cc
                cc_user = codechefUser(username=username_cc)
                cc_user.save()
            if username_cf!="":
                codeforcesUser.objects.filter(username=t.cf_uname).delete()
                t.cf_uname=username_cf
                cf_user = codeforcesUser(username=username_cf)
                cf_user.save()
            if username_gh!="":
                githubUser.objects.filter(username=t.gh_uname).delete()
                t.gh_uname=username_gh
                gh_user = githubUser(username=username_gh)
                gh_user.save()
            if username_lt!="":
                LeetcodeUser.objects.filter(username=t.lt_uname).delete()
                t.lt_uname=username_lt
                lt_user = githubUser(username=username_lt)
                lt_user.save()
            t.save()
        else:
            if user!="":
                userName=UserNames(user=user,cc_uname=username_cc,cf_uname=username_cf,gh_uname=username_gh,lt_uname=username_lt)
                userName.save()
            if username_cc!="":
                cc_user = codechefUser(username=username_cc)
                cc_user.save()
            # username_cf = request.data["cf_uname"]
            if username_cf!="":
                cf_user = codeforcesUser(username=username_cf)
                cf_user.save()
            # username_gh = request.data["gh_uname"]
            if username_gh!="":
                gh_user = githubUser(username=username_gh)
                gh_user.save()
            if username_lt!="":
                lt_user = LeetcodeUser(username=username_lt)
                lt_user.save()
        return Response({
            'status':200,
            'message':"Success",
        },status=status.HTTP_201_CREATED)
        # else:
        #     return Response({
        #         'status':400,
        #         'message':"Wrong",
        #     },status=status.HTTP_400_BAD_REQUEST)

    except Exception as e:  
        print(e)
        return Response({
            'status':400,
            'message':"Wrong"
        },status=status.HTTP_400_BAD_REQUEST)
        
@api_view(["POST"])
@permission_classes((permissions.AllowAny,))
def registerUser(request):
    try:
        first_name = request.data["first_name"]
        last_name=request.data['last_name']
        email=request.data['email']
        username = request.data["username"]
        password = request.data["password"]
        cc_uname=request.data["cc_uname"]
        cf_uname=request.data["cf_uname"]
        gh_uname=request.data["gh_uname"]
        lt_uname=request.data["lt_uname"]
        user = User.objects.create_user(username=username, password=password, first_name=first_name,last_name=last_name,email=email)
        if first_name!="" and  email!="" and username!="" and password!="":
            user.save()
            userName=UserNames(user=user,cc_uname=cc_uname,cf_uname=cf_uname,gh_uname=gh_uname,lt_uname=lt_uname)
            userName.save()
            if cc_uname!="":
                cc_user = codechefUser(username=cc_uname)
                cc_user.save()
            if cf_uname!="":
                cf_user = codeforcesUser(username=cf_uname)
                cf_user.save()
            if gh_uname!="":
                gh_user = githubUser(username=gh_uname)
                gh_user.save()
            if lt_uname!="":
                lt_user = LeetcodeUser(username=lt_uname)
                lt_user.save()
            return Response({
                    'status':200,
                    'message':"Success",
                },status=status.HTTP_200_OK)
    except Exception as e:
        print(e)
        return Response({
            'status':400,
            'message':"Wrong"
        },status=status.HTTP_400_BAD_REQUEST)
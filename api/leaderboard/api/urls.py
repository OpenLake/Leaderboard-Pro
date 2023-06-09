from django.urls import path
from . import views
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns=[
    path('',views.getRoutes),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # path('usernames/',views.UserNamesDetailView.as_view()),
    path('insertapi/',views.post_UserNames),
    path('tripathi/',views.current_user),
    path('register/',views.registerUser),
    path('ghfriends/',views.add_GithubFriends),
    path('ltfriends/',views.add_LeetcodeFriends),
    path('ccfriends/',views.add_CodechefFriends),
    path('cffriends/',views.add_CodeforcesFriends),
    path('getcffriends/',views.get_CodeforcesFriends),
    path('dropcffriends/',views.drop_CodeforcesFriends),
    path('getccfriends/',views.get_CodechefFriends),
    path('dropccfriends/',views.drop_CodechefFriends),
    path('getltfriends/',views.get_LeetcodeFriends),
    path('dropltfriends/',views.drop_LeetcodeFriends),
    path('getghfriends/',views.get_GithubFriends),
    path('dropghfriends/',views.drop_GithubFriends),
    path('olfriends/',views.add_OpenlakeFriends),
    path('getolfriends/',views.get_OpenlakeFriends),
    path('dropolfriends/',views.drop_OpenlakeFriends),
    path('leetcodecontestrankings/',views.ContestRankingsAPIView),
    path('leetcodeccps/',views.LeetcodeCCPSAPIView)
]



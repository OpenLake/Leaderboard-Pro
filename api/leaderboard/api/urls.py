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
    path('getcffriends/',views.get_CodeforcesFriends)
]



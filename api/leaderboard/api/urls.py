from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from . import views
from .views import MyTokenObtainPairView

urlpatterns = [
    path("", views.getRoutes),
    path("token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    # path('usernames/',views.UserNamesDetailView.as_view()),
    path("insertapi/", views.post_UserNames),
    path("tripathi/", views.current_user),
    path("register/", views.registerUser),
    path("register/google/", views.registerGoogleUser),
    path("leetcodecontestrankings/", views.ContestRankingsAPIView),
]

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import get_notes, logout, is_authenticated, register, get_matchmaking_results,get_matching_profiles ,api_home # ✅ Use correct function

urlpatterns = [
    path('', api_home, name='api_home'), 
    # JWT Authentication Endpoints

    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Custom Login Endpoint (Alias for token)
    path('login/', TokenObtainPairView.as_view(), name='login'),

    # Other API Endpoints
    path('notes/', get_notes, name='notes'),
    path('logout/', logout, name='logout'),
    path('authenticated/', is_authenticated, name='is_authenticated'),
    path('signup/', register, name='signup'),

    # ✅ Correct Matchmaking API Endpoint
    path("matchmaking/", get_matchmaking_results, name="matchmaking"),
       path("matching-profiles/", get_matching_profiles, name="matching_profiles"),
]

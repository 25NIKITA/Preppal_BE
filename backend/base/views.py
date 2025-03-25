from django.shortcuts import render
from django.contrib.auth.models import User
from .models import Note, UserProfile  # ✅ Import both models
from .serializer import NoteSerializer, UserRegistrationSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
import os
import pandas as pd
from .matchmaking import MatchmakingAI  # ✅ Import AI matchmaking logic
from django.http import JsonResponse  # ✅ Import JsonResponse for API Home

# ✅ Default API Home View
def api_home(request):
    return JsonResponse({"message": "Welcome to the API! Available endpoints: /notes, /signup, /matchmaking, etc."})

class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            print("🔹 CustomTokenObtainPairView: Received login request")
            response = super().post(request, *args, **kwargs)
            tokens = response.data
            print("✅ Tokens generated:", tokens)

            access_token = tokens.get('access')
            refresh_token = tokens.get('refresh')

            if not access_token or not refresh_token:
                print("❌ Token generation failed")
                return Response({'success': False, 'error': 'Token generation failed'}, status=400)

            res = Response({'success': True, 'access_token': access_token, 'refresh_token': refresh_token})

            res.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite='Strict',
                path='/'
            )
            res.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite='Strict',
                path='/'
            )

            print("✅ Login successful, tokens set in cookies")
            return res

        except Exception as e:
            print("❌ Error in login:", str(e))
            return Response({'success': False, 'error': str(e)}, status=400)

class CustomRefreshTokenView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            print("🔄 Refreshing access token")
            refresh_token = request.COOKIES.get('refresh_token')
            if not refresh_token:
                print("❌ Refresh token not found in cookies")
                return Response({'refreshed': False, 'error': 'Refresh token not found'}, status=400)

            request.data['refresh'] = refresh_token
            response = super().post(request, *args, **kwargs)

            access_token = response.data.get('access')
            if not access_token:
                print("❌ Access token generation failed")
                return Response({'refreshed': False, 'error': 'Access token generation failed'}, status=400)

            res = Response({'refreshed': True, 'access_token': access_token})
            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='Strict',
                path='/'
            )

            print("✅ Access token refreshed successfully")
            return res

        except Exception as e:
            print("❌ Error in token refresh:", str(e))
            return Response({'refreshed': False, 'error': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        print("🔹 Logout request received")
        res = Response({'success': True})

        refresh_token = request.COOKIES.get('refresh_token')
        if refresh_token:
            try:
                print("🛑 Blacklisting refresh token")
                token = RefreshToken(refresh_token)
                token.blacklist()
            except Exception as e:
                print("⚠️ Error blacklisting token:", str(e))

        res.delete_cookie('access_token', path='/', samesite='Strict', httponly=True)
        res.delete_cookie('refresh_token', path='/', samesite='Strict', httponly=True)

        print("✅ User logged out successfully")
        return res

    except Exception as e:
        print("❌ Error in logout:", str(e))
        return Response({'success': False, 'error': str(e)}, status=400)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def is_authenticated(request):
    print("✅ User authentication check passed")
    return Response({'authenticated': True})

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    print("🔹 Registration request received:", request.data)
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        print("✅ User registered successfully:", serializer.data)
        return Response({"success": True, "message": "User registered successfully", "data": serializer.data}, status=201)

    print("❌ Registration failed:", serializer.errors)
    return Response({"success": False, "error": serializer.errors}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notes(request):
    user = request.user
    print(f"📒 Fetching notes for user: {user.username}")
    notes = Note.objects.filter(owner=user)
    serializer = NoteSerializer(notes, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_matchmaking_results(request):
    print("🔹 Matchmaking request received")
    DATA_FILE_PATH = os.path.join(os.path.dirname(__file__), "random_people_data.csv")
    user = request.user

    try:
        profile = UserProfile.objects.get(user=user)
    except UserProfile.DoesNotExist:
        print("⚠️ UserProfile does not exist. Creating a default one.")
        profile = UserProfile.objects.create(
            user=user,
            field="Unknown",
            year=1,
            exam_pursuing="Unknown"
        )

    try:
        ai = MatchmakingAI(
            file_path=DATA_FILE_PATH,
            target_name=user.first_name or "Unknown",
            target_lastname=user.last_name or "Unknown",
            target_stream=profile.field,
            target_year=profile.year,
            target_exam=profile.exam_pursuing
        )

        matches = ai.find_best_matches(top_n=10)
        print("✅ Matchmaking completed. Top matches found.")

        if isinstance(matches, pd.DataFrame):
            return Response({"matches": matches.to_dict(orient="records")})
        else:
            print("❌ Matchmaking failed. Unexpected data format.")
            return Response({"error": "Matchmaking failed. Unexpected data format."}, status=500)

    except Exception as e:
        print("❌ Error in matchmaking:", str(e))
        return Response({"error": str(e)}, status=500)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_matching_profiles(request):
    print("🔍 Fetching all matching profiles")
    users = list(UserProfile.objects.values("user__username", "exam_pursuing"))
    print("✅ Profiles fetched successfully:", users)
    return Response(users)

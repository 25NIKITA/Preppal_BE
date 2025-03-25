from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def home(request):
    return JsonResponse({"message": "Welcome to the API!"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('base.urls')),
    path('', home, name="home"),
]

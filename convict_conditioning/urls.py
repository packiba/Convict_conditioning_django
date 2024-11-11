from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

# Временная главная страница
def home(request):
    return HttpResponse("Welcome to the Home Page")

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/exercises/', include('exercises.urls')),
    path('api/journal/', include('workout_logs.urls')),
    path('api/auth/', include('users.urls')),
    path('', home),  # Добавлен маршрут для главной страницы
]

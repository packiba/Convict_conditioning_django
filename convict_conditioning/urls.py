from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/exercises/', include('exercises.urls')),
    path('api/journal/', include('workout_logs.urls')),
    path('api/auth/', include('users.urls')),
]


from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/exercises/', include('exercises.urls')),
    path('api/journal/', include('workout_logs.urls')),
    path('api/auth/', include('users.urls')),
    path('', TemplateView.as_view(template_name="react/index.html")),
]

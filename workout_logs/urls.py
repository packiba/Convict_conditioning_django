from django.urls import path
from .views import WorkoutLogDetailView, UserWorkoutLogView, UserWorkoutLogByCategoryView, ClearUserLogsView, CreateWorkoutLogView

urlpatterns = [
    path('<int:cat_id>/<int:ex_id>/<int:user_id>/', WorkoutLogDetailView.as_view(), name='exercise-log-detail'),  # Получение последнего лога
    path('account/<int:user_id>/', UserWorkoutLogView.as_view(), name='user-account-logs'),  # Получение логов пользователя
    path('<int:cat_id>/<int:user_id>/', UserWorkoutLogByCategoryView.as_view(), name='user-category-logs'),  # Получение текущего уровня по категории
    path('<int:user_id>/', ClearUserLogsView.as_view(), name='clear-user-logs'),  # Очистка логов пользователя
    path('log', CreateWorkoutLogView.as_view(), name='create-workout-log'),
]

from django.urls import path
from .views import ExerciseCategoryListView, CategoryExerciseListView, ExerciseDetailView

urlpatterns = [
    path('categories/', ExerciseCategoryListView.as_view(), name='exercise-categories'),  # Получение всех категорий
    path('category/<int:id>/', CategoryExerciseListView.as_view(), name='category-exercises'),  # Получение упражнений по категории
    path('exercise/<int:catId>/<int:id>/', ExerciseDetailView.as_view(), name='exercise-detail'),  # Получение конкретного упражнения
]


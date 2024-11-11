from rest_framework import generics
from rest_framework.response import Response
from .models import Exercise
from .serializers import ExerciseSerializer

class ExerciseCategoryListView(generics.ListAPIView):
    def get(self, request):
        # Получаем уникальные категории из всех упражнений
        categories = Exercise.objects.values('category_id', 'category_name').distinct()
        return Response({'categories': list(categories), 'message': 'Список категорий упражнений'})


class CategoryExerciseListView(generics.ListAPIView):
    serializer_class = ExerciseSerializer

    def get(self, request, id):
        # Получаем все упражнения по категории
        exercises = Exercise.objects.filter(category_id=id)
        if exercises.exists():
            return Response({'exercises': ExerciseSerializer(exercises, many=True).data, 'message': 'Упражнения в категории'})
        return Response({'message': 'Упражнения не найдены'}, status=404)


class ExerciseDetailView(generics.RetrieveAPIView):
    serializer_class = ExerciseSerializer

    def get(self, request, catId, id):
        try:
            exercise = Exercise.objects.get(category_id=catId, exercise_id=id)
            return Response({'exercise': ExerciseSerializer(exercise).data, 'message': 'Детали упражнения'})
        except Exercise.DoesNotExist:
            return Response({'message': 'Упражнение не найдено'}, status=404)
        except Exception as e:
            return Response({'message': f'Ошибка: {str(e)}'}, status=500)

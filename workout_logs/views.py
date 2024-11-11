from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import WorkoutLog
from .serializers import WorkoutLogSerializer
from .utils import error_handler
import logging


class CreateWorkoutLogView(APIView):
    def post(self, request):
        """Создание новой записи тренировки"""
        try:
            data = request.data
            user_id = data.get("userId")
            cat_id = data.get("catId")
            ex_id = data.get("exId")
            exercise = data.get("exercise")
            cur_lev = data.get("curLev")
            sets = data.get("sets")

            # Проверка обязательных полей
            if user_id is None or cat_id is None or ex_id is None or exercise is None or cur_lev is None:
                return Response({"message": "Все поля обязательны"}, status=status.HTTP_400_BAD_REQUEST)


            # Создание записи лога
            log = WorkoutLog(user_id=user_id, cat_id=cat_id, ex_id=ex_id, exercise=exercise, cur_lev=cur_lev, sets=sets)
            log.save()

            return Response({
                "message": "Запись тренировки создана успешно",
                "log_id": log.id
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"message": "Ошибка сервера"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class WorkoutLogDetailView(generics.RetrieveAPIView):
    serializer_class = WorkoutLogSerializer

    @error_handler
    def get(self, request, cat_id, ex_id, user_id):
        log = WorkoutLog.objects.filter(cat_id=cat_id, ex_id=ex_id, user_id=user_id).order_by('-id').first()
        if log:
            return Response({'log': WorkoutLogSerializer(log).data, 'message': 'Текущий уровень в последнем логе упражнения'})
        
        return Response({'message': 'Лог не найден'})


class UserWorkoutLogView(generics.ListAPIView):
    serializer_class = WorkoutLogSerializer

    @error_handler
    def get(self, request, user_id):
        logs = WorkoutLog.objects.filter(user_id=user_id).order_by('-id')
        print('logs', logs)
        if not logs.exists():
            return Response({'message': 'Логи не найдены'}, status=status.HTTP_404_NOT_FOUND)

        log_list = [
            {
                'cat_id': log.cat_id,
                'ex_id': log.ex_id,
                'exName': log.exercise,
                'cur_lev': log.cur_lev,
                'sets': log.sets,
                'date': log.created_at
            } for log in logs
        ]
        return Response({'logs': log_list, 'message': 'Выборка записей текущего аккаунта'})


class UserWorkoutLogByCategoryView(generics.ListAPIView):
    @error_handler
    def get(self, request, cat_id, user_id):
        data = WorkoutLog.objects.filter(cat_id=cat_id, user_id=user_id).values('cur_lev', 'ex_id').order_by('-id')
        if not data.exists():
            # Вместо возврата ошибки 404, возвращаем пустой список уровней
            return Response({'levels': [-1] * 10, 'message': 'Пока нет данных для этой категории. Начните тренировку!'}, status=status.HTTP_200_OK)
        print('data by cat', data)
        levels = [-1] * 10
        for log in data:
            if 0 <= log['ex_id'] < 10:
                levels[log['ex_id']] = max(levels[log['ex_id']], log['cur_lev'])
        print('levels data', levels)
        return Response({'levels': levels, 'message': 'Список упражнений с текущим уровнем'})



class ClearUserLogsView(generics.DestroyAPIView):

    @error_handler
    def delete(self, request, user_id):
        deleted_count, _ = WorkoutLog.objects.filter(user_id=user_id).delete()
        if deleted_count == 0:
            return Response({'message': 'Записи пользователя не найдены'}, status=status.HTTP_404_NOT_FOUND)
        
        return Response({'message': 'Записи пользователя очищены'})

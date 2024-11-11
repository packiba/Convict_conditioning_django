# Исправленные тесты для приложения workout_logs

from rest_framework import status
from rest_framework.test import APITestCase
from .models import User, WorkoutLog

class WorkoutLogAPITests(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            email='testuser@example.com',
            name='Test User',
            password='testpassword'
        )
        self.workout_log = WorkoutLog.objects.create(
            user=self.user,
            cat_id=1,
            ex_id=1,
            cur_lev=1,
            sets=3
        )

    def test_create_workout_log(self):
        data = {
            'user': self.user.id,
            'cat_id': 2,
            'ex_id': 2,
            'cur_lev': 2,
            'sets': 5
        }
        response = self.client.post('/api/workout-logs/log/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_workout_log_detail(self):
        response = self.client.get(f'/api/workout-logs/journal/1/1/{self.user.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        if response.status_code == status.HTTP_200_OK:
            self.assertIn('log', response.data)
            self.assertEqual(response.data['log']['cur_lev'], 1)

    def test_get_user_workout_logs(self):
        response = self.client.get(f'/api/workout-logs/journal/account/{self.user.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        if response.status_code == status.HTTP_200_OK:
            self.assertIn('logs', response.data)
            self.assertEqual(len(response.data['logs']), 1)

    def test_get_user_workout_logs_no_logs(self):
        another_user = User.objects.create_user(
            email='anotheruser@example.com',
            name='Another User',
            password='anotherpassword'
        )
        response = self.client.get(f'/api/workout-logs/journal/account/{another_user.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_clear_user_logs(self):
        response = self.client.delete(f'/api/workout-logs/journal/{self.user.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        if response.status_code == status.HTTP_200_OK:
            self.assertEqual(response.data['message'], 'Записи пользователя очищены')

    def test_clear_user_logs_no_logs(self):
        another_user = User.objects.create_user(
            email='anotheruser@example.com',
            name='Another User',
            password='anotherpassword'
        )
        response = self.client.delete(f'/api/workout-logs/journal/{another_user.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        if response.status_code == status.HTTP_404_NOT_FOUND:
            self.assertIn('message', response.data)

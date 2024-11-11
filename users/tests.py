# users/tests.py
from rest_framework import status
from rest_framework.test import APITestCase
from .models import User

class UserAPITests(APITestCase):

    def setUp(self):
        self.user_data = {
            'email': 'testuser@example.com',
            'name': 'Test User',
            'password': 'testpassword'
        }
    
    def test_user_registration(self):
        response = self.client.post('/api/auth/register/', self.user_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('email', response.data)  # Проверяем, что email возвращается
        self.assertEqual(response.data['email'], self.user_data['email'])  # Проверяем, что email соответствует

    def test_user_registration_missing_email(self):
        data = self.user_data.copy()
        data['email'] = ''  # Убираем email
        response = self.client.post('/api/auth/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)  # Ожидаем ошибку 400

    def test_user_registration_missing_name(self):
        data = self.user_data.copy()
        data['name'] = ''  # Убираем имя
        response = self.client.post('/api/auth/register/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)  # Ожидаем ошибку 400

    def test_user_login_success(self):
        # Сначала создадим пользователя
        User.objects.create_user(email=self.user_data['email'], name=self.user_data['name'], password=self.user_data['password'])
        
        login_data = {
            'email': self.user_data['email'],
            'password': self.user_data['password']
        }
        response = self.client.post('/api/auth/login/', login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('message', response.data)  # Проверяем наличие сообщения
        self.assertEqual(response.data['message'], 'Логин успешен')  # Проверяем текст сообщения

    def test_user_login_failure(self):
        login_data = {
            'email': 'nonexistent@example.com',
            'password': 'wrongpassword'
        }
        response = self.client.post('/api/auth/login/', login_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('message', response.data)  # Проверяем наличие сообщения
        self.assertEqual(response.data['message'], 'Пользователь не найден')  # Проверяем текст сообщения

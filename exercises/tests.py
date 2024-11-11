from rest_framework import status
from rest_framework.test import APITestCase
from .models import Exercise

class ExerciseAPITests(APITestCase):
    
    def setUp(self):
        # Создаем тестовые данные для упражнений
        self.exercise1 = Exercise.objects.create(
            exercise_id=1,
            name='Push Up',
            category_id=1,
            category_name='Strength',
            level1={'reps': 10},
            level2={'reps': 15},
            level3={'reps': 20},
            anim_uri='http://example.com/pushup.gif',
            description=['A basic push up exercise']
        )
        self.exercise2 = Exercise.objects.create(
            exercise_id=2,
            name='Pull Up',
            category_id=1,
            category_name='Strength',
            level1={'reps': 5},
            level2={'reps': 10},
            level3={'reps': 15},
            anim_uri='http://example.com/pullup.gif',
            description=['A basic pull up exercise']
        )

    def test_exercise_category_list(self):
        response = self.client.get('/api/exercises/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('categories', response.data)
        self.assertEqual(len(response.data['categories']), 1)  # Должен вернуть одну категорию

    def test_category_exercise_list(self):
        response = self.client.get('/api/exercises/category/1/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('exercises', response.data)
        self.assertEqual(len(response.data['exercises']), 2)  # Должен вернуть два упражнения

    def test_exercise_detail(self):
        response = self.client.get('/api/exercises/exercise/1/1/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('exercise', response.data)
        self.assertEqual(response.data['exercise']['name'], 'Push Up')

    def test_exercise_not_found(self):
        response = self.client.get('/api/exercises/exercise/1/999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('message', response.data)



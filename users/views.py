from rest_framework import generics
from .models import User
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class UserRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

class UserLoginView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        # Логика аутентификации (здесь можете добавить проверку пароля)
        user = User.objects.filter(email=email).first()
        if user:
            return Response({'message': 'Логин успешен', 'user_id': user.id})
        return Response({'message': 'Пользователь не найден'}, status=404)

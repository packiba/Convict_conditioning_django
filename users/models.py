# users/models.py
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None):
        if not email:
            raise ValueError('Email must be provided')
        if not name:
            raise ValueError('Name must be provided')

        email = self.normalize_email(email)
        user = self.model(email=email, name=name)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None):
        user = self.create_user(email, name, password)
        user.is_superuser = True
        user.is_staff = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    name = models.CharField(max_length=255, unique=True)  # Уникальное имя пользователя
    email = models.EmailField(max_length=255, unique=True)  # Уникальный email
    is_active = models.BooleanField(default=True)  # Флаг активности
    is_staff = models.BooleanField(default=False)  # Флаг доступа в админку

    objects = UserManager()

    USERNAME_FIELD = 'email'  # Поле для аутентификации
    REQUIRED_FIELDS = ['name']  # Дополнительные обязательные поля

    def __str__(self):
        return self.email  # Показать email как строковое представление
    
    class Meta:
        unique_together = ('name', 'email')

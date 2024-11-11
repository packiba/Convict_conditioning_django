from django.db import models

class Exercise(models.Model):
    id = models.AutoField(primary_key=True)  # Автоинкрементируемый уникальный ключ
    exercise_id = models.IntegerField()      # ID упражнения
    category_id = models.IntegerField()      # ID категории
    name = models.CharField(max_length=255)
    category_name = models.CharField(max_length=255)
    level1 = models.JSONField(default=list)
    level2 = models.JSONField(default=list)
    level3 = models.JSONField(default=list)
    anim_uri = models.CharField(max_length=255, null=True, blank=True)
    description = models.JSONField(default=list)

    class Meta:
        unique_together = ('exercise_id', 'category_id')  # Уникальность на уровне сочетания exercise_id и category_id

    def __str__(self):
        return self.name

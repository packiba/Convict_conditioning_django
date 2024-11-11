from django.db import models
from users.models import User

class WorkoutLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cat_id = models.IntegerField()
    ex_id = models.IntegerField()
    exercise = models.CharField(max_length=255)
    cur_lev = models.IntegerField()
    sets = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.name} - {self.exercise}"

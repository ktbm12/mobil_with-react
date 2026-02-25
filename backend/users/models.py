from email.policy import default
from django.db import models

class users(models.Model):
    name = models.CharField(max_length=200)
    done = models.BooleanField(default=False)
    sub_name= models.CharField(default=False)

    def __str__(self):
        return self.title

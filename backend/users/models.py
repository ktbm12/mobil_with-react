from django.db import models

class Users(models.Model):
    name = models.CharField(max_length=200)
    sub_name = models.CharField(max_length=200, default='')  # valeur par défaut vide
    done = models.BooleanField(default=False)

    def __str__(self):
        return self.name
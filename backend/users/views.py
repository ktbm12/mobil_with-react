from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets
from .models import Users
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    """API endpoint that allows Users to be viewed or edited."""
    queryset = Users.objects.all()
    serializer_class = UserSerializer
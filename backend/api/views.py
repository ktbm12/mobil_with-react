from rest_framework import viewsets
from .models import Todo
from .serializers import TodoSerializer

class TodoViewSet(viewsets.ModelViewSet):
    """API endpoint that allows Todos to be viewed or edited."""
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

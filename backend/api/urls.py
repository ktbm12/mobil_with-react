from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TodoViewSet

# Router DRF classique : il crée automatiquement toutes les routes CRUD 
# pour notre TodoViewSet (list, create, retrieve, update, partial_update, destroy)
router = DefaultRouter()
router.register(r'todos', TodoViewSet)

urlpatterns = [
    # On inclut les routes générées par le routeur sous le chemin racine de "api"
    path('', include(router.urls)),
]

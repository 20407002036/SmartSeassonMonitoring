from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from users.views import FieldAgentListView, LogoutView, MeView

urlpatterns = [
    path("auth/login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("auth/logout/", LogoutView.as_view(), name="token_logout"),
    path("auth/me/", MeView.as_view(), name="auth_me"),
    path("agents/", FieldAgentListView.as_view(), name="field-agent-list"),
]

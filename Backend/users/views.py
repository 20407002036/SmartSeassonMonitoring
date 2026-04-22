from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError

from users.models import User
from users.serializers import UserListSerializer


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"detail": "refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
        except TokenError:
            return Response({"detail": "invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_205_RESET_CONTENT)


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(
            {
                "id": request.user.id,
                "username": request.user.username,
                "name": request.user.get_full_name(),
                "email": request.user.email,
                "role": request.user.role,
            }
        )


class FieldAgentListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if not request.user.is_admin:
            return Response({"detail": "Admin access required."}, status=status.HTTP_403_FORBIDDEN)

        queryset = User.objects.filter(role=User.Role.FIELD_AGENT).order_by("id")
        serializer = UserListSerializer(queryset, many=True)
        return Response(serializer.data)

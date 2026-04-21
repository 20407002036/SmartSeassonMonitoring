from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from notifications.models import Notification
from notifications.serializers import NotificationSerializer


class NotificationListView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		queryset = Notification.objects.filter(recipient=request.user).select_related(
			"field",
			"field__assigned_to",
			"field__assigned_by",
			"recipient",
			"note",
			"note__author",
		)
		serializer = NotificationSerializer(queryset, many=True)
		return Response(serializer.data)


class NotificationMarkReadView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def put(self, request, pk):
		return self._mark_read(request, pk)

	def patch(self, request, pk):
		return self._mark_read(request, pk)

	def _mark_read(self, request, pk):
		notification = get_object_or_404(Notification, pk=pk, recipient=request.user)
		if notification.read_at is None:
			from django.utils import timezone

			notification.read_at = timezone.now()
			notification.save(update_fields=["read_at"])
		return Response(NotificationSerializer(notification).data, status=status.HTTP_200_OK)


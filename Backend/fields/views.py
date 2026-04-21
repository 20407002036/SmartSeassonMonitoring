from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from fields.models import Field, Note
from fields.permissions import IsAdmin, IsAdminOrAssignedAgent, IsFieldAgent
from fields.serializers import (
	FieldAssignSerializer,
	FieldDetailSerializer,
	FieldListSerializer,
	FieldStageUpdateSerializer,
	FieldWriteSerializer,
	NoteCreateSerializer,
	NoteSerializer,
)
from notifications.models import Notification
from notifications.serializers import NotificationSerializer
from users.models import User


def get_field_queryset_for_user(user):
	if user.is_admin:
		return Field.objects.select_related("assigned_to", "assigned_by").prefetch_related("notes__author")
	return Field.objects.filter(assigned_to=user).select_related("assigned_to", "assigned_by").prefetch_related("notes__author")


def create_admin_notifications(field, new_status, note=None):
	admin_users = User.objects.filter(role=User.Role.ADMIN)
	notifications = [
		Notification(field=field, note=note, new_status=new_status, recipient=admin_user)
		for admin_user in admin_users
	]
	Notification.objects.bulk_create(notifications)


class FieldListCreateView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def get(self, request):
		queryset = get_field_queryset_for_user(request.user)
		serializer = FieldListSerializer(queryset, many=True)
		return Response(serializer.data)

	def post(self, request):
		if not request.user.is_admin:
			return Response({"detail": "Admin access required."}, status=status.HTTP_403_FORBIDDEN)
		serializer = FieldWriteSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		field = serializer.save(assigned_by=request.user)
		return Response(FieldDetailSerializer(field).data, status=status.HTTP_201_CREATED)


class FieldDetailUpdateView(APIView):
	permission_classes = [permissions.IsAuthenticated, IsAdminOrAssignedAgent]

	def get_object(self, request, pk):
		field = get_object_or_404(Field.objects.select_related("assigned_to", "assigned_by").prefetch_related("notes__author"), pk=pk)
		self.check_object_permissions(request, field)
		return field

	def get(self, request, pk):
		field = self.get_object(request, pk)
		return Response(FieldDetailSerializer(field).data)

	def put(self, request, pk):
		field = self.get_object(request, pk)
		if not request.user.is_admin:
			return Response({"detail": "Admin access required."}, status=status.HTTP_403_FORBIDDEN)
		serializer = FieldWriteSerializer(field, data=request.data)
		serializer.is_valid(raise_exception=True)
		field = serializer.save(assigned_by=field.assigned_by or request.user)
		return Response(FieldDetailSerializer(field).data)

	def patch(self, request, pk):
		return self.put(request, pk)


class FieldAssignView(APIView):
	permission_classes = [permissions.IsAuthenticated]

	def post(self, request, pk):
		if not request.user.is_admin:
			return Response({"detail": "Admin access required."}, status=status.HTTP_403_FORBIDDEN)
		field = get_object_or_404(Field, pk=pk)
		serializer = FieldAssignSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		field.assigned_to = serializer.validated_data["assigned_to"]
		field.assigned_by = request.user
		field.save(update_fields=["assigned_to", "assigned_by", "updated_at"])
		return Response(FieldDetailSerializer(field).data)


class FieldStageUpdateView(APIView):
	permission_classes = [permissions.IsAuthenticated, IsFieldAgent]

	def put(self, request, pk):
		field = get_object_or_404(Field, pk=pk)
		if field.assigned_to_id != request.user.id:
			return Response({"detail": "You can only update assigned fields."}, status=status.HTTP_403_FORBIDDEN)

		serializer = FieldStageUpdateSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)

		with transaction.atomic():
			field.current_stage = serializer.validated_data["current_stage"]
			field.save(update_fields=["current_stage", "updated_at"])
			create_admin_notifications(field=field, new_status=field.current_stage)

		return Response(FieldDetailSerializer(field).data)


class FieldNotesView(APIView):
	permission_classes = [permissions.IsAuthenticated, IsAdminOrAssignedAgent]

	def get_field(self, request, pk):
		field = get_object_or_404(Field.objects.select_related("assigned_to", "assigned_by").prefetch_related("notes__author"), pk=pk)
		self.check_object_permissions(request, field)
		return field

	def get(self, request, pk):
		field = self.get_field(request, pk)
		serializer = NoteSerializer(field.notes.all(), many=True)
		return Response(serializer.data)

	def post(self, request, pk):
		field = self.get_field(request, pk)
		serializer = NoteCreateSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		note = serializer.save(field=field, author=request.user)
		return Response(NoteSerializer(note).data, status=status.HTTP_201_CREATED)


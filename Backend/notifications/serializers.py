from rest_framework import serializers

from fields.serializers import FieldBaseSerializer, NoteSerializer, UserBriefSerializer
from notifications.models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    field = FieldBaseSerializer(read_only=True)
    note = NoteSerializer(read_only=True)
    recipient = UserBriefSerializer(read_only=True)
    is_unread = serializers.BooleanField(read_only=True)

    class Meta:
        model = Notification
        fields = (
            "id",
            "field",
            "note",
            "new_status",
            "recipient",
            "read_at",
            "created_at",
            "is_unread",
        )
        read_only_fields = fields

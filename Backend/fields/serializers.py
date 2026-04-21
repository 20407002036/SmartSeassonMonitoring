from rest_framework import serializers

from fields.models import Field, Note
from users.models import User


class UserBriefSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="get_full_name", read_only=True)

    class Meta:
        model = User
        fields = ("id", "username", "full_name", "email", "role")


class NoteSerializer(serializers.ModelSerializer):
    author = UserBriefSerializer(read_only=True)
    field = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Note
        fields = ("id", "field", "author", "comment", "created_at")
        read_only_fields = ("id", "field", "author", "created_at")


class FieldBaseSerializer(serializers.ModelSerializer):
    status = serializers.CharField(read_only=True)
    assigned_to = UserBriefSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        source="assigned_to",
        queryset=User.objects.filter(role=User.Role.FIELD_AGENT),
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Field
        fields = (
            "id",
            "name",
            "crop_type",
            "planting_date",
            "current_stage",
            "status",
            "assigned_to",
            "assigned_to_id",
            "assigned_by",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "status", "assigned_by", "created_at", "updated_at")


class FieldListSerializer(FieldBaseSerializer):
    pass


class FieldDetailSerializer(FieldBaseSerializer):
    notes = NoteSerializer(many=True, read_only=True)

    class Meta(FieldBaseSerializer.Meta):
        fields = FieldBaseSerializer.Meta.fields + ("notes",)


class FieldWriteSerializer(serializers.ModelSerializer):
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        source="assigned_to",
        queryset=User.objects.filter(role=User.Role.FIELD_AGENT),
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Field
        fields = (
            "name",
            "crop_type",
            "planting_date",
            "current_stage",
            "assigned_to_id",
        )


class FieldAssignSerializer(serializers.Serializer):
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        source="assigned_to",
        queryset=User.objects.filter(role=User.Role.FIELD_AGENT),
    )


class FieldStageUpdateSerializer(serializers.Serializer):
    current_stage = serializers.ChoiceField(choices=Field.Stage.choices)


class NoteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ("comment",)

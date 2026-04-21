from django.db import models

from fields.models import Field, Note
from users.models import User


class Notification(models.Model):
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name="notifications")
    note = models.ForeignKey(Note, null=True, blank=True, on_delete=models.SET_NULL)
    new_status = models.CharField(max_length=50)
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["recipient", "-created_at"]),
            models.Index(fields=["recipient", "read_at"]),
        ]

    def __str__(self):
        return f"Notification: {self.field.name} -> {self.new_status}"

    @property
    def is_unread(self):
        return self.read_at is None

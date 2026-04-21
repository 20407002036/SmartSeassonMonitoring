from django.db import models
from django.utils import timezone

from users.models import User


class Field(models.Model):
    class Stage(models.TextChoices):
        NO_STATUS = "no_status", "No Status"
        PLANTED = "planted", "Planted"
        GROWING = "growing", "Growing"
        READY = "ready", "Ready"
        HARVESTED = "harvested", "Harvested"
        DONE = "done", "Done"

    name = models.CharField(max_length=255)
    crop_type = models.CharField(max_length=100)
    planting_date = models.DateField(null=True, blank=True)
    current_stage = models.CharField(max_length=20, choices=Stage.choices, default=Stage.NO_STATUS)
    assigned_to = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL, related_name="assigned_fields"
    )
    assigned_by = models.ForeignKey(
        User, null=True, blank=True, on_delete=models.SET_NULL, related_name="created_fields"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["assigned_to", "-created_at"]),
            models.Index(fields=["current_stage"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.crop_type})"

    @property
    def status(self):
        """Compute field status based on stage and planting date.
        
        Returns:
            'completed': stage is harvested or done
            'at_risk': stage is planted/growing and planting_date is older than 14 days
            'active': all other cases
        """
        if self.current_stage in (self.Stage.HARVESTED, self.Stage.DONE):
            return "completed"
        if self.planting_date:
            days_since = (timezone.now().date() - self.planting_date).days
            stale_stages = (self.Stage.PLANTED, self.Stage.GROWING)
            if self.current_stage in stale_stages and days_since > 14:
                return "at_risk"
        return "active"


class Note(models.Model):
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name="notes")
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="notes")
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["field", "-created_at"]),
        ]

    def __str__(self):
        return f"Note on {self.field.name} by {self.author.username if self.author else 'deleted'}"

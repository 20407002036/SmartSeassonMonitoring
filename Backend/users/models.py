from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
	class Role(models.TextChoices):
		ADMIN = "admin", "Admin"
		FIELD_AGENT = "field_agent", "Field Agent"

	role = models.CharField(max_length=20, choices=Role.choices, default=Role.FIELD_AGENT)

	@property
	def is_admin(self):
		return self.role == self.Role.ADMIN

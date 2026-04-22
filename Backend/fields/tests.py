from datetime import timedelta

from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from fields.models import Field
from users.models import User


class FieldApiTests(APITestCase):
	def setUp(self):
		self.admin = User.objects.create_user(
			username="admin",
			password="admin123",
			role=User.Role.ADMIN,
		)
		self.agent = User.objects.create_user(
			username="agent1",
			password="agent123",
			role=User.Role.FIELD_AGENT,
		)
		self.other_agent = User.objects.create_user(
			username="agent2",
			password="agent123",
			role=User.Role.FIELD_AGENT,
		)

		self.assigned_field = Field.objects.create(
			name="North Plot",
			crop_type="Corn",
			planting_date=timezone.now().date() - timedelta(days=20),
			current_stage=Field.Stage.PLANTED,
			assigned_to=self.agent,
			assigned_by=self.admin,
		)
		self.unassigned_field = Field.objects.create(
			name="South Plot",
			crop_type="Wheat",
			planting_date=timezone.now().date(),
			current_stage=Field.Stage.GROWING,
			assigned_to=self.other_agent,
			assigned_by=self.admin,
		)

	def test_admin_lists_all_fields(self):
		self.client.force_authenticate(user=self.admin)

		response = self.client.get(reverse("field-list-create"))

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), 2)

	def test_agent_lists_only_assigned_fields(self):
		self.client.force_authenticate(user=self.agent)

		response = self.client.get(reverse("field-list-create"))

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), 1)
		self.assertEqual(response.data[0]["id"], self.assigned_field.id)

	def test_assigned_agent_can_update_stage(self):
		self.client.force_authenticate(user=self.agent)

		response = self.client.put(
			reverse("field-stage-update", args=[self.assigned_field.id]),
			{"current_stage": Field.Stage.READY},
			format="json",
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assigned_field.refresh_from_db()
		self.assertEqual(self.assigned_field.current_stage, Field.Stage.READY)

	def test_unassigned_agent_cannot_update_stage(self):
		self.client.force_authenticate(user=self.agent)

		response = self.client.put(
			reverse("field-stage-update", args=[self.unassigned_field.id]),
			{"current_stage": Field.Stage.READY},
			format="json",
		)

		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

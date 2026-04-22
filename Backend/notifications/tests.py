from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from fields.models import Field
from notifications.models import Notification
from users.models import User


class NotificationApiTests(APITestCase):
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
		self.other_admin = User.objects.create_user(
			username="admin2",
			password="admin123",
			role=User.Role.ADMIN,
		)

		self.field = Field.objects.create(
			name="East Plot",
			crop_type="Rice",
			current_stage=Field.Stage.GROWING,
			assigned_to=self.agent,
			assigned_by=self.admin,
		)

	def test_stage_update_creates_notifications_for_admins(self):
		self.client.force_authenticate(user=self.agent)

		update_response = self.client.put(
			reverse("field-stage-update", args=[self.field.id]),
			{"current_stage": Field.Stage.READY},
			format="json",
		)
		self.assertEqual(update_response.status_code, status.HTTP_200_OK)

		self.assertEqual(Notification.objects.filter(recipient=self.admin).count(), 1)
		self.assertEqual(Notification.objects.filter(recipient=self.other_admin).count(), 1)

	def test_list_notifications_uses_notifications_namespace(self):
		Notification.objects.create(
			field=self.field,
			new_status=Field.Stage.READY,
			recipient=self.admin,
		)
		self.client.force_authenticate(user=self.admin)

		response = self.client.get(reverse("notification-list"))

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(response.data), 1)
		self.assertEqual(response.data[0]["field"]["id"], self.field.id)

	def test_only_recipient_can_mark_notification_as_read(self):
		notification = Notification.objects.create(
			field=self.field,
			new_status=Field.Stage.READY,
			recipient=self.admin,
		)
		self.client.force_authenticate(user=self.other_admin)

		forbidden_response = self.client.put(reverse("notification-read", args=[notification.id]))
		self.assertEqual(forbidden_response.status_code, status.HTTP_404_NOT_FOUND)

		self.client.force_authenticate(user=self.admin)
		ok_response = self.client.put(reverse("notification-read", args=[notification.id]))
		self.assertEqual(ok_response.status_code, status.HTTP_200_OK)

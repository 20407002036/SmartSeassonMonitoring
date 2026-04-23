from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from users.models import User


class UserApiTests(APITestCase):
	def setUp(self):
		self.admin = User.objects.create_user(
			username="admin",
			password="admin123",
			role=User.Role.ADMIN,
			first_name="Admin",
			last_name="User",
		)
		self.agent = User.objects.create_user(
			username="agent1",
			password="agent123",
			role=User.Role.FIELD_AGENT,
			first_name="Field",
			last_name="Agent",
		)

	def test_me_endpoint_returns_authenticated_user(self):
		self.client.force_authenticate(user=self.admin)

		response = self.client.get(reverse("auth_me"))

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data["username"], "admin")
		self.assertEqual(response.data["role"], User.Role.ADMIN)

	def test_agents_endpoint_is_admin_only(self):
		self.client.force_authenticate(user=self.admin)
		admin_response = self.client.get(reverse("field-agent-list"))
		self.assertEqual(admin_response.status_code, status.HTTP_200_OK)
		self.assertEqual(len(admin_response.data), 1)

		self.client.force_authenticate(user=self.agent)
		agent_response = self.client.get(reverse("field-agent-list"))
		self.assertEqual(agent_response.status_code, status.HTTP_403_FORBIDDEN)

	def test_health_endpoint_returns_ok(self):
		response = self.client.get(reverse("health"))

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data, {"status": "ok"})

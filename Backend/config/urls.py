from django.contrib import admin
from django.http import JsonResponse
from django.urls import include, path


def health_check(request):
	return JsonResponse({"status": "ok"})

urlpatterns = [
	path('health/', health_check, name='health'),
    path('admin/', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/', include('fields.urls')),
    path('api/notifications/', include('notifications.urls')),
]

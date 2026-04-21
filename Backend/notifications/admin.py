from django.contrib import admin

from notifications.models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("field", "new_status", "recipient", "is_unread", "created_at")
    list_filter = ("new_status", "recipient", "read_at", "created_at")
    search_fields = ("field__name", "recipient__username")
    readonly_fields = ("created_at",)
    fieldsets = (
        ("Notification", {"fields": ("field", "new_status", "note")}),
        ("Recipient", {"fields": ("recipient",)}),
        ("Status", {"fields": ("is_unread", "read_at")}),
        ("Timestamps", {"fields": ("created_at",), "classes": ("collapse",)}),
    )

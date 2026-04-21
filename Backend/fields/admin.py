from django.contrib import admin

from fields.models import Field, Note


class NoteInline(admin.TabularInline):
    model = Note
    extra = 1
    fields = ("author", "comment", "created_at")
    readonly_fields = ("created_at",)


@admin.register(Field)
class FieldAdmin(admin.ModelAdmin):
    list_display = ("name", "crop_type", "current_stage", "assigned_to", "status", "created_at")
    list_filter = ("current_stage", "crop_type", "assigned_to")
    search_fields = ("name", "crop_type")
    readonly_fields = ("status", "created_at", "updated_at")
    fieldsets = (
        ("Field Info", {"fields": ("name", "crop_type", "planting_date")}),
        ("Stage & Status", {"fields": ("current_stage", "status")}),
        ("Assignment", {"fields": ("assigned_to", "assigned_by")}),
        ("Timestamps", {"fields": ("created_at", "updated_at"), "classes": ("collapse",)}),
    )
    inlines = [NoteInline]


@admin.register(Note)
class NoteAdmin(admin.ModelAdmin):
    list_display = ("field", "author", "created_at")
    list_filter = ("field", "author", "created_at")
    search_fields = ("field__name", "comment")
    readonly_fields = ("created_at",)

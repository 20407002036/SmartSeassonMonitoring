from django.urls import path

from fields.views import FieldAssignView, FieldDetailUpdateView, FieldListCreateView, FieldNotesView, FieldStageUpdateView

urlpatterns = [
    path("", FieldListCreateView.as_view(), name="field-list-create"),
    path("<int:pk>/", FieldDetailUpdateView.as_view(), name="field-detail-update"),
    path("<int:pk>/assign/", FieldAssignView.as_view(), name="field-assign"),
    path("<int:pk>/stage/", FieldStageUpdateView.as_view(), name="field-stage-update"),
    path("<int:pk>/notes/", FieldNotesView.as_view(), name="field-notes"),
]

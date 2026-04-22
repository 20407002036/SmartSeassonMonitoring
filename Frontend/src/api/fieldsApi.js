import { apiRequest } from './httpClient'
import {
  toBackendCreateFieldPayload,
  toBackendStagePayload,
  toFrontendField,
  toFrontendNote,
} from './mappers'

export async function listFields() {
  const data = await apiRequest('/')
  return Array.isArray(data) ? data.map(toFrontendField) : []
}

export async function getFieldById(fieldId) {
  const data = await apiRequest(`/${fieldId}/`)
  return toFrontendField(data)
}

export async function createField(payload) {
  const data = await apiRequest('/', {
    method: 'POST',
    body: toBackendCreateFieldPayload(payload),
  })
  return toFrontendField(data)
}

export async function assignField(fieldId, assignedAgentId) {
  const data = await apiRequest(`/${fieldId}/assign/`, {
    method: 'POST',
    body: {
      assigned_to_id: assignedAgentId ? Number(assignedAgentId) : null,
    },
  })
  return toFrontendField(data)
}

export async function updateFieldStage(fieldId, stageLabel) {
  const data = await apiRequest(`/${fieldId}/stage/`, {
    method: 'PUT',
    body: toBackendStagePayload(stageLabel),
  })
  return toFrontendField(data)
}

export async function listFieldNotes(fieldId) {
  const data = await apiRequest(`/${fieldId}/notes/`)
  return Array.isArray(data) ? data.map(toFrontendNote) : []
}

export async function createFieldNote(fieldId, comment) {
  const data = await apiRequest(`/${fieldId}/notes/`, {
    method: 'POST',
    body: { comment },
  })
  return toFrontendNote(data)
}

const STAGE_LABELS = {
  no_status: 'No Status',
  planted: 'Planted',
  growing: 'Growing',
  ready: 'Ready',
  harvested: 'Harvested',
  done: 'Done',
}

const STATUS_LABELS = {
  active: 'Active',
  at_risk: 'At Risk',
  completed: 'Completed',
}

export function toBackendStage(stageLabel) {
  if (!stageLabel) {
    return 'no_status'
  }

  return String(stageLabel).trim().toLowerCase().replace(/\s+/g, '_')
}

export function toFrontendStage(stageValue) {
  return STAGE_LABELS[stageValue] || 'No Status'
}

export function toFrontendStatus(statusValue) {
  return STATUS_LABELS[statusValue] || 'Active'
}

export function toFrontendUser(user) {
  if (!user) {
    return null
  }

  return {
    id: String(user.id),
    role: user.role === 'field_agent' ? 'agent' : user.role,
    name: user.name || user.full_name || user.username,
    email: user.email || '',
  }
}

export function toFrontendNote(note) {
  return {
    id: String(note.id),
    by: note.author?.full_name || note.author?.username || 'Unknown',
    at: note.created_at,
    text: note.comment,
  }
}

export function toFrontendField(field) {
  return {
    id: String(field.id),
    name: field.name,
    cropType: field.crop_type,
    plantingDate: field.planting_date,
    currentStage: toFrontendStage(field.current_stage),
    status: toFrontendStatus(field.status),
    assignedAgentId: field.assigned_to?.id ? String(field.assigned_to.id) : null,
    assignedAgent: field.assigned_to
      ? {
          id: String(field.assigned_to.id),
          name: field.assigned_to.full_name || field.assigned_to.username,
          email: field.assigned_to.email || '',
          role: field.assigned_to.role,
        }
      : null,
    notes: Array.isArray(field.notes) ? field.notes.map(toFrontendNote) : [],
    updates: [],
    raw: field,
  }
}

export function toBackendCreateFieldPayload(payload) {
  return {
    name: payload.name,
    crop_type: payload.cropType,
    planting_date: payload.plantingDate,
    current_stage: toBackendStage(payload.currentStage),
    assigned_to_id: payload.assignedAgentId ? Number(payload.assignedAgentId) : null,
  }
}

export function toBackendStagePayload(stageLabel) {
  return {
    current_stage: toBackendStage(stageLabel),
  }
}

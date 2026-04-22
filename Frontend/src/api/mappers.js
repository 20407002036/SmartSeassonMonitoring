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

function toFrontendUpdate(update, fallback) {
  if (!update || typeof update !== 'object') {
    return null
  }

  const stageValue =
    update.stage ||
    update.current_stage ||
    update.new_stage ||
    update.to_stage ||
    fallback.currentStage

  const normalizedStage = stageValue && STAGE_LABELS[stageValue] ? toFrontendStage(stageValue) : stageValue

  const statusValue = update.status || update.new_status || fallback.status
  const normalizedStatus = statusValue && STATUS_LABELS[statusValue] ? toFrontendStatus(statusValue) : statusValue

  return {
    id: String(update.id || `${update.created_at || update.at || update.updated_at || 'update'}-${update.by || update.author?.username || 'unknown'}`),
    by:
      update.by ||
      update.author?.full_name ||
      update.author?.username ||
      update.actor?.full_name ||
      update.actor?.username ||
      'Unknown',
    at: update.at || update.created_at || update.updated_at || new Date().toISOString(),
    stage: normalizedStage || fallback.currentStage,
    status: normalizedStatus || fallback.status,
    note: update.note || update.comment || update.description || '',
  }
}

export function toFrontendField(field) {
  const fallback = {
    currentStage: toFrontendStage(field.current_stage),
    status: toFrontendStatus(field.status),
  }

  const mappedNotes = Array.isArray(field.notes) ? field.notes.map(toFrontendNote) : []
  const mappedUpdates = Array.isArray(field.updates)
    ? field.updates.map((item) => toFrontendUpdate(item, fallback)).filter(Boolean)
    : []

  const noteBackfilledUpdates = mappedNotes.map((note) => ({
    id: `note-${note.id}`,
    by: note.by,
    at: note.at,
    stage: fallback.currentStage,
    status: fallback.status,
    note: note.text,
  }))

  return {
    id: String(field.id),
    name: field.name,
    cropType: field.crop_type,
    plantingDate: field.planting_date,
    currentStage: fallback.currentStage,
    status: fallback.status,
    assignedAgentId: field.assigned_to?.id ? String(field.assigned_to.id) : null,
    assignedAgent: field.assigned_to
      ? {
          id: String(field.assigned_to.id),
          name: field.assigned_to.full_name || field.assigned_to.username,
          email: field.assigned_to.email || '',
          role: field.assigned_to.role,
        }
      : null,
    notes: mappedNotes,
    updates: mappedUpdates.length ? mappedUpdates : noteBackfilledUpdates,
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

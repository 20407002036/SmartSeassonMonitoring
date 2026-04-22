import { useState } from 'react'
import { AGENT_STAGE_OPTIONS } from '../data/mockData'

function CreateFieldModal({ isOpen, agents, onClose, onSubmit, isSubmitting }) {
  const [name, setName] = useState('')
  const [cropType, setCropType] = useState('')
  const [plantingDate, setPlantingDate] = useState(new Date().toISOString().slice(0, 10))
  const [currentStage, setCurrentStage] = useState(AGENT_STAGE_OPTIONS[0])
  const [assignedAgentId, setAssignedAgentId] = useState('')

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-on-surface/30 p-4 backdrop-blur-lg sm:items-center">
      <div className="w-full max-w-lg rounded-2xl bg-surface/90 p-6 shadow-[0_12px_40px_rgba(25,28,29,0.14)] backdrop-blur-2xl">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-on-surface font-headline">Create Field</h3>
            <p className="mt-1 text-sm text-on-surface-variant">Enter the field details to create a real record.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full bg-surface-container-low p-2 text-on-surface-variant disabled:cursor-not-allowed disabled:opacity-60"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (isSubmitting) {
              return
            }
            onSubmit({
              name: name.trim(),
              cropType: cropType.trim(),
              plantingDate,
              currentStage,
              assignedAgentId: assignedAgentId || null,
            })
          }}
          className="space-y-5"
        >
          <label className="block text-sm font-semibold text-on-surface-variant">
            Field Name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isSubmitting}
              placeholder="e.g. North Ridge 4"
              className="mt-2 w-full rounded-xl bg-surface-container-high px-4 py-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </label>

          <label className="block text-sm font-semibold text-on-surface-variant">
            Crop Type
            <input
              type="text"
              value={cropType}
              onChange={(event) => setCropType(event.target.value)}
              disabled={isSubmitting}
              placeholder="e.g. Maize"
              className="mt-2 w-full rounded-xl bg-surface-container-high px-4 py-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-on-surface-variant">
              Planting Date
              <input
                type="date"
                value={plantingDate}
                onChange={(event) => setPlantingDate(event.target.value)}
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl bg-surface-container-high px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-on-surface-variant">
              Current Stage
              <select
                value={currentStage}
                onChange={(event) => setCurrentStage(event.target.value)}
                disabled={isSubmitting}
                className="mt-2 w-full rounded-xl bg-surface-container-high px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {AGENT_STAGE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="block text-sm font-semibold text-on-surface-variant">
            Assign Agent
            <select
              value={assignedAgentId}
              onChange={(event) => setAssignedAgentId(event.target.value)}
              disabled={isSubmitting}
              className="mt-2 w-full rounded-xl bg-surface-container-high px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Unassigned</option>
              {agents.map((agent) => (
                <option key={agent.id} value={agent.id}>
                  {agent.name}
                </option>
              ))}
            </select>
          </label>

          <p className="text-xs text-on-surface-variant">
            Status is derived from stage after creation.
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-surface-container-low px-4 py-3 text-sm font-semibold text-on-surface disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-xl bg-gradient-to-br from-primary to-primary-container px-4 py-3 text-sm font-bold uppercase tracking-wide text-on-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Processing...' : 'Create Field'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateFieldModal
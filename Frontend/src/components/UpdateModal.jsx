import { useEffect, useState } from 'react'
import { AGENT_STAGE_OPTIONS } from '../data/mockData'

function UpdateModal({ field, isOpen, onClose, onSubmit }) {
  const [stage, setStage] = useState(field?.currentStage || 'Planted')
  const [note, setNote] = useState('')

  useEffect(() => {
    if (field) {
      setStage(field.currentStage)
      setNote('')
    }
  }, [field])

  if (!isOpen || !field) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-on-surface/30 p-4 backdrop-blur-lg sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-surface/80 p-6 shadow-[0_12px_40px_rgba(25,28,29,0.14)] backdrop-blur-2xl">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-xl font-bold text-on-surface font-headline">Update {field.name}</h3>
          <button type="button" onClick={onClose} className="rounded-full bg-surface-container-low p-2 text-on-surface-variant">
            ✕
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault()
            onSubmit(field.id, { stage, note })
          }}
          className="space-y-5"
        >
          <label className="block text-sm font-semibold text-on-surface-variant">
            Stage
            <select
              className="mt-2 w-full rounded-xl bg-surface-container-high px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
              value={stage}
              onChange={(event) => setStage(event.target.value)}
            >
              {AGENT_STAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-semibold text-on-surface-variant">
            Observation Notes
            <textarea
              rows={4}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Describe plant condition, irrigation, or alerts..."
              className="mt-2 w-full rounded-xl bg-surface-container-high px-4 py-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </label>

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-br from-primary to-primary-container px-4 py-3 text-sm font-bold uppercase tracking-wide text-on-primary"
          >
            Submit Update
          </button>
        </form>
      </div>
    </div>
  )
}

export default UpdateModal

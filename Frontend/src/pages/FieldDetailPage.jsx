import StatusBadge from '../components/StatusBadge'
import { STAGE_PROGRESS } from '../data/mockData'

function FieldDetailPage({ field, assignedAgentName, onQuickUpdate }) {
  if (!field) {
    return (
      <section className="rounded-xl bg-surface-container-low p-8 text-on-surface-variant">
        Select a field to view details.
      </section>
    )
  }

  const progressValue = STAGE_PROGRESS[field.currentStage] ?? 10

  return (
    <section className="space-y-8">
      <header className="rounded-2xl bg-surface-container-low p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline">{field.name}</h1>
            <p className="mt-2 text-sm text-on-surface-variant">
              {field.cropType} · Planted {field.plantingDate} · Agent: {assignedAgentName || 'Unassigned'}
            </p>
          </div>
          <StatusBadge status={field.status} />
        </div>

        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-sm text-on-surface-variant">
            <span>Current Stage: {field.currentStage}</span>
            <span>{progressValue}%</span>
          </div>
          <div className="h-3 rounded-full bg-surface-container-high">
            <div style={{ width: `${progressValue}%` }} className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container" />
          </div>
        </div>

        <button
          type="button"
          onClick={() => onQuickUpdate(field.id)}
          className="mt-6 rounded-xl bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold uppercase tracking-wide text-on-primary"
        >
          Update Field
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl bg-surface-container-low p-6">
          <h2 className="text-xl font-bold text-on-surface font-headline">Activity Log</h2>
          <div className="mt-4 space-y-3">
            {field.updates.length === 0 ? (
              <p className="rounded-xl bg-surface-container-lowest p-4 text-sm text-on-surface-variant">No updates yet.</p>
            ) : (
              field.updates.map((update) => (
                <div key={update.id} className="rounded-xl bg-surface-container-lowest p-4">
                  <p className="text-sm text-on-surface">
                    <strong>{update.by}</strong> set stage to <strong>{update.stage}</strong>
                  </p>
                  <p className="mt-1 text-sm text-on-surface-variant">{update.note || 'No note provided.'}</p>
                  <p className="mt-2 text-xs text-on-surface-variant">{new Date(update.at).toLocaleString()}</p>
                </div>
              ))
            )}
          </div>
        </article>

        <article className="rounded-2xl bg-surface-container-low p-6">
          <h2 className="text-xl font-bold text-on-surface font-headline">Notes</h2>
          <div className="mt-4 space-y-3">
            {field.notes.length === 0 ? (
              <p className="rounded-xl bg-surface-container-lowest p-4 text-sm text-on-surface-variant">No notes captured yet.</p>
            ) : (
              field.notes.map((note) => (
                <div key={note.id} className="rounded-xl bg-surface-container-lowest p-4">
                  <p className="text-sm text-on-surface">{note.text}</p>
                  <p className="mt-2 text-xs text-on-surface-variant">
                    {note.by} · {new Date(note.at).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </article>
      </div>
    </section>
  )
}

export default FieldDetailPage

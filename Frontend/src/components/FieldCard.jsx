import StatusBadge from './StatusBadge'

function FieldCard({ field, assignedName, onQuickUpdate, onOpenDetail, showAgent = false }) {
  return (
    <article className="rounded-xl bg-surface-container-lowest p-5 shadow-[0_12px_40px_rgba(25,28,29,0.06)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-xl font-bold tracking-tight text-on-surface font-headline">{field.name}</h4>
          <p className="mt-1 text-sm text-on-surface-variant">
            {field.cropType} · Planted {field.plantingDate}
          </p>
        </div>
        <StatusBadge status={field.status} />
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-on-surface-variant">
        <span className="rounded-full bg-surface-container-low px-3 py-1">Stage: {field.currentStage}</span>
        {showAgent ? <span className="rounded-full bg-surface-container-low px-3 py-1">Agent: {assignedName || 'Unassigned'}</span> : null}
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={() => onOpenDetail(field.id)}
          className="rounded-lg bg-surface-container-high px-4 py-2 text-sm font-semibold text-on-surface"
        >
          View Detail
        </button>
        <button
          type="button"
          onClick={() => onQuickUpdate(field.id)}
          className="rounded-lg bg-gradient-to-br from-primary to-primary-container px-4 py-2 text-sm font-semibold text-on-primary"
        >
          Quick Update
        </button>
      </div>
    </article>
  )
}

export default FieldCard

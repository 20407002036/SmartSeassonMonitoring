import DashboardCard from '../components/DashboardCard'
import FieldCard from '../components/FieldCard'

function AgentDashboardPage({ fields, currentUser, onQuickUpdate, onOpenField }) {
  const assignedFields = fields.filter((field) => field.assignedAgentId === currentUser.id)
  const atRiskFields = assignedFields.filter((field) => field.status === 'At Risk')

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline">Field Agent Dashboard</h1>
        <p className="mt-2 text-sm text-on-surface-variant">{currentUser.name}, these are your assigned plots for today.</p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <DashboardCard title="Assigned Fields" value={assignedFields.length} helper="Directly owned by you" />
        <DashboardCard
          title="Need Attention"
          value={atRiskFields.length}
          helper="At Risk status"
          accent="from-secondary-container to-secondary"
        />
      </div>

      {assignedFields.length === 0 ? (
        <article className="rounded-xl bg-surface-container-low p-8 text-center text-on-surface-variant">
          No fields assigned yet.
        </article>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {assignedFields.map((field) => (
            <FieldCard
              key={field.id}
              field={field}
              onQuickUpdate={onQuickUpdate}
              onOpenDetail={onOpenField}
              showAgent={false}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default AgentDashboardPage

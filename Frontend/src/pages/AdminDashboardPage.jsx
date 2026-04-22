import DashboardCard from '../components/DashboardCard'
import StatusBadge from '../components/StatusBadge'

function AdminDashboardPage({ fields, recentUpdates, agentsById, onOpenField, onOpenUpdate }) {
  const summary = {
    total: fields.length,
    active: fields.filter((field) => field.status === 'Active').length,
    atRisk: fields.filter((field) => field.status === 'At Risk').length,
    completed: fields.filter((field) => field.status === 'Completed').length,
  }

  const statusPercentages = [
    { label: 'Active', value: summary.total ? Math.round((summary.active / summary.total) * 100) : 0 },
    { label: 'At Risk', value: summary.total ? Math.round((summary.atRisk / summary.total) * 100) : 0 },
    { label: 'Completed', value: summary.total ? Math.round((summary.completed / summary.total) * 100) : 0 },
  ]

  return (
    <section className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-on-surface-variant">System-wide crop monitoring and assignment control.</p>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Total Fields" value={summary.total} helper="Managed this season" />
        <DashboardCard title="Active Fields" value={summary.active} helper="On-track growth" />
        <DashboardCard title="At Risk Fields" value={summary.atRisk} helper="Needs attention" accent="from-secondary-container to-secondary" />
        <DashboardCard title="Completed Fields" value={summary.completed} helper="Harvested" accent="from-tertiary-fixed-dim to-tertiary" />
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-2xl bg-surface-container-low p-6 xl:col-span-2">
          <h2 className="text-xl font-bold tracking-tight text-on-surface font-headline">All Fields</h2>
          <div className="mt-4 overflow-x-auto rounded-xl bg-surface-container-lowest">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-surface-container-high text-on-surface-variant">
                <tr>
                  <th className="px-4 py-3">Field</th>
                  <th className="px-4 py-3">Crop</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3">Agent</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, index) => (
                  <tr key={field.id} className={index % 2 === 0 ? 'bg-surface' : 'bg-surface-container-low'}>
                    <td className="px-4 py-3 font-semibold text-on-surface">{field.name}</td>
                    <td className="px-4 py-3">{field.cropType}</td>
                    <td className="px-4 py-3">{field.currentStage}</td>
                    <td className="px-4 py-3">{agentsById[field.assignedAgentId]?.name || 'Unassigned'}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={field.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button type="button" className="font-semibold text-primary" onClick={() => onOpenField(field.id)}>
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <div className="space-y-6">
          <article className="rounded-2xl bg-surface-container-low p-6">
            <h2 className="text-xl font-bold tracking-tight text-on-surface font-headline">Status Breakdown</h2>
            <div className="mt-4 space-y-3">
              {statusPercentages.map((status) => (
                <div key={status.label} className="space-y-1">
                  <div className="flex items-center justify-between text-sm text-on-surface-variant">
                    <span>{status.label}</span>
                    <span>{status.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-container-high">
                    <div
                      style={{ width: `${status.value}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container"
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl bg-surface-container-low p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight text-on-surface font-headline">Recent Updates</h2>
            </div>
            <div className="mt-4 space-y-3">
              {recentUpdates.length ? (
                recentUpdates.map((update) => (
                  <div key={update.id} className="rounded-xl bg-surface-container-lowest p-4">
                    <p className="text-sm text-on-surface">
                      <strong>{update.actor}</strong> {update.action}
                    </p>
                    <p className="mt-1 text-xs text-on-surface-variant">{new Date(update.at).toLocaleString()}</p>
                  </div>
                ))
              ) : (
                <div className="rounded-xl bg-surface-container-lowest p-4 text-sm text-on-surface-variant">
                  No recent updates yet.
                </div>
              )}
            </div>
          </article>

          <button
            type="button"
            onClick={() => onOpenUpdate(fields[0]?.id)}
            className="w-full rounded-xl bg-gradient-to-br from-primary to-primary-container px-4 py-3 text-sm font-bold uppercase tracking-wide text-on-primary"
          >
            Quick Update Any Field
          </button>
        </div>
      </div>
    </section>
  )
}

export default AdminDashboardPage

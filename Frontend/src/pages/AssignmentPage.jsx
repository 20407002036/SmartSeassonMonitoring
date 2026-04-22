function AssignmentPage({ fields, agents, agentsById, assigningFieldIds, onAssignAgent }) {
  const workloads = agents.map((agent) => {
    const assigned = fields.filter((field) => field.assignedAgentId === agent.id)
    const atRiskCount = assigned.filter((field) => field.status === 'At Risk').length

    return {
      ...agent,
      totalAssigned: assigned.length,
      atRiskCount,
    }
  })

  return (
    <section className="space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline">User & Assignment</h1>
        <p className="mt-2 text-sm text-on-surface-variant">Assign fields to agents and balance workload distribution.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl bg-surface-container-low p-6">
          <h2 className="text-xl font-bold text-on-surface font-headline">Assign Field</h2>
          <div className="mt-4 space-y-3">
            {fields.map((field) => (
              <div key={field.id} className="rounded-xl bg-surface-container-lowest p-4">
                <p className="font-semibold text-on-surface">{field.name}</p>
                <p className="text-sm text-on-surface-variant">Current: {agentsById[field.assignedAgentId]?.name || 'Unassigned'}</p>
                <select
                  value={field.assignedAgentId || ''}
                  onChange={(event) => onAssignAgent(field.id, event.target.value)}
                  disabled={assigningFieldIds.has(String(field.id))}
                  className="mt-3 w-full rounded-xl bg-surface-container-high px-3 py-2 text-sm text-on-surface disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <option value="">Unassigned</option>
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-2xl bg-surface-container-low p-6">
          <h2 className="text-xl font-bold text-on-surface font-headline">Agent Workload</h2>
          <div className="mt-4 space-y-3">
            {workloads.map((agent) => (
              <div key={agent.id} className="rounded-xl bg-surface-container-lowest p-4">
                <p className="font-semibold text-on-surface">{agent.name}</p>
                <p className="mt-1 text-sm text-on-surface-variant">Fields assigned: {agent.totalAssigned}</p>
                <p className="text-sm text-on-surface-variant">At risk in queue: {agent.atRiskCount}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}

export default AssignmentPage

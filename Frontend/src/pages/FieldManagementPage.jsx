import { useMemo, useState } from 'react'
import StatusBadge from '../components/StatusBadge'

function FieldManagementPage({ fields, agents, agentsById, userRole, onCreateField, onAssignAgent, onOpenUpdate, onOpenField }) {
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [cropFilter, setCropFilter] = useState('All')

  const crops = useMemo(() => ['All', ...new Set(fields.map((field) => field.cropType))], [fields])

  const filtered = useMemo(() => {
    return fields.filter((field) => {
      const matchesSearch = field.name.toLowerCase().includes(query.toLowerCase())
      const matchesStatus = statusFilter === 'All' || field.status === statusFilter
      const matchesCrop = cropFilter === 'All' || field.cropType === cropFilter
      return matchesSearch && matchesStatus && matchesCrop
    })
  }, [fields, query, statusFilter, cropFilter])

  return (
    <section className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline">Field Management</h1>
          <p className="mt-2 text-sm text-on-surface-variant">Search, filter, and update all crop plots quickly.</p>
        </div>
        {userRole === 'admin' ? (
          <button
            type="button"
            onClick={onCreateField}
            className="rounded-xl bg-gradient-to-br from-primary to-primary-container px-5 py-3 text-sm font-bold uppercase tracking-wide text-on-primary"
          >
            Create Field
          </button>
        ) : null}
      </header>

      <article className="rounded-2xl bg-surface-container-low p-6">
        <div className="grid gap-3 md:grid-cols-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by field name"
            className="rounded-xl bg-surface-container-high px-4 py-3 text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl bg-surface-container-high px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option>All</option>
            <option>Active</option>
            <option>At Risk</option>
            <option>Completed</option>
          </select>

          <select
            value={cropFilter}
            onChange={(event) => setCropFilter(event.target.value)}
            className="rounded-xl bg-surface-container-high px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {crops.map((crop) => (
              <option key={crop}>{crop}</option>
            ))}
          </select>

          <p className="self-center text-sm font-medium text-on-surface-variant">Results: {filtered.length}</p>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl bg-surface-container-lowest">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-surface-container-high text-on-surface-variant">
              <tr>
                <th className="px-4 py-3">Field Name</th>
                <th className="px-4 py-3">Crop Type</th>
                <th className="px-4 py-3">Planting Date</th>
                <th className="px-4 py-3">Current Stage</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Assigned Agent</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((field, index) => (
                <tr key={field.id} className={index % 2 === 0 ? 'bg-surface' : 'bg-surface-container-low'}>
                  <td className="px-4 py-3 font-semibold text-on-surface">{field.name}</td>
                  <td className="px-4 py-3">{field.cropType}</td>
                  <td className="px-4 py-3">{field.plantingDate}</td>
                  <td className="px-4 py-3">{field.currentStage}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={field.status} />
                  </td>
                  <td className="px-4 py-3">
                    {userRole === 'admin' ? (
                      <select
                        value={field.assignedAgentId || ''}
                        onChange={(event) => onAssignAgent(field.id, event.target.value)}
                        className="rounded-lg bg-surface-container-high px-3 py-2 text-sm text-on-surface"
                      >
                        <option value="">Unassigned</option>
                        {agents.map((agent) => (
                          <option key={agent.id} value={agent.id}>
                            {agent.name}
                          </option>
                        ))}
                      </select>
                    ) : (
                      agentsById[field.assignedAgentId]?.name || 'Unassigned'
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" className="mr-3 font-semibold text-primary" onClick={() => onOpenField(field.id)}>
                      Detail
                    </button>
                    <button type="button" className="font-semibold text-primary" onClick={() => onOpenUpdate(field.id)}>
                      Update
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  )
}

export default FieldManagementPage

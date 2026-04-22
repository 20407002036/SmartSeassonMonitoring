function DashboardCard({ title, value, helper, accent = 'from-primary to-primary-container' }) {
  return (
    <article className="rounded-xl bg-surface-container-lowest p-5 shadow-[0_12px_40px_rgba(25,28,29,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-on-surface-variant">
        {title}
      </p>
      <p className="mt-3 text-4xl font-extrabold leading-none text-on-surface font-headline">{value}</p>
      {helper ? (
        <p className="mt-4 inline-flex items-center rounded-full bg-surface-container-low px-3 py-1 text-xs font-medium text-on-surface-variant">
          <span className={`mr-2 h-2 w-2 rounded-full bg-gradient-to-br ${accent}`} />
          {helper}
        </p>
      ) : null}
    </article>
  )
}

export default DashboardCard

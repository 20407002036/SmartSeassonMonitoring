function NotificationsPage({ notifications, unreadCount, loading, error, onRefresh, onMarkAsRead }) {
  return (
    <section className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline">Notifications</h1>
          <p className="mt-2 text-sm text-on-surface-variant">Monitor updates triggered by field changes and agent actions.</p>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-full bg-surface-container-high px-4 py-2 text-sm font-semibold text-on-surface">
            Unread: {unreadCount}
          </span>
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-xl bg-surface-container-low px-4 py-2 text-sm font-semibold text-on-surface"
          >
            Refresh
          </button>
        </div>
      </header>

      {loading ? (
        <article className="rounded-xl bg-surface-container-low p-6 text-sm text-on-surface-variant">Loading notifications...</article>
      ) : null}

      {error ? (
        <article className="rounded-xl bg-secondary-container p-6 text-sm font-semibold text-on-secondary-container">{error}</article>
      ) : null}

      {!loading && notifications.length === 0 ? (
        <article className="rounded-xl bg-surface-container-low p-6 text-sm text-on-surface-variant">No notifications yet.</article>
      ) : null}

      <div className="space-y-3">
        {notifications.map((notification) => (
          <article key={notification.id} className="rounded-xl bg-surface-container-low p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-on-surface">{notification.fieldName}</p>
                <p className="mt-1 text-sm text-on-surface-variant">Status moved to {notification.newStatus || 'updated'}.</p>
                <p className="mt-2 text-xs text-on-surface-variant">{new Date(notification.createdAt).toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-2">
                {notification.isUnread ? (
                  <span className="rounded-full bg-primary-fixed px-3 py-1 text-xs font-semibold text-on-primary-fixed">Unread</span>
                ) : (
                  <span className="rounded-full bg-surface-container-high px-3 py-1 text-xs font-semibold text-on-surface-variant">Read</span>
                )}

                {notification.isUnread ? (
                  <button
                    type="button"
                    onClick={() => onMarkAsRead(notification.id)}
                    className="rounded-lg bg-gradient-to-br from-primary to-primary-container px-3 py-2 text-xs font-bold uppercase tracking-wide text-on-primary"
                  >
                    Mark Read
                  </button>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default NotificationsPage

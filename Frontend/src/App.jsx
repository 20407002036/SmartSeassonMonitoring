import { useState } from 'react'
import LoginPage from './pages/LoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AgentDashboardPage from './pages/AgentDashboardPage'
import FieldManagementPage from './pages/FieldManagementPage'
import FieldDetailPage from './pages/FieldDetailPage'
import AssignmentPage from './pages/AssignmentPage'
import NotificationsPage from './pages/NotificationsPage'
import CreateFieldModal from './components/CreateFieldModal'
import UpdateModal from './components/UpdateModal'
import ToastStack from './components/ToastStack'
import { useAppData } from './state/useAppData'

function App() {
  const [isCreateFieldOpen, setIsCreateFieldOpen] = useState(false)
  const {
    currentUser,
    fields,
    recentUpdates,
    activePage,
    loginError,
    updateFieldId,
    modalField,
    agents,
    agentsById,
    visibleFields,
    safeSelectedField,
    toasts,
    notifications,
    unreadCount,
    notificationsLoading,
    notificationsError,
    setActivePage,
    setUpdateFieldId,
    handleLogin,
    handleLogout,
    handleAssignAgent,
    handleCreateField,
    handleOpenField,
    handleOpenUpdate,
    handleSubmitUpdate,
    dismissToast,
    refreshNotifications,
    markOneNotificationRead,
  } = useAppData()

  const handleOpenCreateField = () => {
    setIsCreateFieldOpen(true)
  }

  const handleSubmitCreateField = async (payload) => {
    const createdField = await handleCreateField(payload)
    if (createdField) {
      setIsCreateFieldOpen(false)
    }
  }

  const navItems =
    currentUser?.role === 'admin'
      ? [
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'management', label: 'Field Management' },
          { id: 'detail', label: 'Field Detail' },
          { id: 'assignment', label: 'User / Assignment' },
          { id: 'notifications', label: `Notifications (${unreadCount})` },
        ]
      : [
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'management', label: 'Field Management' },
          { id: 'detail', label: 'Field Detail' },
          { id: 'notifications', label: `Notifications (${unreadCount})` },
        ]

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} loginError={loginError} />
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-30 border-b border-outline-variant/20 bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-on-surface-variant">SmartSeason</p>
            <p className="text-lg font-bold tracking-tight text-on-surface font-headline">
              {currentUser.role === 'admin' ? 'Coordinator Console' : 'Agent Console'}
            </p>
          </div>

          <nav className="flex flex-wrap gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActivePage(item.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  activePage === item.id
                    ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary'
                    : 'bg-surface-container-low text-on-surface-variant'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-on-surface">{currentUser.name}</p>
              <p className="text-xs uppercase tracking-wide text-on-surface-variant">{currentUser.role}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-surface-container-low px-3 py-2 text-sm font-semibold text-on-surface"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {activePage === 'dashboard' && currentUser.role === 'admin' ? (
          <AdminDashboardPage
            fields={fields}
            recentUpdates={recentUpdates.slice(0, 4)}
            agentsById={agentsById}
            onOpenField={handleOpenField}
            onOpenUpdate={handleOpenUpdate}
          />
        ) : null}

        {activePage === 'dashboard' && currentUser.role === 'agent' ? (
          <AgentDashboardPage
            fields={fields}
            currentUser={currentUser}
            onQuickUpdate={handleOpenUpdate}
            onOpenField={handleOpenField}
          />
        ) : null}

        {activePage === 'management' ? (
          <FieldManagementPage
            fields={visibleFields}
            agents={agents}
            agentsById={agentsById}
            userRole={currentUser.role}
            onCreateField={handleOpenCreateField}
            onAssignAgent={handleAssignAgent}
            onOpenUpdate={handleOpenUpdate}
            onOpenField={handleOpenField}
          />
        ) : null}

        {activePage === 'detail' ? (
          <FieldDetailPage
            field={safeSelectedField}
            assignedAgentName={agentsById[safeSelectedField?.assignedAgentId]?.name}
            onQuickUpdate={handleOpenUpdate}
          />
        ) : null}

        {activePage === 'assignment' && currentUser.role === 'admin' ? (
          <AssignmentPage
            fields={fields}
            agents={agents}
            agentsById={agentsById}
            onAssignAgent={handleAssignAgent}
          />
        ) : null}

        {activePage === 'notifications' ? (
          <NotificationsPage
            notifications={notifications}
            unreadCount={unreadCount}
            loading={notificationsLoading}
            error={notificationsError}
            onRefresh={refreshNotifications}
            onMarkAsRead={markOneNotificationRead}
          />
        ) : null}
      </main>

      <UpdateModal
        key={`${updateFieldId || 'none'}-${Boolean(updateFieldId)}`}
        field={modalField}
        isOpen={Boolean(updateFieldId)}
        onClose={() => setUpdateFieldId(null)}
        onSubmit={handleSubmitUpdate}
      />

      <CreateFieldModal
        isOpen={isCreateFieldOpen}
        agents={agents}
        onClose={() => setIsCreateFieldOpen(false)}
        onSubmit={handleSubmitCreateField}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  )
}

export default App

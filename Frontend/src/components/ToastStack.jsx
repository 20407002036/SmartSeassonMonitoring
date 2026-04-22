function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex min-w-72 items-center justify-between gap-4 rounded-xl bg-surface-container-lowest px-4 py-3 shadow-[0_12px_40px_rgba(25,28,29,0.12)]"
        >
          <p className="text-sm text-on-surface">{toast.message}</p>
          <button
            type="button"
            onClick={() => onDismiss(toast.id)}
            className="text-xs font-semibold uppercase tracking-wide text-primary"
          >
            Dismiss
          </button>
        </div>
      ))}
    </div>
  )
}

export default ToastStack

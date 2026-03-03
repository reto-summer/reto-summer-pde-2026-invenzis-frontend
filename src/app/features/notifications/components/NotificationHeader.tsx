interface NotificationHeaderProps {
  unreadCount: number;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

export function NotificationHeader({
  unreadCount,
  onMarkAllAsRead,
  onClose
}: NotificationHeaderProps) {
  return (
    <div className="flex items-start justify-between px-4 py-3 border-b border-slate-200 shrink-0">
      <div className="flex flex-col items-start gap-1.5">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-slate-900">Notificaciones</span>
          {unreadCount > 0 && (
            <span className="text-xs font-semibold text-blue-700">
              {unreadCount} nueva{unreadCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllAsRead}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 hover:bg-blue-200 transition-colors"
            aria-label="Marcar todas como vistas"
          >
            Marcar todas como vistas
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="p-1 text-slate-400 hover:text-slate-700 transition-colors rounded"
        aria-label="Cerrar notificaciones"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>
    </div>
  );
}

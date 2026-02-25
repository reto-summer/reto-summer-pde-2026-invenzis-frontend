import { useNotificaciones } from "../hooks/useNotificaciones";
import type { NotificacionResumen } from "../../api/types";

interface NotificationPanelProps {
  onClose: () => void;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-UY", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadge({ success }: { success: boolean }) {
  return success ? (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <path d="m9 11 3 3L22 4"/>
      </svg>
      Éxito
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
      <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" x2="9" y1="9" y2="15"/>
        <line x1="9" x2="15" y1="9" y2="15"/>
      </svg>
      Error
    </span>
  );
}

function NotificationItem({
  notif,
  onClick,
}: {
  notif: NotificacionResumen;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
    >
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="text-sm font-semibold text-slate-900 line-clamp-1 flex-1">
          {notif.title}
        </span>
        <StatusBadge success={notif.success} />
      </div>
      <div className="flex items-center gap-1 text-xs text-slate-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <polyline points="12 6 12 12 16 14"/>
        </svg>
        {formatDate(notif.executionDate)}
      </div>
    </button>
  );
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const {
    notificaciones,
    detalleActual,
    loading,
    loadingDetalle,
    error,
    fetchDetalle,
    clearDetalle,
  } = useNotificaciones();

  const nuevasCount = notificaciones.length;

  return (
    <div className="absolute right-0 top-full mt-2 w-[400px] bg-white rounded-lg shadow-xl border border-slate-200 z-50 flex flex-col max-h-[80vh]">
      {/* Header del panel */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-slate-900">Notificaciones</span>
          {nuevasCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              {nuevasCount} nueva{nuevasCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-700 transition-colors rounded"
          aria-label="Cerrar notificaciones"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>

      {/* Vista detalle */}
      {detalleActual ? (
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          <button
            type="button"
            onClick={clearDetalle}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slate-200 bg-white text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all self-start"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>
            </svg>
            Volver
          </button>

          <div>
            <h3 className="text-base font-bold text-slate-900 leading-snug">
              {detalleActual.title}
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1 text-xs text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
              </svg>
              {formatDate(detalleActual.executionDate)}
            </span>
            <StatusBadge success={detalleActual.success} />
          </div>

          <div className="w-full border-t border-slate-100" />

          {detalleActual.detail && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Detalle</span>
              <p className="text-sm text-slate-700 leading-relaxed">{detalleActual.detail}</p>
            </div>
          )}

          {detalleActual.content && (
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Contenido</span>
              <div className="bg-slate-50 rounded-md border border-slate-200 p-3">
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{detalleActual.content}</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Vista lista */
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="px-4 py-6 text-center text-sm text-slate-400">
              Cargando notificaciones...
            </div>
          )}
          {loadingDetalle && (
            <div className="px-4 py-6 text-center text-sm text-slate-400">
              Cargando detalle...
            </div>
          )}
          {error && (
            <div className="px-4 py-4 text-sm text-red-500">{error}</div>
          )}
          {!loading && !error && notificaciones.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-slate-400">
              No hay notificaciones
            </div>
          )}
          {!loading && notificaciones.map((n) => (
            <NotificationItem
              key={n.id}
              notif={n}
              onClick={() => fetchDetalle(n.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

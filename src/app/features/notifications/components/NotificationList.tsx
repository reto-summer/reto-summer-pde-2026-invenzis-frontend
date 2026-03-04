import { forwardRef } from "react";
import type { UIEvent } from "react";
import type { NotificacionResumen } from "../../../../api";
import { NotificationItem } from "./NotificationItem";

interface NotificationListProps {
  loading: boolean;
  loadingDetalle: boolean;
  error: string | null;
  visibleNotificaciones: NotificacionResumen[];
  notificaciones: NotificacionResumen[];
  hasMore: boolean;
  onScroll: (e: UIEvent<HTMLDivElement>) => void;
  onItemClick: (id: number) => void;
  isRead: (id: number) => boolean;
}

const INITIAL_COUNT = 20;

export const NotificationList = forwardRef<
  HTMLDivElement,
  NotificationListProps
>(function NotificationList(
  {
    loading,
    loadingDetalle,
    error,
    visibleNotificaciones,
    notificaciones,
    hasMore,
    onScroll,
    onItemClick,
    isRead,
  },
  ref,
) {
  return (
    <div
      ref={ref}
      className="flex-1 overflow-y-auto overscroll-contain"
      onScroll={onScroll}
    >
      {loading && (
        <div className="px-4 py-8 text-center text-sm text-slate-400">
          Cargando notificaciones...
        </div>
      )}
      {loadingDetalle && (
        <div className="px-4 py-8 text-center text-sm text-slate-400">
          Cargando detalle...
        </div>
      )}
      {error && <div className="px-4 py-4 text-sm text-red-500">{error}</div>}
      {!loading && !error && notificaciones.length === 0 && (
        <div className="px-4 py-10 text-center text-sm text-slate-400">
          No hay notificaciones de la ultima semana
        </div>
      )}
      {!loading &&
        visibleNotificaciones.map((n) => (
          <NotificationItem
            key={n.id}
            notif={n}
            read={isRead(n.id)}
            onClick={() => onItemClick(n.id)}
          />
        ))}
      {!loading && hasMore && (
        <div className="px-4 py-3 text-center text-xs text-slate-400">
          Scroll para ver más notificaciones
        </div>
      )}
      {!loading && !hasMore && notificaciones.length > INITIAL_COUNT && (
        <div className="px-4 py-3 text-center text-xs text-slate-300">
          No hay más notificaciones
        </div>
      )}
    </div>
  );
});

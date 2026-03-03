import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  type UIEvent,
} from "react";
import type { UseNotificacionesResult } from "../hooks/useNotificaciones";
import { NotificationHeader } from "./NotificationHeader";
import { NotificationDetail } from "./NotificationDetail";
import { NotificationList } from "./NotificationList";

const INITIAL_COUNT = 20;
const LOAD_MORE_COUNT = 10;

interface NotificationPanelProps {
  hook: UseNotificacionesResult;
  onClose: () => void;
}

export function NotificationPanel({ hook, onClose }: NotificationPanelProps) {
  const {
    notificaciones,
    detalleActual,
    loading,
    loadingDetalle,
    error,
    unreadCount,
    isRead,
    markAllAsRead,
    fetchDetalle,
    clearDetalle,
  } = hook;

  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const hasInitialized = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);

  // Al cargar por primera vez, mostrar al menos las notificaciones nuevas
  useEffect(() => {
    if (!loading && notificaciones.length > 0 && !hasInitialized.current) {
      hasInitialized.current = true;
      setVisibleCount(Math.max(INITIAL_COUNT, unreadCount));
    }
  }, [loading, notificaciones.length, unreadCount]);

  const handleScroll = useCallback(
    (e: UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      if (nearBottom) {
        setVisibleCount((prev) =>
          Math.min(prev + LOAD_MORE_COUNT, notificaciones.length),
        );
      }
    },
    [notificaciones.length],
  );

  // Unread primero (fecha desc), luego leídas (fecha desc)
  const sortedNotificaciones = useMemo(() => {
    return [...notificaciones].sort((a, b) => {
      const aRead = isRead(a.id);
      const bRead = isRead(b.id);
      if (aRead !== bRead) return aRead ? 1 : -1;
      return (
        new Date(b.executionDate).getTime() -
        new Date(a.executionDate).getTime()
      );
    });
  }, [notificaciones, isRead]);

  const visibleNotificaciones = sortedNotificaciones.slice(0, visibleCount);
  const hasMore = visibleCount < sortedNotificaciones.length;

  return (
    <div
      className="absolute right-0 top-full mt-2 w-[400px] bg-white rounded-lg shadow-xl border border-slate-200 z-50 flex flex-col"
      style={{ maxHeight: "min(520px, 80vh)" }}
    >
      <NotificationHeader
        unreadCount={unreadCount}
        onMarkAllAsRead={markAllAsRead}
        onClose={onClose}
      />

      {detalleActual ? (
        <NotificationDetail detail={detalleActual} onBack={clearDetalle} />
      ) : (
        <NotificationList
          ref={listRef}
          loading={loading}
          loadingDetalle={loadingDetalle}
          error={error}
          visibleNotificaciones={visibleNotificaciones}
          notificaciones={notificaciones}
          hasMore={hasMore}
          onScroll={handleScroll}
          onItemClick={fetchDetalle}
          isRead={isRead}
        />
      )}
    </div>
  );
}

/**
 * Hook useNotificaciones — Lista, detalle y estado leído/no-leído de notificaciones.
 *
 * El estado de lectura se persiste en `localStorage` bajo la clave
 * `"notificaciones_leidas"` (array de IDs numéricos), de modo que sobrevive
 * recargas de página sin necesidad de un endpoint de backend.
 */

import { useState, useEffect, useCallback } from "react";
import {
  getNotificaciones,
  getNotificacion,
  type NotificacionResumen,
  type NotificacionDetalle,
} from "../../../../api";

const LS_KEY = "notificaciones_leidas";

/** Lee el set de IDs leídos desde `localStorage`. Devuelve un `Set` vacío ante cualquier error. */
function loadReadIds(): Set<number> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as number[]);
  } catch {
    return new Set();
  }
}

/** Persiste el set de IDs leídos en `localStorage`. */
function saveReadIds(ids: Set<number>): void {
  localStorage.setItem(LS_KEY, JSON.stringify([...ids]));
}

/** Resultado expuesto por `useNotificaciones`. */
export interface UseNotificacionesResult {
  /** Lista de resúmenes de notificaciones cargadas. */
  notificaciones: NotificacionResumen[];
  /** Detalle de la notificación actualmente seleccionada, o `null` si ninguna. */
  detalleActual: NotificacionDetalle | null;
  /** `true` mientras se carga la lista principal. */
  loading: boolean;
  /** `true` mientras se carga el detalle de una notificación. */
  loadingDetalle: boolean;
  /** Mensaje de error user-friendly, o `null` si no hay error. */
  error: string | null;
  /** Cantidad de notificaciones no leídas. */
  unreadCount: number;
  /** Devuelve `true` si la notificación con el `id` dado fue leída. */
  isRead: (id: number) => boolean;
  /** Marca una notificación como leída y persiste el cambio. */
  markAsRead: (id: number) => void;
  /** Marca todas las notificaciones cargadas como leídas. */
  markAllAsRead: () => void;
  /**
   * Carga el detalle de una notificación y la marca como leída automáticamente.
   * @param id - ID de la notificación a abrir.
   */
  fetchDetalle: (id: number) => Promise<void>;
  /** Cierra la vista de detalle limpiando `detalleActual`. */
  clearDetalle: () => void;
  /** Recarga manualmente la lista de notificaciones. */
  refetch: () => Promise<void>;
}

/**
 * Hook para gestionar el panel de notificaciones: lista, detalle y lectura.
 *
 * @returns `UseNotificacionesResult` con todo el estado y las acciones disponibles.
 */
export function useNotificaciones(): UseNotificacionesResult {
  const [notificaciones, setNotificaciones] = useState<NotificacionResumen[]>(
    [],
  );
  const [detalleActual, setDetalleActual] =
    useState<NotificacionDetalle | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<number>>(() => loadReadIds());

  const fetchNotificaciones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNotificaciones();
      setNotificaciones(data);
    } catch (e) {
      console.error("fetchNotificaciones:", e);
      setError("No se pudieron cargar las notificaciones. Intenta de nuevo.");
      setNotificaciones([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotificaciones();
  }, [fetchNotificaciones]);

  const markAsRead = useCallback((id: number) => {
    setReadIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveReadIds(next);
      return next;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setReadIds((prev) => {
      const next = new Set(prev);
      notificaciones.forEach((n) => next.add(n.id));
      saveReadIds(next);
      return next;
    });
  }, [notificaciones]);

  const isRead = useCallback((id: number) => readIds.has(id), [readIds]);

  const unreadCount = notificaciones.filter((n) => !readIds.has(n.id)).length;

  const fetchDetalle = useCallback(
    async (id: number) => {
      markAsRead(id);
      setLoadingDetalle(true);
      setError(null);
      try {
        const data = await getNotificacion(id);
        setDetalleActual(data);
      } catch (e) {
        console.error("fetchDetalle:", e);
        setError(
          "No se pudo cargar el detalle de la notificación. Intenta de nuevo.",
        );
      } finally {
        setLoadingDetalle(false);
      }
    },
    [markAsRead],
  );

  const clearDetalle = useCallback(() => {
    setDetalleActual(null);
  }, []);

  return {
    notificaciones,
    detalleActual,
    loading,
    loadingDetalle,
    error,
    unreadCount,
    isRead,
    markAsRead,
    markAllAsRead,
    fetchDetalle,
    clearDetalle,
    refetch: fetchNotificaciones,
  };
}

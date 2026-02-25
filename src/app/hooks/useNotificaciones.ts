/**
 * Hook useNotificaciones — lista, detalle, y leido/no-leido via localStorage.
 */

import { useState, useEffect, useCallback } from "react";
import { getNotificaciones, getNotificacion } from "../../api/notificaciones";
import type { NotificacionResumen, NotificacionDetalle } from "../../api/types";

const LS_KEY = "notificaciones_leidas";

function loadReadIds(): Set<number> {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as number[]);
  } catch {
    return new Set();
  }
}

function saveReadIds(ids: Set<number>): void {
  localStorage.setItem(LS_KEY, JSON.stringify([...ids]));
}

export interface UseNotificacionesResult {
  notificaciones: NotificacionResumen[];
  detalleActual: NotificacionDetalle | null;
  loading: boolean;
  loadingDetalle: boolean;
  error: string | null;
  unreadCount: number;
  isRead: (id: number) => boolean;
  markAsRead: (id: number) => void;
  fetchDetalle: (id: number) => Promise<void>;
  clearDetalle: () => void;
  refetch: () => Promise<void>;
}

export function useNotificaciones(): UseNotificacionesResult {
  const [notificaciones, setNotificaciones] = useState<NotificacionResumen[]>([]);
  const [detalleActual, setDetalleActual] = useState<NotificacionDetalle | null>(null);
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
      setError(e instanceof Error ? e.message : "Error al cargar notificaciones");
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

  const isRead = useCallback((id: number) => readIds.has(id), [readIds]);

  const unreadCount = notificaciones.filter((n) => !readIds.has(n.id)).length;

  const fetchDetalle = useCallback(async (id: number) => {
    markAsRead(id);
    setLoadingDetalle(true);
    setError(null);
    try {
      const data = await getNotificacion(id);
      setDetalleActual(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar notificacion");
    } finally {
      setLoadingDetalle(false);
    }
  }, [markAsRead]);

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
    fetchDetalle,
    clearDetalle,
    refetch: fetchNotificaciones,
  };
}

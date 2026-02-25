/**
 * Hook useNotificaciones — GET /notificacion, GET /notificacion/{id}
 */

import { useState, useEffect, useCallback } from "react";
import { getNotificaciones, getNotificacion } from "../../api/notificaciones";
import type { NotificacionResumen, NotificacionDetalle } from "../../api/types";

export interface UseNotificacionesResult {
  notificaciones: NotificacionResumen[];
  detalleActual: NotificacionDetalle | null;
  loading: boolean;
  loadingDetalle: boolean;
  error: string | null;
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

  const fetchDetalle = useCallback(async (id: number) => {
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
  }, []);

  const clearDetalle = useCallback(() => {
    setDetalleActual(null);
  }, []);

  return {
    notificaciones,
    detalleActual,
    loading,
    loadingDetalle,
    error,
    fetchDetalle,
    clearDetalle,
    refetch: fetchNotificaciones,
  };
}

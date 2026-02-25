/**
 * Servicio Notificaciones. GET /notificacion — GET /notificacion/{id}
 * Incluye query param fecha_ejecucion (ISO string) para filtrar por rango de fechas.
 */

import { api } from "./client";
import type { NotificacionResumen, NotificacionDetalle } from "./types";

const NOTIFICACIONES_PATH = "/notificacion";

function getLastWeekISO(): string {
  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
}

export async function getNotificaciones(fechaEjecucion?: string): Promise<NotificacionResumen[]> {
  const fecha = fechaEjecucion ?? getLastWeekISO();
  const data = await api.get<NotificacionResumen[]>(NOTIFICACIONES_PATH, {
    params: { fechaEjecucion: fecha },
  });
  return Array.isArray(data) ? data : [];
}

export async function getNotificacion(id: number): Promise<NotificacionDetalle> {
  return api.get<NotificacionDetalle>(`${NOTIFICACIONES_PATH}/${id}`);
}

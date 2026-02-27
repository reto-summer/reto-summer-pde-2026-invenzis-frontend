/**
 * Servicio Notificaciones. GET /notificacion — GET /notificacion/{id}
 * Incluye query param fecha_ejecucion (ISO string) para filtrar por rango de fechas.
 */

import { api } from "./client";
import type {
  NotificacionResumen,
  NotificacionDetalle,
  NotificacionBackendResumen,
  NotificacionBackendDetalle,
} from "./types";

const NOTIFICACIONES_PATH = "/notificacion";

function getLastWeekISO(): string {
  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
}

export async function getNotificaciones(fechaEjecucion?: string): Promise<NotificacionResumen[]> {
  const fecha = fechaEjecucion ?? getLastWeekISO();
  console.log("🔔 getNotificaciones - fecha filtro:", fecha);
  const data = await api.get<NotificacionBackendResumen[]>(NOTIFICACIONES_PATH, {
    params: { fechaEjecucion: fecha },
  });
  console.log("🔔 getNotificaciones - respuesta:", data);
  console.log("🔔 getNotificaciones - cantidad:", Array.isArray(data) ? data.length : "NO ES ARRAY");
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    id: item.id,
    title: item.titulo ?? "",
    success: item.exito ?? false,
    executionDate: item.fechaEjecucion ?? "",
  }));
}

export async function getNotificacion(id: number): Promise<NotificacionDetalle> {
  const data = await api.get<NotificacionBackendDetalle>(`${NOTIFICACIONES_PATH}/${id}`);
  const result = {
    id: data.id,
    title: data.titulo ?? "",
    success: data.exito ?? false,
    executionDate: data.fechaEjecucion ?? "",
    detail: data.detalle ?? null,
    content: data.contenido ?? null,
  };
  console.log("🔔 getNotificacion - mapped result:", result);
  return result;
}

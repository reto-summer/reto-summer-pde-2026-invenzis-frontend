/**
 * Servicio de notificaciones del sistema.
 * Endpoints: GET /notificacion — GET /notificacion/{id}
 *
 * Las respuestas del backend usan nombres en español (titulo, exito, fechaEjecucion)
 * y se mapean al modelo normalizado en inglés (title, success, executionDate) antes
 * de ser expuestas a la UI.
 */

import { api } from "./client";
import type {
  NotificacionResumen,
  NotificacionDetalle,
  NotificacionBackendResumen,
  NotificacionBackendDetalle,
} from "./types";

const NOTIFICACIONES_PATH = "/notificacion";

/** Devuelve el ISO string de hace 7 días, usado como valor por defecto de `fechaEjecucion`. */
function getLastWeekISO(): string {
  return new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
}

/**
 * Obtiene el listado de notificaciones del sistema (resumen sin detalle completo).
 * Por defecto filtra las de la última semana mediante el query param `fechaEjecucion`.
 *
 * @param fechaEjecucion - ISO string de fecha límite inferior. Omitir usa la última semana.
 * @returns Array de `NotificacionResumen` ordenados por el backend.
 */
export async function getNotificaciones(fechaEjecucion?: string): Promise<NotificacionResumen[]> {
  const fecha = fechaEjecucion ?? getLastWeekISO();
  const data = await api.get<NotificacionBackendResumen[]>(NOTIFICACIONES_PATH, {
    params: { fechaEjecucion: fecha },
  });
  if (!Array.isArray(data)) return [];
  return data.map((item) => ({
    id: item.id,
    title: item.titulo ?? "",
    success: item.exito ?? false,
    executionDate: item.fechaEjecucion ?? "",
  }));
}

/**
 * Obtiene el detalle completo de una notificación por su ID.
 *
 * @param id - Identificador numérico de la notificación.
 * @returns `NotificacionDetalle` con todos los campos, incluyendo `detail` y `content`.
 */
export async function getNotificacion(id: number): Promise<NotificacionDetalle> {
  const data = await api.get<NotificacionBackendDetalle>(`${NOTIFICACIONES_PATH}/${id}`);
  return {
    id: data.id,
    title: data.titulo ?? "",
    success: data.exito ?? false,
    executionDate: data.fechaEjecucion ?? "",
    detail: data.detalle ?? null,
    content: data.contenido ?? null,
  };
}

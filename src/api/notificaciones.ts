/**
 * Servicio Notificaciones. GET /notificacion — GET /notificacion/{id}
 */

import { api } from "./client";
import type { NotificacionResumen, NotificacionDetalle } from "./types";

const NOTIFICACIONES_PATH = "/notificacion";

export async function getNotificaciones(): Promise<NotificacionResumen[]> {
  const data = await api.get<NotificacionResumen[]>(NOTIFICACIONES_PATH);
  return Array.isArray(data) ? data : [];
}

export async function getNotificacion(id: number): Promise<NotificacionDetalle> {
  return api.get<NotificacionDetalle>(`${NOTIFICACIONES_PATH}/${id}`);
}

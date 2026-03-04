/**
 * Punto de entrada público de la capa API.
 * Todos los consumidores (hooks, context, componentes) deben importar desde "@/api"
 * en lugar de acceder directamente a los módulos internos.
 */

export { api, BASE_URL, type RequestConfig } from "./client";

export type {
  Familia,
  Subfamilia,
  EmailConfig,
  NotificacionResumen,
  NotificacionDetalle,
  LicitacionBackendResponse,
} from "./types";

export { getFamilias, getSubfamiliasPorFamilia } from "./familias";
export { getEmailConfig, postEmailConfig, deleteEmailConfig } from "./emailConfig";
export { getNotificaciones, getNotificacion } from "./notificaciones";
export { getLicitaciones, type LicitacionesQuery } from "./licitaciones";
export { getConfig, putConfig, type FamiliaConfig } from "./config";

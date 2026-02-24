/**
 * API: cliente, tipos y servicios. Importar desde "@/api" o "@/api/familias", etc.
 */

export { api, BASE_URL, type RequestConfig } from "./client";
export type { Familia, Subfamilia, EmailConfig } from "./types";
export { getFamilias, getSubfamiliasPorFamilia } from "./familias";
export { getEmailConfig, postEmailConfig, deleteEmailConfig } from "./emailConfig";

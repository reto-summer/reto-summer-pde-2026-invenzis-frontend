/**
 * Servicio de configuración de emails de notificación.
 * Endpoints: GET /email — POST /email — DELETE /email/{direccion}
 */

import { api } from "./client";
import type { EmailConfig } from "./types";

const EMAIL_PATH = "/email";

/**
 * Obtiene la lista de emails registrados para notificaciones.
 * El backend devuelve un array de strings; este servicio los normaliza a `EmailConfig[]`.
 *
 * @returns Array de `EmailConfig` con las direcciones registradas (puede ser vacío).
 */
export async function getEmailConfig(): Promise<EmailConfig[]> {
  const data = await api.get<string[]>(EMAIL_PATH);
  return (data ?? []).map((direccion) => ({ direccion }));
}

/**
 * Registra una nueva dirección de email para recibir notificaciones.
 *
 * @param email - Objeto con la dirección a registrar.
 * @returns El `EmailConfig` creado por el backend.
 */
export async function postEmailConfig(email: EmailConfig): Promise<EmailConfig> {
  return api.post<EmailConfig>(EMAIL_PATH, { email: email.direccion });
}

/**
 * Elimina una dirección de email de la lista de notificaciones.
 *
 * @param direccion - Dirección de email a eliminar. Se codifica en la URL.
 */
export async function deleteEmailConfig(direccion: string): Promise<void> {
  return api.delete<void>(`${EMAIL_PATH}/${encodeURIComponent(direccion)}`);
}

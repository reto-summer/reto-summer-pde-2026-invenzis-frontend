/**
 * Servicio Email Config. GET /config/email — POST /config/email — DELETE /config/email?direccion=...
 */

import { api } from "./client";
import type { EmailConfig } from "./types";

const EMAIL_CONFIG_PATH = "/config/email";

export async function getEmailConfig(): Promise<EmailConfig[]> {
  const data = await api.get<EmailConfig[]>(EMAIL_CONFIG_PATH);
  return Array.isArray(data) ? data : [];
}

export async function postEmailConfig(email: EmailConfig): Promise<EmailConfig> {
  return api.post<EmailConfig>(EMAIL_CONFIG_PATH, email);
}

export async function deleteEmailConfig(direccion: string): Promise<void> {
  return api.delete<void>(EMAIL_CONFIG_PATH, { params: { direccion } });
}

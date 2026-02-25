/**
 * Servicio Email Config. GET /mail — POST /mail/save — DELETE /mail/delete?direccion=...
 */

import { api } from "./client";
import type { EmailConfig } from "./types";

const EMAIL_PATH = "/mail";

export async function getEmailConfig(): Promise<EmailConfig[]> {
  const data = await api.get<{ emails: string[] }>(EMAIL_PATH);
  return (data?.emails ?? []).map((direccion) => ({ direccion }));
}

export async function postEmailConfig(email: EmailConfig): Promise<EmailConfig> {
  return api.post<EmailConfig>(`${EMAIL_PATH}/save`, email);
}

export async function deleteEmailConfig(direccion: string): Promise<void> {
  return api.delete<void>(`${EMAIL_PATH}/delete`, { params: { direccion } });
}

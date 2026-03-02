/**
 * Servicio Email Config. GET /email — POST /email — DELETE /email/{emailAddress}
 */

import { api } from "./client";
import type { EmailConfig } from "./types";

const EMAIL_PATH = "/email";

export async function getEmailConfig(): Promise<EmailConfig[]> {
  const data = await api.get<string[]>(EMAIL_PATH);
  return (data ?? []).map((direccion) => ({ direccion }));
}

export async function postEmailConfig(email: EmailConfig): Promise<EmailConfig> {
  return api.post<EmailConfig>(EMAIL_PATH, { email: email.direccion });
}

export async function deleteEmailConfig(direccion: string): Promise<void> {
  return api.delete<void>(`${EMAIL_PATH}/${encodeURIComponent(direccion)}`);
}

/**
 * Servicio Config. GET /config — POST /config
 * Persiste la selección de familia/subfamilia del usuario.
 */

import { api } from "./client";

export interface FamiliaConfig {
  familiaCod: number | null;
  subfamiliaCod: number | null;
}

const CONFIG_PATH = "/config";

export async function getConfig(): Promise<FamiliaConfig> {
  const data = await api.get<FamiliaConfig>(CONFIG_PATH);
  return data ?? { familiaCod: null, subfamiliaCod: null };
}

export async function postConfig(config: FamiliaConfig): Promise<void> {
  await api.post<void>(CONFIG_PATH, config);
}

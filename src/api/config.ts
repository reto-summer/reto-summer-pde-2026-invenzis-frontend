/**
 * Servicio Config. GET /config — PUT /config
 * Persiste la selección de familia/subfamilia del usuario.
 */

import { api } from "./client";

export interface FamiliaConfig {
  familiaCod: number | null;
  subfamiliaCod: number | null;
}

interface ConfigResponse {
  id: number;
  familia: { cod: number; descripcion: string } | null;
  subfamilia: { famiCod: number; cod: number; descripcion: string } | null;
}

const CONFIG_PATH = "/config";

export async function getConfig(): Promise<FamiliaConfig> {
  const data = await api.get<ConfigResponse>(CONFIG_PATH);
  if (!data) return { familiaCod: null, subfamiliaCod: null };
  return {
    familiaCod: data.familia?.cod ?? null,
    subfamiliaCod: data.subfamilia?.cod ?? null,
  };
}

export async function putConfig(config: FamiliaConfig): Promise<void> {
  await api.put<void>(CONFIG_PATH, config);
}

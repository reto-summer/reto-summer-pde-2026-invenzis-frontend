/**
 * Servicio de configuración del usuario.
 * Endpoints: GET /config — PUT /config
 *
 * Persiste la selección de familia/subfamilia del usuario en el backend,
 * de modo que se restaure automáticamente en la próxima sesión.
 */

import { api } from "./client";

/** Selección de familia y subfamilia guardada por el usuario. */
export interface FamiliaConfig {
  /** Código de la familia seleccionada. `null` si no hay ninguna. */
  familiaCod: number | null;
  /** Código de la subfamilia seleccionada. `null` si no hay ninguna. */
  subfamiliaCod: number | null;
}

/** Shape crudo de la respuesta del backend en GET /config. @internal */
interface ConfigResponse {
  id: number;
  familia: { cod: number; descripcion: string } | null;
  subfamilia: { famiCod: number; cod: number; descripcion: string } | null;
}

const CONFIG_PATH = "/config";

/**
 * Obtiene la configuración guardada del usuario.
 * Si no existe configuración, devuelve ambos campos como `null`.
 *
 * @returns `FamiliaConfig` con los códigos de familia y subfamilia seleccionados.
 */
export async function getConfig(): Promise<FamiliaConfig> {
  const data = await api.get<ConfigResponse>(CONFIG_PATH);
  if (!data) return { familiaCod: null, subfamiliaCod: null };
  return {
    familiaCod: data.familia?.cod ?? null,
    subfamiliaCod: data.subfamilia?.cod ?? null,
  };
}

/**
 * Persiste la selección de familia y subfamilia del usuario en el backend.
 *
 * @param config - Nueva configuración a guardar.
 */
export async function putConfig(config: FamiliaConfig): Promise<void> {
  await api.put<void>(CONFIG_PATH, config);
}

/**
 * Servicio de familias y subfamilias de licitaciones.
 * Endpoints: GET /familias — GET /subfamilias/familia/{famiCod}
 */

import { api } from "./client";
import type { Familia, Subfamilia } from "./types";

const FAMILIAS_PATH = "/familias";
const SUBFAMILIAS_PATH = "/subfamilias";

/**
 * Obtiene la lista completa de familias disponibles.
 *
 * @returns Array de `Familia`. Si la respuesta no es un array, devuelve `[]`.
 */
export async function getFamilias(): Promise<Familia[]> {
  const data = await api.get<Familia[]>(FAMILIAS_PATH);
  return Array.isArray(data) ? data : [];
}

/**
 * Obtiene las subfamilias que pertenecen a una familia específica.
 *
 * @param famiCod - Código de la familia padre (como string, se encoda en la URL).
 * @returns Array de `Subfamilia`. Devuelve `[]` si el código está vacío o la respuesta no es un array.
 */
export async function getSubfamiliasPorFamilia(famiCod: string): Promise<Subfamilia[]> {
  if (!famiCod) return [];
  const path = `${SUBFAMILIAS_PATH}/familia/${encodeURIComponent(famiCod)}`;
  const data = await api.get<Subfamilia[]>(path);
  return Array.isArray(data) ? data : [];
}

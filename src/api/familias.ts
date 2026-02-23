/**
 * Servicio Familia y Subfamilia. GET /familias — GET /subfamilias/familia/{fami_cod}
 */

import { api } from "./client";
import type { Familia, Subfamilia } from "./types";

const FAMILIAS_PATH = "/familias";
const SUBFAMILIAS_PATH = "/subfamilias";

export async function getFamilias(): Promise<Familia[]> {
  const data = await api.get<Familia[]>(FAMILIAS_PATH);
  return Array.isArray(data) ? data : [];
}

export async function getSubfamiliasPorFamilia(famiCod: string): Promise<Subfamilia[]> {
  if (!famiCod) return [];
  const path = `${SUBFAMILIAS_PATH}/familia/${encodeURIComponent(famiCod)}`;
  const data = await api.get<Subfamilia[]>(path);
  return Array.isArray(data) ? data : [];
}

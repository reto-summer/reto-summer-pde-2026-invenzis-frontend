import { api } from "./client";
import type { Bid, BidFamilia, BidSubfamilia } from "../app/features/bids/types/Bid";
import type { LicitacionBackendResponse } from "./types";

/**
 * Query params aceptados por GET /licitaciones.
 * Todos los campos son opcionales; los campos ausentes no se envían como query params.
 */
export interface LicitacionesQuery {
  [key: string]: string | number | undefined;
  familiaCod?: number;
  subfamiliaCod?: number;
  fechaPublicacionDesde?: string;
  fechaPublicacionHasta?: string;
  fechaCierreDesde?: string;
  fechaCierreHasta?: string;
}

/** Mapea la respuesta del backend al modelo interno `Bid`. */
function mapBackendToBid(response: LicitacionBackendResponse): Bid {
  return {
    id_licitacion: response.idLicitacion,
    title: response.titulo ?? "",
    description: response.descripcion ?? "",
    tipoLicitacion: response.tipoLicitacion,
    fecha_publicacion: response.fechaPublicacion ?? "",
    fecha_cierre: response.fechaCierre ?? "",
    link: response.link ?? "",
    familia: {
      id_familia: response.familia?.cod ?? 0,
      nombre: response.familia?.descripcion ?? "",
    } satisfies BidFamilia,
    subfamilia: {
      id_subfamilia: response.subfamilia?.cod ?? 0,
      nombre: response.subfamilia?.descripcion ?? "",
      id_familia: response.subfamilia?.famiCod ?? 0,
    } satisfies BidSubfamilia,
  };
}

/**
 * GET /licitaciones — Devuelve la lista de licitaciones filtrada por los query params provistos.
 * Admite tanto un array directo como `{ licitaciones: [] }` como formato de respuesta.
 * @param query - Parámetros opcionales de filtrado (familiaCod, subfamiliaCod, fechas).
 */
export async function getLicitaciones(
  query: LicitacionesQuery = {},
): Promise<Bid[]> {
  const response = await api.get<
    LicitacionBackendResponse[] | { licitaciones: LicitacionBackendResponse[] }
  >("/licitaciones", { params: query });
  if (!response) return [];
  const items = Array.isArray(response)
    ? response
    : (response.licitaciones ?? []);
  return items.map(mapBackendToBid);
}

import { api } from "./client";
import type { Bid } from "../app/types/Bid";
import type { FiltersState } from "../app/types/filters";
import type { LicitacionBackendResponse } from "./types";

/**
 * Query params según contrato V1.1 para GET /licitaciones.
 * familiaCod/subfamiliaCod: int
 * fechaPublicacionDesde/Hasta: YYYY-MM-DD
 * fechaCierreDesde/Hasta: YYYY-MM-DDTHH:MM:SS
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

/**
 * Query params temporales (get/all) — familia y subfamilia sin renombrar.
 * @deprecated Usar LicitacionesQuery con familiaCod/subfamiliaCod según contrato V1.1.
 */
export interface LicitacionesQueryAll {
    [key: string]: string | number | undefined;
    familia?: number;
    subfamilia?: number;
}

/**
 * Convierte el estado de filtros UI a query para la API.
 */
export function filtersToQuery(filters: Partial<FiltersState>): LicitacionesQuery {
    const query: LicitacionesQuery = {};
    if (filters.familia && filters.familia > 0) query.familiaCod = filters.familia;
    if (filters.subfamilia && filters.subfamilia > 0) query.subfamiliaCod = filters.subfamilia;
    return query;
}

function mapBackendToBid(response: LicitacionBackendResponse): Bid {
    return {
        id_licitacion: response.idLicitacion,
        title: response.titulo ?? "",
        description: response.descripcion ?? "",
        fecha_publicacion: response.fechaPublicacion ?? "",
        fecha_cierre: response.fechaCierre ?? "",
        link: response.link ?? "",
        familia: {
            id_familia: response.familia?.cod ?? 0,
            nombre: response.familia?.descripcion ?? "",
        },
        subfamilia: {
            id_subfamilia: response.subfamilia?.cod ?? 0,
            nombre: response.subfamilia?.descripcion ?? "",
            id_familia: response.subfamilia?.famiCod ?? 0,
        },
    };
}

/**
 * GET /licitaciones — Temporal (get/all). Respuesta como array directo.
 * @deprecated Reemplazar por getLicitaciones() cuando el backend esté alineado con contrato V1.1.
 */
export async function getLicitacionesTodas(query: LicitacionesQueryAll = {}): Promise<Bid[]> {
    const response = await api.get<LicitacionBackendResponse[]>("/licitaciones", { params: query });
    return response.map(mapBackendToBid);
}

/**
 * GET /licitaciones — Según contrato V1.1.
 * Filtros: familiaCod, subfamiliaCod, fechaPublicacionDesde/Hasta, fechaCierreDesde/Hasta.
 * Respuesta: { licitaciones: Licitacion[] }
 */
export async function getLicitaciones(query: LicitacionesQuery = {}): Promise<Bid[]> {
    const response = await api.get<{ licitaciones: LicitacionBackendResponse[] }>("/licitaciones", { params: query });
    return (response?.licitaciones ?? []).map(mapBackendToBid);
}

/**
 * GET /licitaciones/:id_licitacion — Detalle
 */
export async function getLicitacionById(id_licitacion: number): Promise<Bid> {
    const response = await api.get<LicitacionBackendResponse>(`/licitaciones/${id_licitacion}`);
    return mapBackendToBid(response);
}

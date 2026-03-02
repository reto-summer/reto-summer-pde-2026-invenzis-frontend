import { api } from "./client";
import type { Bid } from "../app/types/Bid";
import type { FiltersState } from "../app/types/filters";
import type { LicitacionBackendResponse } from "./types";

/**
 * Query params para GET /licitaciones.
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
        tipoLicitacion: response.tipoLicitacion,
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
 * GET /licitaciones
 * Soporta respuesta como array directo o como { licitaciones: [] }.
 */
export async function getLicitaciones(query: LicitacionesQuery = {}): Promise<Bid[]> {
    const response = await api.get<LicitacionBackendResponse[] | { licitaciones: LicitacionBackendResponse[] }>("/licitaciones", { params: query });
    if (!response) return [];
    const items = Array.isArray(response) ? response : (response.licitaciones ?? []);
    return items.map(mapBackendToBid);
}

/**
 * GET /licitaciones/:id_licitacion — Detalle
 */
export async function getLicitacionById(id_licitacion: number): Promise<Bid> {
    const response = await api.get<LicitacionBackendResponse>(`/licitaciones/${id_licitacion}`);
    return mapBackendToBid(response);
}

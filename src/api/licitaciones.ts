import { api } from "./client";
import type { Bid } from "../app/types/Bid";
import type { FiltersState } from "../app/types/filters";
import type { LicitacionBackendResponse } from "./types";

/**
 * Query para GET /licitaciones. Solo se envían los filtros activos.
 * familia y subfamilia son requeridos según la especificación.
 * clase, subclase, fecha_publicacion y fecha_cierre son opcionales.
 * fecha_publicacion: YYYY-MM-DD
 * fecha_cierre: YYYY-MM-DDTHH:MM:SS
 */
export interface LicitacionesQuery {
    [key: string]: string | number | undefined;
    familia?: number;
    subfamilia?: number;
    fecha_publicacion?: string;
    fecha_cierre?: string;
}

/**
 * Convierte el estado de filtros UI a query para la API.
 */
export function filtersToQuery(filters: Partial<FiltersState>): LicitacionesQuery {
    const query: LicitacionesQuery = {};
    if (filters.familia && filters.familia > 0) query.familia = filters.familia;
    if (filters.subfamilia && filters.subfamilia > 0) query.subfamilia = filters.subfamilia;
    return query;
}

function mapBackendToBid(response: LicitacionBackendResponse): Bid {
    return {
        id_licitacion: response.idLicitacion,
        title: response.titulo ?? "",
        description: response.descripcion ?? "",
        fecha_publicacion: response.fecha_publicacion ?? "",
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
 * GET /licitaciones — Lista filtrada
 */
export async function getLicitaciones(query: LicitacionesQuery = {}): Promise<Bid[]> {
    const response = await api.get<LicitacionBackendResponse[]>("/licitaciones", { params: query });
    return response.map(mapBackendToBid);
}

/**
 * GET /licitaciones/:id_licitacion — Detalle
 */
export async function getLicitacionById(id_licitacion: number): Promise<Bid> {
    const response = await api.get<LicitacionBackendResponse>(`/licitaciones/${id_licitacion}`);
    return mapBackendToBid(response);
}

/**
 * GET /licitaciones/titulo/:titulo — Buscar por título exacto
 */
export async function getLicitacionesByTitulo(titulo: string): Promise<Bid[]> {
    const response = await api.get<LicitacionBackendResponse[]>(`/licitaciones/titulo/${encodeURIComponent(titulo)}`);
    return response.map(mapBackendToBid);
}

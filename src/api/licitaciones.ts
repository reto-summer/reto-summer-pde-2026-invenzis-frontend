import { api } from "./client";
import type { Bid } from "../app/types/Bid";
import type { FiltersState } from "../app/types/filters";

/**
 * Query para GET /licitaciones. Solo se envían los filtros activos.
 * fecha_publicacion: YYYY-MM-DD
 * fecha_cierre: YYYY-MM-DDTHH:MM:SS
 */
export interface LicitacionesQuery {
    [key: string]: string | number | undefined;
    familia?: number;
    subfamilia?: number;
    clase?: number;
    subclase?: number;
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

/**
 * GET /licitaciones — Lista filtrada
 */
export async function getLicitaciones(query: LicitacionesQuery = {}): Promise<Bid[]> {
    return api.get<Bid[]>("/licitaciones", { params: query });
}

/**
 * GET /licitaciones/:id_licitacion — Detalle
 */
export async function getLicitacionById(id_licitacion: number): Promise<Bid> {
    return api.get<Bid>(`/licitaciones/${id_licitacion}`);
}

/**
 * GET /licitaciones/titulo/:titulo — Buscar por título exacto
 */
export async function getLicitacionesByTitulo(titulo: string): Promise<Bid[]> {
    return api.get<Bid[]>(`/licitaciones/titulo/${encodeURIComponent(titulo)}`);
}

import { api } from "./client";
import type { Bid } from "../app/types/Bid";
import type { FiltersState } from "../app/types/filters";
import type { LicitacionBackendResponse } from "./types";

/**
 * Query para GET /licitaciones (uso temporal — get/all).
 * familia y subfamilia como query params mientras el backend no tenga el path del contrato.
 */
export interface LicitacionesQuery {
    [key: string]: string | number | undefined;
    familia?: number;
    subfamilia?: number;
}

/**
 * Query params opcionales según contrato para GET /licitaciones/familia/{cod}/subfamilia/{cod}.
 * fechaPublicacionDesde/Hasta: YYYY-MM-DD
 * fechaCierreDesde/Hasta: YYYY-MM-DDTHH:MM:SS
 */
export interface LicitacionesPorFamiliaQuery {
    [key: string]: string | undefined;
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
    if (filters.familia && filters.familia > 0) query.familia = filters.familia;
    if (filters.subfamilia && filters.subfamilia > 0) query.subfamilia = filters.subfamilia;
    return query;
}

function mapBackendToBid(response: LicitacionBackendResponse): Bid {
    return {
        id_licitacion: response.idLicitacion,
        title: response.titulo ?? "",
        description: response.descripcion ?? "",
        fecha_publicacion: response.fechaPublicacion ? response.fechaPublicacion.split("T")[0] : "",
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
 * GET /licitaciones — Lista filtrada por familia y subfamilia
 */
export async function getLicitaciones(query: LicitacionesQuery = {}): Promise<Bid[]> {
    const response = await api.get<LicitacionBackendResponse[]>("/licitaciones", { params: query });
    return response.map(mapBackendToBid);
}

// TODO: activar cuando el backend implemente el path del contrato y eliminar getLicitaciones (get/all).
export async function getLicitacionesPorFamiliaYSubfamilia(familiaId: number, subfamiliaId: number, query: LicitacionesPorFamiliaQuery = {}): Promise<Bid[]> {
    const response = await api.get<{ licitaciones: LicitacionBackendResponse[] }>(
        `/licitaciones/familia/${familiaId}/subfamilia/${subfamiliaId}`,
        { params: query }
    );
    return (response?.licitaciones ?? []).map(mapBackendToBid);
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

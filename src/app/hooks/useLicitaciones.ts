/**
 * Hook useLicitaciones — Carga y gestiona licitaciones desde la API
 * Fetch inicial al montar, y refetch cuando cambien los filtros de familia/subfamilia
 */

import { useState, useEffect, useCallback } from "react";
// TODO: cuando el backend esté alineado con contrato V1.1, reemplazar getLicitacionesTodas por getLicitaciones
// y cambiar LicitacionesQueryAll por LicitacionesQuery (familiaCod/subfamiliaCod + filtros de fecha).
import { getLicitacionesTodas, type LicitacionesQueryAll } from "../../api/licitaciones";
import type { Bid } from "../types/Bid";

export interface UseLicitacionesResult {
    licitaciones: Bid[];
    loading: boolean;
    error: string | null;
    refetchLicitaciones: (query?: LicitacionesQueryAll) => Promise<void>;
}

export function useLicitaciones(initialQuery: LicitacionesQueryAll = {}): UseLicitacionesResult {
    const [licitaciones, setLicitaciones] = useState<Bid[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { familia, subfamilia } = initialQuery;

    const fetchLicitaciones = useCallback(async (query: LicitacionesQueryAll = {}) => {
        setLoading(true);
        setError(null);
        try {
            const data = await getLicitacionesTodas(query);
            setLicitaciones(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Error al cargar licitaciones");
            setLicitaciones([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const query: LicitacionesQueryAll = {};
        if (familia && familia > 0) query.familia = familia;
        if (subfamilia && subfamilia > 0) query.subfamilia = subfamilia;
        fetchLicitaciones(query);
    }, [fetchLicitaciones, familia, subfamilia]);

    return {
        licitaciones,
        loading,
        error,
        refetchLicitaciones: fetchLicitaciones,
    };
}

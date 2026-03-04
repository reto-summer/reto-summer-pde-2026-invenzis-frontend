/**
 * Hook useLicitaciones — Carga y gestiona licitaciones desde la API
 * Fetch inicial al montar, y refetch cuando cambien los filtros de familia/subfamilia
 */

import { useState, useEffect, useCallback } from "react";
import {
  getLicitaciones,
  type LicitacionesQuery,
} from "../../../api";
import type { Bid } from "../../features/bids/types/Bid";

export interface UseLicitacionesResult {
  licitaciones: Bid[];
  loading: boolean;
  error: string | null;
  refetchLicitaciones: (query?: LicitacionesQuery) => Promise<void>;
}

export function useLicitaciones(
  initialQuery: LicitacionesQuery = {},
  enabled = true,
): UseLicitacionesResult {
  const [licitaciones, setLicitaciones] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { familiaCod, subfamiliaCod } = initialQuery;

  const fetchLicitaciones = useCallback(
    async (query: LicitacionesQuery = {}) => {
      setLoading(true);
      setError(null);
      try {
        const data = await getLicitaciones(query);
        setLicitaciones(data);
      } catch (e) {
        console.error("fetchLicitaciones:", e);
        setError("No se pudieron cargar las licitaciones. Intenta de nuevo.");
        setLicitaciones([]);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!enabled) return;
    const query: LicitacionesQuery = {};
    if (familiaCod && familiaCod > 0) query.familiaCod = familiaCod;
    if (subfamiliaCod && subfamiliaCod > 0) query.subfamiliaCod = subfamiliaCod;
    fetchLicitaciones(query);
  }, [enabled, fetchLicitaciones, familiaCod, subfamiliaCod]);

  return {
    licitaciones,
    loading,
    error,
    refetchLicitaciones: fetchLicitaciones,
  };
}

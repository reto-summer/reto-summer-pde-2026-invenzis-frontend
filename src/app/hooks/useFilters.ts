/**
 * Hook useFilters — Estado de filtros cascada (familia / subfamilia).
 */

import { useState, useCallback } from "react";

export interface CascadaFiltersState {
  familiaCod: string | null;
  subfamiliaCod: string | null;
}

export function useFilters(initial: CascadaFiltersState = { familiaCod: null, subfamiliaCod: null }) {
  const [familiaCod, setFamiliaCod] = useState<string | null>(initial.familiaCod);
  const [subfamiliaCod, setSubfamiliaCod] = useState<string | null>(initial.subfamiliaCod);

  const setFilters = useCallback((next: Partial<CascadaFiltersState>) => {
    if (next.familiaCod !== undefined) setFamiliaCod(next.familiaCod);
    if (next.subfamiliaCod !== undefined) setSubfamiliaCod(next.subfamiliaCod);
  }, []);

  const clearCascada = useCallback(() => {
    setFamiliaCod(null);
    setSubfamiliaCod(null);
  }, []);

  const hasActiveCascada = familiaCod !== null || subfamiliaCod !== null;

  return {
    familiaCod,
    subfamiliaCod,
    setFamiliaCod,
    setSubfamiliaCod,
    setFilters,
    clearCascada,
    hasActiveCascada,
  };
}

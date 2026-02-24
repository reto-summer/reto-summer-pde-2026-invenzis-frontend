/**
 * Hook useFamilias — Cascada Familia → Subfamilia
 */

import { useState, useEffect, useCallback } from "react";
import { getFamilias, getSubfamiliasPorFamilia } from "../../api/familias";
import type { Familia, Subfamilia } from "../../api/types";

export interface UseFamiliasResult {
  familias: Familia[];
  subfamilias: Subfamilia[];
  familiaCod: string | null;
  subfamiliaCod: string | null;
  setFamiliaCod: (cod: string | null) => void;
  setSubfamiliaCod: (cod: string | null) => void;
  loadingFamilias: boolean;
  loadingSubfamilias: boolean;
  error: string | null;
  refetchFamilias: () => Promise<void>;
}

export function useFamilias(): UseFamiliasResult {
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [subfamilias, setSubfamilias] = useState<Subfamilia[]>([]);
  const [familiaCod, setFamiliaCodState] = useState<string | null>(null);
  const [subfamiliaCod, setSubfamiliaCod] = useState<string | null>(null);
  const [loadingFamilias, setLoadingFamilias] = useState(true);
  const [loadingSubfamilias, setLoadingSubfamilias] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFamilias = useCallback(async () => {
    setLoadingFamilias(true);
    setError(null);
    try {
      const data = await getFamilias();
      setFamilias(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al cargar familias");
      setFamilias([]);
    } finally {
      setLoadingFamilias(false);
    }
  }, []);

  useEffect(() => {
    fetchFamilias();
  }, [fetchFamilias]);

  const setFamiliaCod = useCallback((cod: string | null) => {
    setFamiliaCodState(cod);
    setSubfamiliaCod(null);
    setSubfamilias([]);
  }, []);

  useEffect(() => {
    if (!familiaCod) {
      setSubfamilias([]);
      setLoadingSubfamilias(false);
      return;
    }
    let cancelled = false;
    setLoadingSubfamilias(true);
    setError(null);
    getSubfamiliasPorFamilia(familiaCod)
      .then((data) => {
        if (!cancelled) setSubfamilias(data);
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Error al cargar subfamilias");
          setSubfamilias([]);
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingSubfamilias(false);
      });
    return () => {
      cancelled = true;
    };
  }, [familiaCod]);

  return {
    familias,
    subfamilias,
    familiaCod,
    subfamiliaCod,
    setFamiliaCod,
    setSubfamiliaCod,
    loadingFamilias,
    loadingSubfamilias,
    error,
    refetchFamilias: fetchFamilias,
  };
}

/**
 * Hook useFamilias — Cascada Familia → Subfamilia
 *
 * Carga la lista de familias al montar y, cada vez que `familiaCod` cambia,
 * carga las subfamilias correspondientes cancelando la petición anterior si
 * el componente se desmonta durante la carga (patrón de cancelación con flag).
 */

import { useState, useEffect, useCallback } from "react";
import { getFamilias, getSubfamiliasPorFamilia } from "../../../api/familias";
import type { Familia, Subfamilia } from "../../../api/types";

/** Resultado expuesto por `useFamilias`. */
export interface UseFamiliasResult {
  /** Lista de familias disponibles, ordenadas por código ascendente. */
  familias: Familia[];
  /** Subfamilias de la familia seleccionada, ordenadas por código ascendente. */
  subfamilias: Subfamilia[];
  /** Código de la familia seleccionada actualmente, o `null` si ninguna. */
  familiaCod: string | null;
  /** Código de la subfamilia seleccionada actualmente, o `null` si ninguna. */
  subfamiliaCod: string | null;
  /**
   * Cambia la familia seleccionada. Resetea `subfamiliaCod` y `subfamilias`
   * para forzar la recarga de subfamilias de la nueva familia.
   */
  setFamiliaCod: (cod: string | null) => void;
  /** Cambia la subfamilia seleccionada directamente. */
  setSubfamiliaCod: (cod: string | null) => void;
  /** `true` mientras se cargan las familias. */
  loadingFamilias: boolean;
  /** `true` mientras se cargan las subfamilias. */
  loadingSubfamilias: boolean;
  /** Mensaje de error user-friendly, o `null` si no hay error. */
  error: string | null;
  /** Recarga manualmente la lista de familias. */
  refetchFamilias: () => Promise<void>;
}

/**
 * Hook para gestionar la selección en cascada de familia y subfamilia.
 *
 * @returns `UseFamiliasResult` con listas, selección activa, estados de carga y error.
 */
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
      setFamilias([...data].sort((a, b) => a.cod - b.cod));
    } catch (e) {
      console.error("fetchFamilias:", e);
      setError("No se pudieron cargar las familias. Intenta de nuevo.");
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

  // Carga subfamilias cuando cambia la familia; usa flag `cancelled` para evitar
  // actualizar el estado si el efecto se limpió antes de que llegue la respuesta.
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
        if (!cancelled) setSubfamilias([...data].sort((a, b) => a.cod - b.cod));
      })
      .catch((e) => {
        if (!cancelled) {
          console.error("fetchSubfamilias:", e);
          setError("No se pudieron cargar las subfamilias. Intenta de nuevo.");
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

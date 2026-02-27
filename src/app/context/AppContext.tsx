import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type { Bid } from "../types/Bid";
import type { FiltersState } from "../types/filters";
import { DEFAULT_FILTERS } from "../types/filters";
import { useLicitaciones } from "../hooks/useLicitaciones";

interface AppState {
  bids: Record<number, Bid>;
  loading: boolean;
  error: string | null;
  success: boolean;
  filters: FiltersState;
  sidebarOpen: boolean;
  /** Filtros cascada (familia/subfamilia) para GET /licitaciones */
  familiaCod: string | null;
  subfamiliaCod: string | null;
}

interface AppContextType extends AppState {
  setBids: (bids: Record<number, Bid>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccess: (success: boolean) => void;
  setFilters: (filters: FiltersState) => void;
  setSidebarOpen: (open: boolean) => void;
  setFiltrosCascada: (familiaCod: string | null, subfamiliaCod: string | null) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [bids, setBids] = useState<Record<number, Bid>>({});
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [familiaCod, setFamiliaCodState] = useState<string | null>(null);
  const [subfamiliaCod, setSubfamiliaCod] = useState<string | null>(null);

  // Usar useLicitaciones para cargar datos desde la API
  const { licitaciones, loading, error } = useLicitaciones({
    familia: filters.familia,
    subfamilia: filters.subfamilia,
  });

  // Sincronizar licitaciones cargadas con el estado de bids (diccionario por id_licitacion)
  useEffect(() => {
    const dict = Object.fromEntries(licitaciones.map((b) => [b.id_licitacion, b]));
    setBids(dict);
  }, [licitaciones]);

  const setFiltrosCascada = useCallback((fam: string | null, sub: string | null) => {
    setFamiliaCodState(fam);
    setSubfamiliaCod(sub);
  }, []);

  return (
    <AppContext.Provider
      value={{
        bids,
        loading,
        error,
        success: true,
        filters,
        sidebarOpen,
        familiaCod,
        subfamiliaCod,
        setBids,
        setLoading: () => { },
        setError: () => { },
        setSuccess: () => { },
        setFilters,
        setSidebarOpen,
        setFiltrosCascada,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (ctx === null) {
    throw new Error("useAppContext debe usarse dentro de AppProvider");
  }
  return ctx;
}

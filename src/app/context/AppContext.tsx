import { createContext, useContext, useState, useCallback, useEffect } from "react";
import type { ReactNode } from "react";
import type { FiltersState } from "../types/filters";
import { DEFAULT_FILTERS } from "../types/filters";
import { getConfig, postConfig } from "../../api/config";

interface AppState {
  filters: FiltersState;
  sidebarOpen: boolean;
  /** Filtros cascada (familia/subfamilia) para GET /licitaciones */
  familiaCod: string | null;
  subfamiliaCod: string | null;
}

interface AppContextType extends AppState {
  setFilters: (filters: FiltersState) => void;
  setSidebarOpen: (open: boolean) => void;
  setFiltrosCascada: (familiaCod: string | null, subfamiliaCod: string | null) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [familiaCod, setFamiliaCodState] = useState<string | null>(null);
  const [subfamiliaCod, setSubfamiliaCod] = useState<string | null>(null);

  // Cargar selección guardada al iniciar
  useEffect(() => {
    getConfig().then((config) => {
      if (config.familiaCod) setFamiliaCodState(String(config.familiaCod));
      if (config.subfamiliaCod) setSubfamiliaCod(String(config.subfamiliaCod));
    }).catch(() => {});
  }, []);

  const setFiltrosCascada = useCallback((fam: string | null, sub: string | null) => {
    setFamiliaCodState(fam);
    setSubfamiliaCod(sub);
    postConfig({
      familiaCod: fam ? Number(fam) : null,
      subfamiliaCod: sub ? Number(sub) : null,
    }).catch(() => {});
  }, []);

  return (
    <AppContext.Provider
      value={{
        filters,
        sidebarOpen,
        familiaCod,
        subfamiliaCod,
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

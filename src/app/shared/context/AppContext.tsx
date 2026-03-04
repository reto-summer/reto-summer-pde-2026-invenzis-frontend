/**
 * Contexto global de la aplicación (AppContext / AppProvider).
 *
 * Centraliza el estado compartido entre todos los componentes:
 * - Filtros de búsqueda de licitaciones (`FiltersState`).
 * - Visibilidad del sidebar de configuración.
 * - Selección de familia/subfamilia (usada como filtro en el GET /licitaciones).
 * - Flag `configLoaded` que indica cuándo el GET /config resolvió, evitando
 *   que `useLicitaciones` realice un fetch prematuro con query incompleto.
 *
 * La selección de familia/subfamilia se persiste en el backend vía PUT /config
 * cada vez que el usuario confirma los cambios desde el sidebar.
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { ReactNode } from "react";
import type { FiltersState } from "../../features/filters/types/filters";
import { DEFAULT_FILTERS } from "../../features/filters/types/filters";
import { getConfig, putConfig } from "../../../api";

/** Estado global compartido de la aplicación. */
interface AppState {
  /** Estado completo de los filtros de la barra de búsqueda. */
  filters: FiltersState;
  /** `true` cuando el sidebar de configuración está abierto. */
  sidebarOpen: boolean;
  /** Código de familia activo para filtrar licitaciones. `null` si no hay filtro. */
  familiaCod: string | null;
  /** Código de subfamilia activo para filtrar licitaciones. `null` si no hay filtro. */
  subfamiliaCod: string | null;
  /** `true` una vez que GET /config resolvió — evita fetch prematuro de licitaciones. */
  configLoaded: boolean;
}

/** Extiende `AppState` con los setters y acciones disponibles en el contexto. */
interface AppContextType extends AppState {
  /** Reemplaza el estado completo de los filtros. */
  setFilters: (filters: FiltersState) => void;
  /** Abre o cierra el sidebar de configuración. */
  setSidebarOpen: (open: boolean) => void;
  /**
   * Actualiza la selección de familia/subfamilia y la persiste en el backend.
   * Llamar con `null` en ambos parámetros limpia la selección.
   */
  setFiltrosCascada: (
    familiaCod: string | null,
    subfamiliaCod: string | null,
  ) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

/**
 * Proveedor del contexto global. Debe envolver el árbol completo de la aplicación.
 * Al montar, carga la configuración guardada (familia/subfamilia) desde el backend.
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FiltersState>(DEFAULT_FILTERS);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [familiaCod, setFamiliaCodState] = useState<string | null>(null);
  const [subfamiliaCod, setSubfamiliaCod] = useState<string | null>(null);
  const [configLoaded, setConfigLoaded] = useState(false);

  // Cargar selección guardada al iniciar; marcar configLoaded en cualquier caso
  // (éxito o error) para no bloquear el fetch de licitaciones indefinidamente.
  useEffect(() => {
    getConfig()
      .then((config) => {
        if (config.familiaCod) setFamiliaCodState(String(config.familiaCod));
        if (config.subfamiliaCod)
          setSubfamiliaCod(String(config.subfamiliaCod));
      })
      .catch(() => {})
      .finally(() => {
        setConfigLoaded(true);
      });
  }, []);

  const setFiltrosCascada = useCallback(
    (fam: string | null, sub: string | null) => {
      setFamiliaCodState(fam);
      setSubfamiliaCod(sub);
      // Persistir en background; los errores se silencian para no interrumpir la UI.
      putConfig({
        familiaCod: fam ? Number(fam) : null,
        subfamiliaCod: sub ? Number(sub) : null,
      }).catch(() => {});
    },
    [],
  );

  return (
    <AppContext.Provider
      value={{
        filters,
        sidebarOpen,
        familiaCod,
        subfamiliaCod,
        configLoaded,
        setFilters,
        setSidebarOpen,
        setFiltrosCascada,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

/**
 * Devuelve el valor del `AppContext`. Es el punto de acceso único al estado global.
 * @throws {Error} Si se usa fuera del árbol de `AppProvider`.
 */
export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext debe usarse dentro de AppProvider");
  return ctx;
}

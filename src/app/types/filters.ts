/**
 * Tipos y constantes para el estado de filtros del Radar de Licitaciones.
 * Define las claves de tipo de licitación, rangos de días hasta el cierre,
 * el estado completo (FiltersState) y las etiquetas en español para la UI.
 */

/** Claves válidas para filtrar por días restantes hasta el cierre */
export type DateRangeKey = "today" | "under_7" | "7_15" | "over_15";

/** Estado completo de los filtros (controlado por el padre vía value/onChange) */

export interface FiltersState {
  search: string;
  /** Tipos de licitación seleccionados. Vacío = sin filtro (muestra todos). */
  tenderTypes: string[];
  dateRanges: DateRangeKey[];
  familia: number;
  subfamilia: number;
  fechaPublicacionDesde?: string; // YYYY-MM-DD
  fechaPublicacionHasta?: string; // YYYY-MM-DD
  fechaCierreDesde?: string;      // YYYY-MM-DDTHH:MM:SS
  fechaCierreHasta?: string;      // YYYY-MM-DDTHH:MM:SS
}

/** Etiquetas en español para cada rango de días */
export const DATE_RANGE_LABELS: Record<DateRangeKey, string> = {
  today: "Hoy",
  under_7: "< 7 días",
  "7_15": "7-15 días",
  over_15: ">15 días",
};

/** Valores iniciales: búsqueda vacía, sin tipos seleccionados (muestra todos), sin filtro por plazo */
export const DEFAULT_FILTERS: FiltersState = {
  search: "",
  tenderTypes: [],
  dateRanges: [],
  familia: 0,
  subfamilia: 0,
  fechaPublicacionDesde: "",
  fechaPublicacionHasta: "",
  fechaCierreDesde: "",
  fechaCierreHasta: "",
};

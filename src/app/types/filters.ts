/**
 * Tipos y constantes para el estado de filtros del Radar de Licitaciones.
 * Define las claves de tipo de licitación, rangos de días hasta el cierre,
 * el estado completo (FiltersState) y las etiquetas en español para la UI.
 */

/** Claves válidas para filtrar por tipo de licitación */
export type TenderTypeKey = "licitacion_publica" | "compra_directa" | "licitacion_abreviada";

/** Claves válidas para filtrar por días restantes hasta el cierre */
export type DateRangeKey = "under_7" | "7_15" | "over_15";

/** Estado completo de los filtros (controlado por el padre vía value/onChange) */

export interface FiltersState {
  search: string;
  tenderTypes: TenderTypeKey[];
  dateRanges: DateRangeKey[];
  familia?: number | null;
  subfamilia?: number | null;
}

/** Etiquetas en español para cada tipo de licitación */
export const TENDER_TYPE_LABELS: Record<TenderTypeKey, string> = {
  licitacion_publica: "Licitación Pública",
  compra_directa: "Compra Directa",
  licitacion_abreviada: "Licitación Abreviada",
};

/** Etiquetas en español para cada rango de días */
export const DATE_RANGE_LABELS: Record<DateRangeKey, string> = {
  under_7: "< 7 días",
  "7_15": "7-15 días",
  over_15: ">15 días",
};

/** Valores iniciales: búsqueda vacía, los 3 tipos marcados, sin filtro por plazo */
export const DEFAULT_FILTERS: FiltersState = {
  search: "",
  tenderTypes: ["licitacion_publica", "compra_directa", "licitacion_abreviada"],
  dateRanges: [],
};

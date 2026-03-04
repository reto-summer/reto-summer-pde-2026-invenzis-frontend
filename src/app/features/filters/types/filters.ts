/**
 * Tipos y constantes para el estado de filtros del Radar de Licitaciones.
 * Define el estado completo (FiltersState) y sus valores por defecto.
 */

/** Estado completo de los filtros de búsqueda. Controlado por el padre vía value/onChange. */
export interface FiltersState {
  /** Texto libre para buscar en título y descripción. Vacío = sin filtro. */
  search: string;
  /** Tipos de licitación seleccionados. Vacío = sin filtro (muestra todos). */
  tenderTypes: string[];
  /** Código de familia seleccionado. 0 = sin filtro. */
  familia: number;
  /** Código de subfamilia seleccionado. 0 = sin filtro. */
  subfamilia: number;
  /** Límite inferior del rango de fecha de publicación (YYYY-MM-DDTHH:MM:SS). */
  fechaPublicacionDesde?: string;
  /** Límite superior del rango de fecha de publicación (YYYY-MM-DDTHH:MM:SS). */
  fechaPublicacionHasta?: string;
  /** Límite inferior del rango de fecha de cierre (YYYY-MM-DDTHH:MM:SS). */
  fechaCierreDesde?: string;
  /** Límite superior del rango de fecha de cierre (YYYY-MM-DDTHH:MM:SS). */
  fechaCierreHasta?: string;
}

/** Valores iniciales: búsqueda vacía, sin tipos ni fechas seleccionadas. */
export const DEFAULT_FILTERS: FiltersState = {
  search: "",
  tenderTypes: [],
  familia: 0,
  subfamilia: 0,
  fechaPublicacionDesde: "",
  fechaPublicacionHasta: "",
  fechaCierreDesde: "",
  fechaCierreHasta: "",
};

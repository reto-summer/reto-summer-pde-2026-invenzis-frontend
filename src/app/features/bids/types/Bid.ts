/**
 * Tipos del modelo de licitación usado en la UI.
 * Estos tipos reflejan el shape que devuelve el mapper `mapBackendToBid`
 * en `src/api/licitaciones.ts`, no el contrato directo del backend.
 */

/** Familia embebida en una licitación (shape diferente a `api/types.ts#Familia`). */
export interface BidFamilia {
  id_familia: number;
  nombre: string;
}

/** Subfamilia embebida en una licitación (shape diferente a `api/types.ts#Subfamilia`). */
export interface BidSubfamilia {
  id_subfamilia: number;
  nombre: string;
  id_familia: number;
}

/** Representa una licitación tal como es consumida por los componentes de la UI. */
export interface Bid {
  id_licitacion: number;
  title: string;
  description: string;
  tipoLicitacion?: string;
  /** Fecha de publicación en formato ISO 8601. Puede venir como "YYYY-MM-DD" (sin hora). */
  fecha_publicacion: string;
  /** Fecha y hora de cierre en formato ISO 8601 completo. */
  fecha_cierre: string;
  link: string;
  familia: BidFamilia;
  subfamilia: BidSubfamilia;
}

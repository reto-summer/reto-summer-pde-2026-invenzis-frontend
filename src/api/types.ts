/**
 * Contratos de datos de la API del backend.
 *
 * Este módulo define dos categorías de interfaces:
 * - **Tipos públicos**: los que son re-exportados por el barrel y consumidos en la UI.
 * - **Tipos internos de backend**: usados sólo para deserializar las respuestas crudas
 *   antes de mapearlas al modelo de UI (ej: `LicitacionBackendResponse`).
 */

// ─── Tipos públicos ───────────────────────────────────────────────────────────

/** Familia de licitaciones devuelta por GET /familias. */
export interface Familia {
  /** Código numérico único de la familia. */
  cod: number;
  /** Nombre descriptivo de la familia. */
  descripcion: string;
}

/** Subfamilia devuelta por GET /subfamilias/familia/{famiCod}. */
export interface Subfamilia {
  /** Código de la familia padre. */
  famiCod: number;
  /** Código numérico único de la subfamilia. */
  cod: number;
  /** Nombre descriptivo de la subfamilia. */
  descripcion: string;
}

/** Dirección de email registrada para recibir notificaciones. */
export interface EmailConfig {
  /** Dirección de correo electrónico. */
  direccion: string;
}

/** Resumen de una notificación, devuelto por GET /notificacion. */
export interface NotificacionResumen {
  /** Identificador único de la notificación. */
  id: number;
  /** Título descriptivo de la notificación. */
  title: string;
  /** `true` si la ejecución fue exitosa; `false` si hubo un error. */
  success: boolean;
  /** Fecha y hora de ejecución en formato ISO 8601. */
  executionDate: string;
}

/** Detalle completo de una notificación, devuelto por GET /notificacion/{id}. */
export interface NotificacionDetalle extends NotificacionResumen {
  /** Mensaje de detalle adicional. Puede ser `null` si no aplica. */
  detail: string | null;
  /** Contenido extendido (ej: diff o payload). Puede ser `null` si no aplica. */
  content: string | null;
}

// ─── Tipos internos de backend ────────────────────────────────────────────────

/**
 * Shape crudo que devuelve el backend en GET /notificacion.
 * Se mapea a `NotificacionResumen` antes de ser expuesto a la UI.
 * @internal
 */
export interface NotificacionBackendResumen {
  id: number;
  titulo?: string;
  exito?: boolean;
  fechaEjecucion?: string;
}

/**
 * Shape crudo que devuelve el backend en GET /notificacion/{id}.
 * Se mapea a `NotificacionDetalle` antes de ser expuesto a la UI.
 * @internal
 */
export interface NotificacionBackendDetalle extends NotificacionBackendResumen {
  detalle?: string | null;
  contenido?: string | null;
}

/**
 * Shape crudo que devuelve el backend en GET /licitaciones.
 * Se mapea a `Bid` (en `src/app/types/Bid.ts`) antes de ser expuesto a la UI.
 * @internal
 */
export interface LicitacionBackendResponse {
  idLicitacion: number;
  titulo?: string;
  tipoLicitacion?: string;
  descripcion?: string;
  fechaCierre?: string;
  fechaPublicacion?: string;
  link?: string;
  familia?: Familia;
  subfamilia?: Subfamilia;
}

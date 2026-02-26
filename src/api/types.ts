/**
 * Tipos de respuestas de la API.
 */

export interface Familia {
  cod: number;
  descripcion: string;
}

export interface Subfamilia {
  famiCod: number;
  cod: number;
  descripcion: string;
}

export interface EmailConfig {
  direccion: string;
}

export interface NotificacionResumen {
  id: number;
  title: string;
  success: boolean;
  executionDate: string;
}

export interface NotificacionDetalle extends NotificacionResumen {
  detail: string | null;
  content: string | null;
}

export interface NotificacionBackendResumen {
  id: number;
  titulo?: string;
  exito?: boolean;
  fechaEjecucion?: string;
}

export interface NotificacionBackendDetalle extends NotificacionBackendResumen {
  detalle?: string | null;
  contenido?: string | null;
}
export interface LicitacionBackendResponse {
  idLicitacion: number;
  titulo?: string;
  tipoLicitacion?: string;
  descripcion?: string;
  fechaCierre?: string;
  fecha_publicacion?: string;
  link?: string;
  familia?: Familia;
  subfamilia?: Subfamilia;
}

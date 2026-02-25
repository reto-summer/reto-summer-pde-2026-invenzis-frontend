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

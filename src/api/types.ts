/**
 * Tipos de respuestas de la API (familia, subfamilia). id se usa en GET /licitaciones.
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

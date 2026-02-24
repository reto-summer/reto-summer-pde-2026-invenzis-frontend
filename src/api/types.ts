/**
 * Tipos de respuestas de la API (familia, subfamilia). id se usa en GET /licitaciones.
 */

export interface Familia {
  id: number;
  cod: string;
  descripcion: string;
}

export interface Subfamilia {
  id: number;
  cod: string;
  nombre: string;
}

export interface EmailConfig {
  direccion: string;
}

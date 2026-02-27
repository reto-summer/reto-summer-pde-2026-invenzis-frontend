
export interface Familia {
  id_familia: number;
  nombre: string;
}

export interface Subfamilia {
  id_subfamilia: number;
  nombre: string;
  id_familia: number;
}

export interface Bid {
  id_licitacion: number;
  title: string;
  description: string;
  tipo_licitacion: string;
  fecha_publicacion: string; // ISO 8601 datetime
  fecha_cierre: string; // ISO 8601 datetime
  link: string;
  familia: Familia;
  subfamilia: Subfamilia;
}

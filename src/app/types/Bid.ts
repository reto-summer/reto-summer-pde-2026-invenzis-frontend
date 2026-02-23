
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
  fecha_publicacion: string; // YYYY-MM-DD
  fecha_cierre: string; // YYYY-MM-DDTHH:MM:SS
  link: string;
  familia: Familia;
  subfamilia: Subfamilia;
}

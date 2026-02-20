export interface Bid {
  id_licitacion: number;
  title: string;
  description: string;
  fecha_publicacion: string; // YYYY-MM-DD
  fecha_cierre: string; // YYYY-MM-DDTHH:MM:SS
  link: string;
  familia: { id_familia: number; nombre: string };
  subfamilia: { id_subfamilia: number; nombre: string };
  clase: { id_clase: number; nombre: string };
  subclase: { id_subclase: number; nombre: string };
}

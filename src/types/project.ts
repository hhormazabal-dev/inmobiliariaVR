export type Project = {
  id: string;
  slug: string;
  titulo: string;
  comuna: string;
  desdeUF: number;
  tipologias: string[]; // ["1D","2D","3D"]
  entrega: "inmediata" | "en_verde" | "en_blanco";
  arriendoGarantizado?: boolean;
  creditoInterno?: boolean;
  imagen: string; // URL
};
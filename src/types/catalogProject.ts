export type CatalogProject = {
  id: string;
  name: string;
  comuna: string;
  uf_min: number | null;
  uf_max: number | null;
  status: string | null;
  cover_url: string | null;
  description: string | null;
  gallery_urls: string[] | null;
  tipologias: string | null;
  bono_pie: string | number | null;
  descuento: string | number | null;
  credito_interno: string | number | null;
  reserva: string | number | null;
};

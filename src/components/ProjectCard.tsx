"use client";

import { useMemo } from "react";
import FeaturedProjectCard from "@/components/FeaturedProjectCard";
import { FALLBACK_IMAGE_DATA } from "@/lib/fallbackImage";
import { toPublicStorageUrl } from "@/lib/supabaseImages";
import type { CatalogProject } from "@/types/catalogProject";
import type { Project } from "@/types/project";
import { buildProjectSlug } from "@/lib/projectSlug";

const parseTipologias = (input?: string | null) => {
  if (!input) return [];
  return input
    .split(/[;,|/]/)
    .map((value) => value.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .map((value) => value.replace(/\s{2,}/g, " "));
};

const mapEntrega = (): Project["entrega"] => "inmediata";

const normalizeDescripcion = (raw?: string | null) => {
  if (!raw) {
    return "Conecta con nuestro equipo para conocer todos los detalles de este proyecto.";
  }
  const text = raw.replace(/\s+/g, " ").trim();
  return (
    text ||
    "Conecta con nuestro equipo para conocer todos los detalles de este proyecto."
  );
};

type Props = {
  project: CatalogProject;
};

export default function ProjectCard({ project }: Props) {
  const featuredProject = useMemo<Project>(() => {
    const galleryImages =
      project.gallery_urls
        ?.map((value) => toPublicStorageUrl(value))
        .filter((value): value is string => Boolean(value)) ?? [];

    const cover =
      toPublicStorageUrl(project.cover_url) ??
      galleryImages[0] ??
      FALLBACK_IMAGE_DATA;

    const galleryFallback = galleryImages.find((url) => url !== cover);

    const tipologias = parseTipologias(project.tipologias);
    const slug = buildProjectSlug(project.name, project.comuna);

    const creditValue =
      typeof project.credito_interno === "string"
        ? project.credito_interno.toLowerCase()
        : project.credito_interno;

    const creditoInterno =
      typeof creditValue === "string"
        ? creditValue !== "no" && creditValue !== "0"
        : Boolean(creditValue);

    const entrega = mapEntrega();

    return {
      id: project.id,
      slug,
      titulo: project.name,
      comuna: project.comuna,
      desdeUF: project.uf_min ?? project.uf_max ?? 0,
      tipologias: tipologias.length > 0 ? tipologias : ["Consultar"],
      entrega,
      arriendoGarantizado: undefined,
      creditoInterno: creditoInterno || undefined,
      descripcion: normalizeDescripcion(project.description),
      imagen: cover,
      imagenFallback: galleryFallback,
    };
  }, [project]);

  return <FeaturedProjectCard project={featuredProject} />;
}

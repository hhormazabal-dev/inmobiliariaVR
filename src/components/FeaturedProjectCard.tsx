"use client";

import { useState } from "react";
import SafeImage from "@/components/SafeImage";
import { ufFmt } from "@/lib/uf";
import type { Project } from "@/types/project";
import ProjectQuickView from "@/components/ProjectQuickView";
import { toPublicStorageUrl } from "@/lib/supabaseImages";
import { FALLBACK_IMAGE_DATA } from "@/lib/fallbackImage";
import { motion } from "framer-motion";

// Ícono WhatsApp (SVG propio)
function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <path
        d="M19.11 17.2c-.28-.14-1.63-.8-1.88-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.2-.44-2.3-1.4-.85-.75-1.42-1.68-1.59-1.96-.16-.28-.02-.43.12-.56.13-.13.28-.32.41-.48.14-.16.18-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.61-1.46-.84-1.99-.22-.52-.44-.45-.61-.46l-.52-.01c-.18 0-.49.07-.75.35-.25.28-.99.97-.99 2.37 0 1.4 1.02 2.76 1.16 2.94.14.18 2.01 3.08 4.88 4.2 1.81.74 2.52.81 3.43.68.55-.08 1.63-.66 1.86-1.3.23-.64.23-1.18.16-1.3-.07-.12-.25-.19-.53-.33z"
        fill="currentColor"
      />
      <path
        d="M26.5 5.5c-4.7-4.7-12.3-4.7-17 0-3.8 3.8-4.5 9.6-1.8 14.1L6 28l8.6-1.6c4.4 2.4 9.9 1.6 13.6-2.1 4.7-4.7 4.7-12.3 0-17zm-1.8 15.2c-3.1 3.1-7.8 3.8-11.6 1.7l-.84-.45-5.1.95.97-4.98-.49-.86C5.3 12.8 6 8.1 9.1 5c3.9-3.9 10.3-3.9 14.2 0s3.9 10.3 0 14.2z"
        fill="currentColor"
      />
    </svg>
  );
}

type Props = { project: Project };

const resolveImageSrc = (value?: string | null) => {
  if (!value) return null;
  if (
    typeof value === "string" &&
    (value.startsWith("/") || value.startsWith("data:"))
  ) {
    return value;
  }
  return (
    toPublicStorageUrl(value) ?? (typeof value === "string" ? value : null)
  );
};

export default function FeaturedProjectCard({ project }: Props) {
  const [open, setOpen] = useState(false);
  const fallbackImage =
    resolveImageSrc(project.imagenFallback) ?? FALLBACK_IMAGE_DATA;
  const coverImage =
    resolveImageSrc(project.imagen) ?? fallbackImage ?? FALLBACK_IMAGE_DATA;

  const waPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";
  const waText = `Hola, me interesa ${project.titulo} (${project.comuna}) desde ${project.desdeUF} UF. ¿Podemos coordinar una asesoría gratuita?`;
  const waHref = `https://wa.me/${waPhone}?text=${encodeURIComponent(waText)}`;
  const calLink = process.env.NEXT_PUBLIC_CAL_LINK || "/contacto";
  const descripcion =
    project.descripcion?.trim() ||
    "Consulta con nuestro equipo para conocer todos los detalles de este proyecto.";

  return (
    <>
      <motion.article
        whileHover={{ y: -6 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="group relative mx-auto flex h-full w-full max-w-[360px] flex-col overflow-hidden rounded-3xl border border-white/60 bg-[radial-gradient(circle_at_8%_0%,rgba(237,201,103,0.32),rgba(255,255,255,0.96)55%),linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,255,255,0.86))] shadow-[0_20px_65px_rgba(14,33,73,0.12)] backdrop-blur-sm sm:max-w-[380px]"
      >
        <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_5%,rgba(237,201,103,0.32),rgba(255,255,255,0)),radial-gradient(circle_at_80%_20%,rgba(14,33,73,0.08),rgba(255,255,255,0))] opacity-0 transition group-hover:opacity-100" />
        {/* Imagen */}
        <div className="relative h-48 w-full flex-shrink-0 overflow-hidden">
          <SafeImage
            src={coverImage}
            fallbackSrc={fallbackImage}
            alt={project.titulo}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.05]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {project.entrega === "inmediata" && (
            <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-brand-mute">
              Entrega inmediata
            </span>
          )}
        </div>

        {/* Contenido */}
        <div className="relative flex h-full flex-col gap-5 p-6">
          <header className="flex min-h-[92px] items-start justify-between gap-5">
            <div className="space-y-1">
              <h3
                className="text-lg font-semibold leading-tight text-brand-navy"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {project.titulo}
              </h3>
              <p
                className="text-sm leading-tight text-brand-mute"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {project.comuna} · {project.tipologias.join(" / ")}
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs uppercase tracking-wide text-brand-mute/70">
                Desde
              </div>
              <div className="text-base font-semibold text-brand-navy">
                {ufFmt(project.desdeUF)}
              </div>
            </div>
          </header>

          <div className="rounded-2xl bg-[rgba(237,201,103,0.15)] p-4 text-sm text-brand-mute">
            <p
              className="leading-relaxed"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "96px",
              }}
            >
              {descripcion}
            </p>
          </div>

          {/* CTAs minimalistas */}
          <footer className="mt-auto flex flex-wrap items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="rounded-full border border-brand-navy/10 bg-white px-4 py-2 text-sm font-medium text-brand-navy transition hover:border-brand-navy/25 hover:bg-white/90"
            >
              Más información
            </button>

            <a
              href={calLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-brand-navy/10 bg-gradient-to-r from-brand-navy via-brand-gold to-brand-gold px-4 py-2 text-sm font-medium text-white shadow-[0_16px_40px_rgba(237,201,103,0.22)] transition hover:shadow-[0_20px_50px_rgba(237,201,103,0.28)]"
            >
              Agendar asesoría gratuita
            </a>

            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/10 px-3 py-1.5 text-sm font-medium text-brand-green transition hover:bg-brand-green hover:text-white"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </a>
          </footer>
        </div>
      </motion.article>

      {/* Modal de vista rápida */}
      <ProjectQuickView
        open={open}
        onClose={() => setOpen(false)}
        project={project}
      />
    </>
  );
}

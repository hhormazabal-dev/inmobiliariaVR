"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { clpFmt, ufFmt, ufToClp } from "@/lib/uf";
import type { Project } from "@/types/project";
import ProjectQuickView from "@/components/ProjectQuickView";

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

type Props = { project: Project; ufHoy?: number };

export default function ProjectCard({ project, ufHoy }: Props) {
  const [open, setOpen] = useState(false);

  const clp = ufToClp(project.desdeUF, ufHoy);
  const waPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";
  const waText = `Hola, me interesa ${project.titulo} (${project.comuna}) desde ${project.desdeUF} UF. ¿Podemos coordinar una asesoría?`;
  const waHref = `https://wa.me/${waPhone}?text=${encodeURIComponent(waText)}`;
  const calLink =
    process.env.NEXT_PUBLIC_CAL_LINK ||
    "https://cal.com/tu-org/visita-proyecto";

  return (
    <>
      <article className="group overflow-hidden rounded-3xl border border-white/70 bg-white/90 shadow-[0_24px_60px_rgba(14,33,73,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_32px_80px_rgba(14,33,73,0.12)]">
        {/* Imagen */}
        <div className="relative h-48 w-full">
          <Image
            src={project.imagen}
            alt={project.titulo}
            fill
            className="object-cover transition group-hover:scale-[1.015]"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {/* Badges discretas */}
          {project.arriendoGarantizado && (
            <span className="absolute left-3 top-3 rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[11px] font-medium text-brand-navy shadow-sm">
              Arriendo garantizado
            </span>
          )}
          {project.creditoInterno && (
            <span className="absolute right-3 top-3 rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[11px] font-medium text-brand-navy shadow-sm">
              Crédito interno
            </span>
          )}
          <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-brand-mute">
            {project.entrega.replace("_", " ")}
          </span>
        </div>

        {/* Contenido */}
        <div className="flex flex-col gap-5 p-6">
          <header className="flex items-start justify-between gap-5">
            <div>
              <h3 className="text-lg font-semibold text-brand-navy">
                {project.titulo}
              </h3>
              <p className="text-sm text-brand-mute">
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
              <div className="text-xs text-brand-mute">{clpFmt(clp)}</div>
            </div>
          </header>

          <div className="rounded-2xl bg-brand-sand/60 p-4 text-sm text-brand-mute">
            <p>
              Revisión legal y financiera incluida. Entregamos comparativa de
              dividendos y escenarios de arriendo en menos de 48 horas.
            </p>
          </div>

          {/* CTAs minimalistas */}
          <footer className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="rounded-full border border-brand-navy/10 bg-white px-4 py-2 text-sm font-medium text-brand-navy transition hover:border-brand-navy/25 hover:bg-white/90"
            >
              Vista rápida
            </button>

            <Link
              href={`/proyectos/${project.slug}`}
              className="text-sm font-semibold text-brand-navy hover:opacity-80"
            >
              Ver ficha →
            </Link>

            <a
              href={calLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-brand-navy/10 bg-gradient-to-r from-brand-navy via-brand-gold to-brand-gold px-4 py-2 text-sm font-medium text-white shadow-[0_16px_40px_rgba(212,175,55,0.22)] transition hover:shadow-[0_20px_50px_rgba(212,175,55,0.28)]"
            >
              Agendar asesoría
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
      </article>

      {/* Modal de vista rápida */}
      <ProjectQuickView
        open={open}
        onClose={() => setOpen(false)}
        project={project}
        ufHoy={ufHoy}
      />
    </>
  );
}

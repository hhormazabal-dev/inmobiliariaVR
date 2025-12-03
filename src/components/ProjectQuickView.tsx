"use client";

import Modal from "@/components/ui/Modal";
import { ufFmt } from "@/lib/uf";
import type { Project } from "@/types/project";
import { useEffect, useState } from "react";
import { listProjectImages } from "@/lib/gallery";
import SafeImage from "@/components/SafeImage";
import { toPublicStorageUrl } from "@/lib/supabaseImages";
import { FALLBACK_IMAGE_DATA } from "@/lib/fallbackImage";
import { resolveFolderName } from "@/lib/galleryFolders";

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <path
        d="M19.11 17.2c-.28-.14-1.63-.8-1.88-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.2-.44-2.3-1.4-.85-.75-1.42-1.68-1.59-1.96-.16-.28-.02-.43.12-.56.13-.13.28-.32.41-.48.14-.16.18-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.61-1.46-.84-1.99-.22-.52-.44-.45-.61-.46l-.52-.01c-.18 0-.49.07-.75.35-.25.28-.99.97-.99 2.37 0 1.4 1.02 2.76 1.16 2.94.14.18 2.01 3.08 4.88 4.2 1.81.74 2.52.81 3.43.68.55-.08 1.63-.66 1.86-1.3.23-.64.23-1.18.16-1.3-.07-.12-.25-.19-.53-.33z"
        fill="currentColor"
      />
      <path
        d="M26.5 5.5c-4.7-4.7-12.3-4.7-17 0-3.8 3.8-4.5 9.6-1.8 14.1L6 28l8.6-1.6c4.4 2.4 9.9 1.6 13.6-2.1 4.7-4.7 4.7-12.3 0-17zm-1.8 15.2c-3.1 3.1-7.8 3.8-11.6 1.7l-.84-.45-5.1.95.97-4.98-.49-.86C5.3 12.8 6 8.1 9.1 5c3.9-3.9 10.3-3.9 14.2 0s 3.9 10.3 0 14.2z"
        fill="currentColor"
      />
    </svg>
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
  project: Project;
};

export default function ProjectQuickView({ open, onClose, project }: Props) {
  const coverImage = toPublicStorageUrl(project.imagen) ?? FALLBACK_IMAGE_DATA;
  const [images, setImages] = useState<string[]>(() => [coverImage]);
  const [idx, setIdx] = useState(0);
  const slugify = (input: string) =>
    (input || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  const slugName = slugify(project.titulo);
  const slugComuna = slugify(project.comuna);
  const brochureFolder =
    (slugComuna && slugName ? `${slugComuna}/${slugName}` : "") ||
    resolveFolderName(project.titulo) ||
    slugName;
  const brochureFromFolder =
    brochureFolder && toPublicStorageUrl(`${brochureFolder}/1.pdf`);
  const ensureDownload = (
    url?: string | null,
    fallback: string = "/contacto",
  ): string => {
    const base = url || fallback;
    try {
      const parsed = new URL(base);
      if (!parsed.searchParams.has("download")) {
        parsed.searchParams.set("download", "1");
      }
      return parsed.toString();
    } catch {
      return base;
    }
  };
  const fallbackBrochure = ensureDownload(
    brochureFromFolder ||
      process.env.NEXT_PUBLIC_BROCHURE_LINK ||
      process.env.NEXT_PUBLIC_CAL_LINK ||
      "/contacto",
  );
  const [brochureUrl, setBrochureUrl] = useState<string>(fallbackBrochure);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!open) {
        return;
      }
      setIdx(0);
      setBrochureUrl(fallbackBrochure);
      const { images: urls, brochure } = await listProjectImages(
        project.titulo,
        project.imagen,
        project.comuna,
      );
      const normalized = (urls ?? [])
        .map((url) => toPublicStorageUrl(url))
        .filter((url): url is string => Boolean(url));
      const cover = toPublicStorageUrl(project.imagen);
      const unique = Array.from(new Set([...normalized, cover ?? coverImage]));
      if (active) {
        setImages(unique.length > 0 ? unique : [coverImage]);
        if (brochure) {
          setBrochureUrl(ensureDownload(brochure, fallbackBrochure));
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [
    coverImage,
    fallbackBrochure,
    open,
    project.comuna,
    project.imagen,
    project.titulo,
  ]);

  const next = () => setIdx((i) => (i + 1) % images.length);
  const prev = () => setIdx((i) => (i - 1 + images.length) % images.length);
  const hasMultipleImages = images.length > 1;

  const uf = project.desdeUF;
  const waPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";
  const waText = `Hola, me interesa ${project.titulo} (${project.comuna}). ¿Podemos coordinar una asesoría gratuita?`;
  const waHref = `https://wa.me/${waPhone}?text=${encodeURIComponent(waText)}`;
  const brochureLink = brochureUrl || fallbackBrochure;
  const brochureIsPdf = /\.pdf(?:\?|$)/i.test(brochureLink);
  const descripcion =
    project.descripcion?.trim() ||
    "Consulta con nuestro equipo para conocer todos los detalles de este proyecto.";
  const entregaLabel =
    project.entrega === "inmediata"
      ? "Entrega inmediata"
      : project.entrega.replace("_", " ");

  return (
    <Modal open={open} onClose={onClose} title={project.titulo}>
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Galería */}
        <div className="relative h-80 w-full overflow-hidden rounded-tr-2xl md:h-[28rem]">
          <SafeImage
            src={images[idx]}
            alt={project.titulo}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {hasMultipleImages && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 px-3 py-2 text-brand-navy shadow-lg transition hover:bg-white"
                aria-label="Ver imagen anterior"
              >
                ‹
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/85 px-3 py-2 text-brand-navy shadow-lg transition hover:bg-white"
                aria-label="Ver imagen siguiente"
              >
                ›
              </button>
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                {images.map((src, i) => (
                  <button
                    key={src}
                    onClick={() => setIdx(i)}
                    className={`h-2 w-6 rounded-full transition ${
                      i === idx ? "bg-brand-gold" : "bg-white/60"
                    }`}
                    aria-label={`Ir a imagen ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Detalles */}
        <div className="flex flex-col gap-4 p-6">
          <div className="rounded-2xl bg-[rgba(237,201,103,0.14)] p-4">
            {project.entrega === "inmediata" && (
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-mute">
                {entregaLabel}
              </p>
            )}
            <p className="mt-1 text-sm text-brand-mute">
              {project.comuna} · {project.tipologias.join(" / ")}
            </p>
          </div>

          <div className="rounded-2xl border border-brand-navy/10 bg-white/90 px-4 py-3 shadow-sm">
            <div className="text-xs uppercase tracking-wide text-brand-mute/80">
              Desde
            </div>
            <div className="text-2xl font-semibold text-brand-navy">
              {ufFmt(uf)}
            </div>
          </div>

          <div className="rounded-2xl bg-[rgba(237,201,103,0.12)] p-4 text-sm text-brand-mute">
            {descripcion}
          </div>

          <div className="rounded-2xl border border-brand-navy/10 bg-white/90 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-navy/60">
              Entidades bancarias y mutuarias
            </p>
            <p className="mt-2 text-sm text-brand-mute">
              Te acompañamos en la evaluación con bancos y mutuarias aliadas
              para conseguir financiamiento preferente y condiciones claras.
            </p>
          </div>

          <div className="mt-auto flex flex-wrap items-center gap-2">
            <a
              href={brochureLink}
              target="_blank"
              rel="noopener noreferrer"
              download={brochureIsPdf ? "" : undefined}
              className="rounded-full bg-gradient-to-r from-brand-navy via-brand-gold to-brand-gold px-4 py-2 text-sm font-medium text-white shadow-[0_16px_40px_rgba(237,201,103,0.22)] hover:shadow-[0_20px_50px_rgba(237,201,103,0.28)]"
            >
              Descargar brochure
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/10 px-4 py-2 text-sm font-medium text-brand-green hover:bg-brand-green hover:text-white"
            >
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </Modal>
  );
}

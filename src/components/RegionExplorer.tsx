"use client";

import {
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
  type SVGProps,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import SafeImage from "@/components/SafeImage";

export type RegionCommuneData = {
  id: string;
  name: string;
  displayName: string;
  count: number;
  highlight: string;
  detail: string;
  slug: string;
};

export type RegionCardData = {
  id: string;
  name: string;
  highlight: string;
  detail: string;
  image: string;
  totalProjects: number;
  communes: RegionCommuneData[];
};

type Props = {
  regions: RegionCardData[];
};

function PinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden="true"
      {...props}
    >
      <path
        d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z"
        fill="currentColor"
      />
      <circle cx="12" cy="10" r="2.5" fill="#fff" />
    </svg>
  );
}

function formatProjects(count: number) {
  if (!count || count < 0) return "Proyectos disponibles";
  return `${count} proyecto${count === 1 ? "" : "s"}`;
}

export default function RegionExplorer({ regions }: Props) {
  const [activeId, setActiveId] = useState<string>(regions[0]?.id ?? "");
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const activeRegion = useMemo(() => {
    return regions.find((region) => region.id === activeId) ?? regions[0];
  }, [activeId, regions]);

  const carouselGroups = useMemo(() => {
    if (!activeRegion) return [[]];
    const slides: RegionCommuneData[][] = [];
    const chunkSize = activeRegion.name === "Región Metropolitana" ? 4 : 6;
    for (
      let index = 0;
      index < activeRegion.communes.length;
      index += chunkSize
    ) {
      slides.push(activeRegion.communes.slice(index, index + chunkSize));
    }
    return slides.length > 0 ? slides : [[]];
  }, [activeRegion]);

  function closeModal() {
    setModalOpen(false);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setCarouselIndex(0);
  }, [activeId]);

  useEffect(() => {
    if (!modalOpen) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = overflow;
    };
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    const handleEsc = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [modalOpen]);

  if (!regions.length || !activeRegion) {
    return null;
  }

  const openRegion = (id: string) => {
    setActiveId(id);
    setCarouselIndex(0);
    setModalOpen(true);
  };

  const handleKeyActivate = (
    event: KeyboardEvent<HTMLButtonElement>,
    id: string,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openRegion(id);
    }
  };

  const modalContent =
    mounted && modalOpen && activeRegion
      ? createPortal(
          <div
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#0b1731]/70 backdrop-blur-md px-4 py-10 md:px-8"
            role="dialog"
            aria-modal="true"
            aria-label={`Región ${activeRegion.name} - detalle`}
            onClick={(event) => {
              if (event.target === event.currentTarget) {
                closeModal();
              }
            }}
          >
            <div className="relative mx-auto flex w-full max-w-6xl overflow-hidden rounded-[44px] border border-white/25 bg-white/75 shadow-[0_60px_160px_rgba(10,24,54,0.45)] backdrop-blur-[30px]">
              <div className="relative hidden w-[42%] overflow-hidden bg-brand-navy/90 md:block">
                <SafeImage
                  src={activeRegion.image}
                  alt={activeRegion.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1600px) 40vw, 640px"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0e1c3f]/55 via-[#0f274f]/38 to-[#061023]/55" />
                <div className="relative flex h-full flex-col justify-between p-10 text-white">
                  <div className="space-y-5">
                    <span className="inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-white/80">
                      Región
                    </span>
                    <h2 className="text-4xl font-semibold leading-tight">
                      {activeRegion.name}
                    </h2>
                    <p className="text-sm font-semibold uppercase tracking-[0.28em] text-white/60">
                      {activeRegion.highlight}
                    </p>
                    <p className="text-sm text-white/85">
                      {activeRegion.detail}
                    </p>
                  </div>
                  <div className="space-y-2 text-sm text-white/70">
                    <p>{formatProjects(activeRegion.totalProjects)}</p>
                    <p>Selecciona una comuna para abrir su vitrina.</p>
                  </div>
                </div>
              </div>
              <div className="relative flex w-full flex-col bg-white/90 backdrop-blur-xl md:w-[58%]">
                <div className="relative block md:hidden">
                  <SafeImage
                    src={activeRegion.image}
                    alt={activeRegion.name}
                    width={1200}
                    height={800}
                    className="h-48 w-full object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#0e1c3f]/40 via-transparent to-white" />
                </div>
                <div className="flex items-center justify-between gap-6 border-b border-brand-navy/10 px-6 py-5 md:px-8 md:py-6">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.38em] text-brand-navy/50">
                      Región seleccionada
                    </p>
                    <h3 className="mt-1 text-2xl font-semibold text-brand-navy md:text-[30px]">
                      {activeRegion.name}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-navy/15 bg-white/90 text-brand-navy transition hover:bg-brand-navy hover:text-white"
                    aria-label="Cerrar vitrina regional"
                  >
                    <span className="text-xl leading-none transition group-hover:rotate-90">
                      ×
                    </span>
                  </button>
                </div>
                <div className="flex-1 px-6 py-6 md:px-8 md:py-8">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.32em] text-brand-navy/50">
                      Comunas con proyectos activos
                    </p>
                    {carouselGroups.length > 1 && (
                      <div className="flex items-center gap-3 text-brand-navy/60">
                        <button
                          type="button"
                          onClick={() =>
                            setCarouselIndex((prev) =>
                              prev === 0 ? carouselGroups.length - 1 : prev - 1,
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-navy/15 bg-white/90 transition hover:bg-brand-navy hover:text-white"
                          aria-label="Anterior"
                        >
                          ‹
                        </button>
                        <span className="text-xs font-semibold uppercase tracking-[0.28em]">
                          {String(carouselIndex + 1).padStart(2, "0")}/
                          {String(carouselGroups.length).padStart(2, "0")}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setCarouselIndex((prev) =>
                              prev === carouselGroups.length - 1 ? 0 : prev + 1,
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-navy/15 bg-white/90 transition hover:bg-brand-navy hover:text-white"
                          aria-label="Siguiente"
                        >
                          ›
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="relative overflow-hidden rounded-[30px] border border-brand-navy/10 bg-white/92 shadow-[0_22px_70px_rgba(14,33,73,0.1)]">
                    <div
                      className="flex transition-transform duration-500"
                      style={{
                        transform: `translateX(-${carouselIndex * 100}%)`,
                      }}
                    >
                      {carouselGroups.map((slide, slideIndex) => (
                        <div
                          key={`slide-${slideIndex}`}
                          className="grid w-full flex-shrink-0 grid-cols-1 gap-4 p-6 sm:grid-cols-2"
                          style={{ minWidth: "100%" }}
                        >
                          {slide.map((commune) => (
                            <div
                              key={commune.id}
                              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[24px] border border-brand-navy/10 bg-white/96 p-5 shadow-[0_16px_55px_rgba(14,33,73,0.08)] transition hover:-translate-y-1 hover:border-brand-gold/35 hover:shadow-[0_24px_70px_rgba(14,33,73,0.12)]"
                            >
                              <div className="flex items-start gap-3 text-brand-navy">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-navy/10 text-brand-navy">
                                  <PinIcon />
                                </span>
                                <div>
                                  <h4 className="text-base font-semibold leading-tight">
                                    {commune.displayName}
                                  </h4>
                                  <span className="text-[11px] uppercase tracking-[0.32em] text-brand-navy/50">
                                    {formatProjects(commune.count)}
                                  </span>
                                </div>
                              </div>
                              <div className="mt-3 space-y-2">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-navy/55">
                                  {commune.highlight}
                                </p>
                                <p className="text-sm text-brand-mute">
                                  {commune.detail}
                                </p>
                              </div>
                              <Link
                                href={`/proyectos?comuna=${commune.slug}`}
                                className="mt-4 inline-flex items-center justify-center rounded-full border border-brand-navy/12 bg-brand-navy px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white transition hover:bg-brand-gold hover:text-brand-navy"
                              >
                                Ver proyectos
                              </Link>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                  {activeRegion.communes.length === 0 && (
                    <p className="mt-6 rounded-2xl border border-brand-navy/10 bg-white/80 p-6 text-sm text-brand-mute">
                      Estamos actualizando los proyectos de esta región. Vuelve
                      pronto para descubrir nuevas oportunidades.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div className="relative space-y-12">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {regions.map((region, index) => {
          const isActive = region.id === activeRegion.id;

          return (
            <button
              key={region.id}
              type="button"
              aria-pressed={isActive}
              aria-haspopup="dialog"
              onClick={() => openRegion(region.id)}
              onKeyDown={(event) => handleKeyActivate(event, region.id)}
              className={`group relative h-[320px] overflow-hidden rounded-[34px] border border-white/30 bg-white/20 shadow-[0_26px_80px_rgba(14,33,73,0.12)] backdrop-blur-md transition focus:outline-none focus:ring-4 focus:ring-brand-gold/40 ${
                isActive
                  ? "border-brand-gold/60 shadow-[0_34px_90px_rgba(14,33,73,0.2)]"
                  : "hover:-translate-y-1.5 hover:border-brand-gold/30 hover:shadow-[0_32px_90px_rgba(14,33,73,0.18)]"
              }`}
            >
              <SafeImage
                src={region.image}
                alt={region.name}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                priority={index < 2}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-[#0e2149]/38 via-[#0f274f]/32 to-[#0c1735]/26" />
              <div className="relative flex h-full flex-col justify-between p-8 text-left text-white">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/70">
                        Región
                      </p>
                      <h3 className="mt-1 text-2xl font-semibold leading-tight md:text-[28px]">
                        {region.name}
                      </h3>
                    </div>
                    <span className="rounded-full bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                      {formatProjects(region.totalProjects)}
                    </span>
                  </div>
                  <p className="text-sm font-semibold uppercase tracking-[0.26em] text-white/70">
                    {region.highlight}
                  </p>
                  <p className="text-sm text-white/85">{region.detail}</p>
                </div>
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span>Explorar comunas</span>
                  <span
                    className={`text-lg transition-transform ${
                      isActive ? "rotate-45" : ""
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
      {modalContent}
    </div>
  );
}

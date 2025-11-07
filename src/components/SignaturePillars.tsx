"use client";

import { type KeyboardEvent, type MouseEvent, useState } from "react";
import SafeImage from "@/components/SafeImage";

const MOMENTS = [
  {
    // 1) Título/descr. reemplazados con el bloque de abajo
    title: "DISEÑAMOS CONTIGO EL CAMINO IDEAL PARA TU PRÓXIMA PROPIEDAD",
    description:
      'Conversamos sobre tus metas, tiempos y presupuesto para presentarte opciones reales que se adapten a ti. "Tu inversión comienza con una asesoría gratuita, transparente y cercana".',
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1600&auto=format&fit=crop",
    tag: "Plan personal",
    modal: {
      title: "Mapa claro desde el principio",
      description:
        "Conversamos 30 minutos para fijar objetivos y métricas de éxito. Dejamos documentado un plan de acción personalizado.",
      bullets: [
        "Segmentamos comunas y tipologías según retorno y estilo de vida.",
        "Definimos capacidad de inversión y financiamiento con escenarios realistas.",
        "Compartimos checklist de documentos y próximos hitos.",
      ],
    },
  },
  {
    // 2) Reemplazo
    title: "TE MOSTRAMOS LAS MEJORES OPCIONES DEL MERCADO",
    description:
      'Recibes acompañamiento personalizado de principio a fin: te ayudamos a encontrar el proyecto perfecto, conseguir tu financiamiento y resolver cada duda con total claridad. "Tú eliges con libertad, nosotros te guiamos con experiencia".',
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
    tag: "Selección guiada",
    modal: {
      title: "Una vitrina que se siente tuya",
      description:
        "Reunimos la información clave y la presentamos simple, destacando oportunidades y riesgos que vemos en cada proyecto.",
      bullets: [
        "Videos y recorridos comentados por nuestro equipo.",
        "Indicadores financieros listos: UF, dividendos, arriendo y gastos.",
        "Radar de alertas (permisos, constructora, calidad de entrega).",
      ],
    },
  },
  {
    // 3) Reemplazo
    title: "TE ACOMPAÑAMOS HASTA LA FIRMA... Y DESPUÉS.",
    description:
      'Nos encargamos de cada detalle para que tu experiencia sea fluida, clara y sin estrés. "Queremos que disfrutes el proceso tanto como el resultado".',
    image:
      "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=1600&auto=format&fit=crop",
    tag: "Cierre experto",
    modal: {
      title: "Firma segura y sin sorpresas",
      description:
        "Coordinamos notaría, escrituración y relacionamiento con bancos. También te apoyamos en seguros y administración.",
      bullets: [
        "Revisión legal punto por punto antes de firmar.",
        "Negociación de condiciones comerciales y beneficios adicionales.",
        "Seguimiento postventa con calendario de hitos y contactos útiles.",
      ],
    },
  },
];

export default function SignaturePillars() {
  const [active, setActive] = useState<number | null>(null);
  const activeIndex = typeof active === "number" ? active : null;
  const openMoment =
    typeof activeIndex === "number" ? MOMENTS[activeIndex] : null;
  const totalSteps = MOMENTS.length;
  const progressPercent =
    activeIndex !== null ? ((activeIndex + 1) / totalSteps) * 100 : 0;
  const handleClose = (event?: MouseEvent<HTMLElement>) => {
    event?.stopPropagation();
    setActive(null);
  };
  const handleNavigate = (
    direction: "prev" | "next",
    event?: MouseEvent<HTMLElement>,
  ) => {
    event?.stopPropagation();
    if (activeIndex === null) return;
    const delta = direction === "next" ? 1 : -1;
    const nextIndex = (activeIndex + delta + totalSteps) % totalSteps;
    setActive(nextIndex);
  };

  const handleCardKey = (event: KeyboardEvent<HTMLElement>, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setActive(index);
    }
  };

  return (
    <section className="relative w-full py-20">
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-sunrise-blur blur-[140px]" />
      <div className="mx-auto max-w-7xl px-6">
        <header className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
            SOMOS <span className="tracking-normal">VR</span> INMOBILIARIA
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-snug text-brand-navy md:text-[2.6rem]">
            CERCANÍA REAL, DECISIONES INTELIGENTES
          </h2>
          <p className="mt-3 text-sm text-brand-mute md:text-base">
            En VR Inmobiliaria te acompañamos con asesoría gratuita, humana,
            claridad y respaldo en cada paso para que invertir o comprar tu
            hogar sea una experiencia segura y satisfactoria.
          </p>
        </header>
      </div>

      {/* Horizontal timeline */}
      <div className="relative mt-16 w-full overflow-hidden border-y border-white/10 bg-[#050b15] py-16 text-white shadow-[0_60px_160px_rgba(3,9,24,0.65)]">
        <div className="timeline-glow pointer-events-none absolute inset-0" />
        <div className="timeline-ribbon pointer-events-none absolute inset-0 opacity-40" />
        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8 px-6 md:px-10">
          <div className="flex flex-col gap-3 text-sm uppercase tracking-[0.3em] text-white/60 md:flex-row md:items-center md:justify-between">
            <span>Experiencia VR en 3 momentos clave</span>
            <span className="text-white/40">
              Desliza ↔ para explorar cada etapa
            </span>
          </div>
          <div className="relative">
            <div className="timeline-beam pointer-events-none absolute left-0 right-0 top-[78px] hidden h-[2px] -translate-y-1/2 opacity-60 lg:block" />
            <div className="relative overflow-x-auto pb-12 pt-10">
              <div className="flex min-w-max gap-8 snap-x snap-mandatory">
                {MOMENTS.map(({ title, description, image, tag }, index) => (
                  <article
                    key={title}
                    role="button"
                    tabIndex={0}
                    onClick={() => setActive(index)}
                    onKeyDown={(event) => handleCardKey(event, index)}
                    aria-label={`Abrir detalles de ${title}`}
                    className="group relative w-[280px] snap-center rounded-[36px] border border-white/10 bg-white/5 px-4 pb-6 pt-8 text-left backdrop-blur transition hover:-translate-y-1 hover:border-brand-gold/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-gold/40 md:w-[320px]"
                  >
                    <span className="pointer-events-none absolute left-1/2 top-3 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-gradient-to-br from-brand-gold to-white shadow-[0_0_15px_rgba(237,201,103,0.9)] lg:inline-block" />
                    <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.4em] text-white/60">
                      <span>Paso</span>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    </div>
                    <div className="mt-4 h-36 w-full overflow-hidden rounded-[26px] border border-white/10 bg-white/5 shadow-[0_25px_70px_rgba(4,8,20,0.6)]">
                      <SafeImage
                        src={image}
                        alt={title}
                        fill
                        className="object-cover transition duration-[1200ms] group-hover:scale-[1.08]"
                        sizes="(max-width: 768px) 80vw, 20vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <span className="absolute left-4 top-4 inline-flex rounded-full border border-white/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/90 backdrop-blur">
                        {tag}
                      </span>
                    </div>
                    <div className="mt-5 space-y-3">
                      <h3 className="text-lg font-semibold leading-snug text-white">
                        {title}
                      </h3>
                      <p className="text-xs leading-relaxed text-white/70">
                        {description}
                      </p>
                    </div>
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-white/55">
                      <span className="inline-flex items-center gap-1">
                        Ruta VR
                        <span
                          className="h-[2px] w-10 bg-gradient-to-r from-brand-gold to-transparent"
                          aria-hidden="true"
                        />
                      </span>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setActive(index);
                        }}
                        className="inline-flex items-center gap-2 rounded-full border border-white/25 px-3 py-1 text-[10px] tracking-[0.35em] text-white transition hover:border-brand-gold hover:text-brand-gold"
                      >
                        Ver +
                        <svg
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.4}
                          className="h-3 w-3"
                          aria-hidden="true"
                        >
                          <path d="M5 10h9" />
                          <path d="m10 5 5 5-5 5" />
                        </svg>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {openMoment ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-10"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-brand-navy/70 backdrop-blur" />
          <div
            className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[40px] border border-white/20 bg-white text-brand-navy shadow-[0_45px_120px_rgba(16,36,74,0.35)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-brand-navy/15 text-brand-navy/60 transition hover:border-brand-gold hover:text-brand-gold"
              aria-label="Cerrar detalle"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                className="h-4 w-4"
              >
                <path d="M5 5l10 10M15 5 5 15" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Ver etapa anterior"
              onClick={(event) => handleNavigate("prev", event)}
              className="modal-chevron absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-brand-navy/15 bg-white/80 p-2 text-brand-navy shadow-[0_10px_30px_rgba(16,36,74,0.15)] transition hover:-translate-x-1 hover:border-brand-gold/60 md:left-5"
              style={{ animationDirection: "alternate-reverse" }}
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                className="-scale-x-100 transform"
              >
                <path d="M5 10h9" />
                <path d="m10 5 5 5-5 5" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Ver etapa siguiente"
              onClick={(event) => handleNavigate("next", event)}
              className="modal-chevron absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-brand-navy/15 bg-white/80 p-2 text-brand-navy shadow-[0_10px_30px_rgba(16,36,74,0.15)] transition hover:translate-x-1 hover:border-brand-gold/60 md:right-5"
            >
              <svg
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
              >
                <path d="M5 10h9" />
                <path d="m10 5 5 5-5 5" />
              </svg>
            </button>
            <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
              <div className="flex flex-col border-b border-brand-navy/10 bg-brand-sand/30 md:border-b-0 md:border-r">
                <div className="relative aspect-[4/3] overflow-hidden md:aspect-[5/4]">
                  <SafeImage
                    src={openMoment.image}
                    alt={openMoment.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 30vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute left-5 right-5 top-5 flex flex-wrap items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-white">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 backdrop-blur">
                      Paso{" "}
                      {activeIndex !== null
                        ? String(activeIndex + 1).padStart(2, "0")
                        : "—"}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-white/35 px-3 py-1">
                      {openMoment.tag}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-6 p-6 md:p-8">
                <h3 className="text-3xl font-semibold leading-tight text-brand-navy md:text-[2.1rem]">
                  {openMoment.modal.title}
                </h3>
                <p className="text-sm leading-relaxed text-brand-navy/75">
                  {openMoment.modal.description}
                </p>
                <ul className="space-y-3 text-sm text-brand-navy">
                  {openMoment.modal.bullets.map((item, idx) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 rounded-2xl border border-brand-navy/10 bg-white/85 px-4 py-3 shadow-[0_12px_26px_rgba(16,36,74,0.08)]"
                    >
                      <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-gold to-brand-sand text-[11px] font-semibold text-brand-navy">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex items-center gap-2 rounded-full border border-brand-navy/10 px-5 py-2 text-sm font-semibold text-brand-navy transition hover:border-brand-gold/60"
                  >
                    Listo
                  </button>
                  <button
                    type="button"
                    onClick={handleClose}
                    className="inline-flex items-center gap-2 rounded-full border border-brand-gold/60 bg-gradient-to-r from-brand-gold via-brand-sand to-brand-gold px-5 py-2 text-sm font-semibold text-brand-navy shadow-[0_20px_40px_rgba(237,201,103,0.4)] transition hover:-translate-y-[1px]"
                  >
                    Agendar coordinación
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.6}
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="M5 10h9" />
                      <path d="m10 5 5 5-5 5" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

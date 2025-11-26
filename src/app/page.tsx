import Link from "next/link";
import HeroPortal from "@/components/HeroPortal";
import FeaturedProjectCard from "@/components/FeaturedProjectCard";
import BrowseByComuna from "@/components/BrowseByComuna";
import TestimonialsShowcase from "@/components/TestimonialsShowcase";
import ContactBanner from "@/components/ContactBanner";
import AnimatedCounter from "@/components/AnimatedCounter";
import { fetchFeaturedProjects } from "@/lib/featuredProjects";
import TypewriterHeadline from "@/components/TypewriterHeadline";

const INSIGHTS = [
  {
    categoria: "Guía 2025",
    titulo: "Cómo invertir en renta residencial con UF estabilizada",
    descripcion:
      "Revisa escenarios de dividendo versus arriendo y descubre estrategias para asegurar cashflow positivo.",
  },
  {
    categoria: "Tendencia",
    titulo: "Cinco comunas que lideran el desarrollo urbano mixto",
    descripcion:
      "Providencia, Ñuñoa y más zonas están atrayendo proyectos que mezclan vivienda, servicios y amenities de alto nivel.",
  },
  {
    categoria: "Checklist Legal",
    titulo: "Documentos clave antes de firmar promesa",
    descripcion:
      "Desde estados de pago hasta permisos de edificación. Repasamos lo que revisamos en cada proyecto recomendado.",
  },
];

export default async function HomePage() {
  const destacados = await fetchFeaturedProjects();
  const benefits = [
    "Apoyo al pie de hasta 15% (en proyectos seleccionados)",
    "Crédito interno o Creditú de hasta 10%",
    "Evaluación hipotecaria gratuita",
    "Gestión integral y seguimiento de tu crédito",
    "Asesoramiento personalizado y sin costo en nuestros proyectos",
    "Arriendo garantizado por hasta 24 meses",
    "VR Inmobiliaria — tu aliado para invertir con confianza.",
  ];

  return (
    <>
      {/* HERO */}
      <HeroPortal />

      {/* SECCIÓN: PROYECTOS DESTACADOS */}
      <section className="pb-16 pt-12">
        {/* 2) Header + Grid */}
        <div className="mx-auto mt-0 max-w-6xl px-6">
          <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
                Selección personalizada
              </p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-brand-navy md:text-4xl">
                PROYECTOS SELECCIONADOS POR SU VALOR, DISEÑO Y PROYECCIÓN
              </h2>
              <p className="mt-3 text-sm text-brand-mute md:text-base">
                Te presentamos opciones con excelente ubicación, financiamiento
                flexible y respaldo profesional, para invertir o vivir con
                tranquilidad.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/proyectos"
                className="inline-flex items-center justify-center rounded-full border border-brand-navy/15 bg-gradient-to-r from-brand-navy via-brand-gold to-brand-gold px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(237,201,103,0.2)] transition hover:shadow-[0_22px_60px_rgba(237,201,103,0.28)]"
              >
                Explorar proyectos
              </Link>
              <a
                href="#beneficios"
                className="inline-flex items-center justify-center rounded-full border border-brand-navy bg-brand-navy px-5 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_rgba(14,33,73,0.2)] transition hover:bg-brand-navy/90 hover:text-white hover:shadow-[0_20px_48px_rgba(14,33,73,0.28)]"
                style={{ backgroundColor: "#0E2149", color: "#F7F7F7" }}
              >
                Conoce nuestros beneficios
              </a>
            </div>
          </header>

          <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((p) => (
              <FeaturedProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>

        {/* 3) Bloque Beneficios */}
        <div
          id="beneficios"
          className="benefits-atrium relative mt-24 w-full overflow-hidden py-24 text-white sm:mt-28 lg:mt-32"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#080d1e] via-[#0a1832] to-[#050a18]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[-20%] top-[-35%] h-[420px] bg-[radial-gradient(60%_75%_at_50%_40%,rgba(255,255,255,0.22),rgba(255,255,255,0.05)_55%,transparent)] opacity-80"
          />
          <div className="relative z-10 mx-auto max-w-[1400px] px-6 sm:px-12 md:px-16">
            <div className="grid items-end gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.45em] text-brand-gold/90">
                  <span className="h-px w-12 bg-gradient-to-r from-transparent via-brand-gold/70 to-brand-gold/90" />
                  <span>Beneficios en VR Inmobiliaria</span>
                </div>
                <TypewriterHeadline
                  className="text-[34px] font-semibold md:text-[50px]"
                  text={`En VR Inmobiliaria te acompañamos con soluciones reales y\nasesoría experta para que concretar tu inversión sea más fácil que nunca.`}
                />
                <p className="text-sm text-white/80 md:text-base">Ofrecemos:</p>
              </div>
              <div className="justify-self-start lg:justify-self-end">
                <div className="flex flex-col gap-6 rounded-3xl border border-white/12 bg-white/10 px-10 py-10 text-white shadow-[0_26px_60px_rgba(5,9,24,0.5)] backdrop-blur-2xl">
                  <div className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/65">
                    Programa integral
                  </div>
                  <div className="flex items-end gap-4">
                    <span className="text-6xl font-semibold text-white">
                      {String(benefits.length).padStart(2, "0")}
                    </span>
                    <span className="pb-2 text-[11px] font-semibold uppercase tracking-[0.65em] text-white/60">
                      Beneficios
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative mt-16">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-[-8%] inset-y-[-12%] -z-10 rounded-[48px] border border-white/5"
              />
              <div className="benefits-grid relative grid max-w-none gap-8 text-white/85 sm:grid-cols-2 lg:grid-cols-3">
                {benefits.map((benefit, index) => {
                  const isTrailingFeature =
                    benefits.length % 3 === 1 && index === benefits.length - 1;

                  return (
                    <article
                      key={benefit}
                      className={`benefit-flow group flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/[0.07] px-10 py-10 pl-12 text-left backdrop-blur-[22px] transition duration-500 ease-out hover:-translate-y-1 hover:border-white/40 hover:bg-white/10 hover:text-white ${
                        isTrailingFeature
                          ? "lg:col-span-3 lg:flex-row lg:items-center lg:gap-10 lg:px-14 lg:py-12"
                          : ""
                      }`}
                      style={{ animationDelay: `${index * 0.12}s` }}
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="text-[36px] font-semibold leading-none tracking-[-0.08em] text-white">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">
                          / Ventaja clave
                        </span>
                      </span>
                      <p className="text-lg font-medium leading-relaxed text-white lg:flex-1">
                        {benefit}
                      </p>
                      <span className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-gold/90 transition duration-500 group-hover:translate-x-1 group-hover:text-white">
                        Confianza VR
                        <span
                          className="h-px w-8 bg-gradient-to-r from-brand-gold/90 to-transparent"
                          aria-hidden="true"
                        />
                      </span>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROPÓSITO + MÉTRICAS */}
      <section className="px-6 py-6">
        <div className="purpose-suite relative mx-auto max-w-[960px]">
          <span
            aria-hidden="true"
            className="purpose-suite__halo pointer-events-none absolute inset-[-12%] rounded-[80px]"
          />
          <div className="purpose-suite__grid relative z-10">
            <div className="purpose-suite__story">
              <div className="purpose-suite__story-top">
                <span aria-hidden="true" />
                <span>Propósito</span>
                <span aria-hidden="true" />
                <span>Estilo</span>
                <span aria-hidden="true" />
              </div>
              <TypewriterHeadline
                className="purpose-suite__headline text-[24px] font-semibold leading-tight md:text-[32px]"
                text={`INVIERTE CON PROPÓSITO,\nVIVE CON ESTILO`}
                duration={2800}
              />
              <div className="purpose-suite__note">
                <span className="purpose-suite__note-pill">
                  Proyectos únicos, beneficios exclusivos.
                </span>
              </div>
            </div>
            <div className="purpose-suite__metrics">
              <div className="purpose-suite__metrics-copy">
                <p className="label">Confianza</p>
                <h3>
                  Cada número representa una historia de confianza auténtica.
                </h3>
                <p>
                  Métricas que reflejan la experiencia de quienes nos eligen
                  para gestionar sus inversiones y nuevos hogares.
                </p>
              </div>
              <div className="purpose-suite__metrics-cards">
                <article className="metric-chip metric-chip--hero">
                  <AnimatedCounter
                    value={180}
                    suffix="+"
                    className="block text-3xl font-semibold text-white md:text-[36px]"
                  />
                  <p>
                    Familias e inversionistas concretaron su proyecto con VR
                    Inmobiliaria.
                  </p>
                </article>
                <article className="metric-chip metric-chip--accent">
                  <AnimatedCounter
                    value={96}
                    suffix="%"
                    className="block text-2xl font-semibold text-brand-navy md:text-[30px]"
                  />
                  <p>
                    Califican nuestra atención como excepcional por su cercanía
                    y personalización.
                  </p>
                </article>
                <article className="metric-chip">
                  <span className="flex items-baseline gap-1 text-2xl font-semibold text-brand-navy md:text-[30px]">
                    <AnimatedCounter value={24} className="leading-none" />
                    <span className="text-base font-medium uppercase tracking-[0.3em] text-brand-navy/70 md:text-lg">
                      hrs
                    </span>
                  </span>
                  <p>
                    Tiempo máximo para recibir respuesta de un asesor
                    especializado.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: EXPLORA POR COMUNA */}
      <BrowseByComuna />

      {/* Insights */}
      <section
        className="hidden mx-auto max-w-7xl px-6 py-20"
        aria-hidden="true"
      >
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
            Insights y guías
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-brand-navy md:text-4xl">
            Decisiones informadas con el Observatorio VR Inmobiliaria.
          </h2>
          <p className="mt-4 text-base text-brand-mute">
            Accede a análisis exclusivos del mercado inmobiliario de Santiago,
            pensados para inversionistas y compradores exigentes.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {INSIGHTS.map((insight) => (
            <article
              key={insight.titulo}
              className="flex h-full flex-col gap-4 rounded-3xl border border-brand-navy/10 bg-white/85 p-6 shadow-[0_18px_50px_rgba(14,33,73,0.07)] transition hover:-translate-y-1 hover:border-brand-gold/25"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-gold">
                {insight.categoria}
              </span>
              <h3 className="text-lg font-semibold text-brand-navy">
                {insight.titulo}
              </h3>
              <p className="text-sm text-brand-mute">{insight.descripcion}</p>
              <button className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-brand-navy hover:opacity-80">
                Leer artículo →
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Testimonios */}
      <TestimonialsShowcase />

      {/* CTA final */}
      <ContactBanner />
    </>
  );
}

import Link from "next/link";
import HeroPortal from "@/components/HeroPortal";
import FeaturedProjectCard from "@/components/FeaturedProjectCard";
import BrowseByComuna from "@/components/BrowseByComuna";
import TestimonialsShowcase from "@/components/TestimonialsShowcase";
import ContactBanner from "@/components/ContactBanner";
import AnimatedCounter from "@/components/AnimatedCounter";
import { fetchFeaturedProjects } from "@/lib/featuredProjects";

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
        <div className="benefits-atrium relative w-full overflow-hidden py-16 text-white">
          <div className="relative z-10 mx-auto flex max-w-[1400px] flex-col gap-12 px-6 sm:px-12 md:px-16 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-brand-gold/80">
                Beneficios en VR Inmobiliaria
              </p>
              <h3 className="font-display text-[36px] font-semibold leading-tight text-white md:text-[46px]">
                En VR Inmobiliaria te acompañamos con soluciones reales y
                asesoría experta para que concretar tu inversión sea más fácil
                que nunca.
              </h3>
              <p className="text-sm text-white/80 md:text-base">Ofrecemos:</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/50">
              <span>Programa integral</span>
              <span className="hidden h-px flex-1 bg-white/25 sm:block" />
              <span>{String(benefits.length).padStart(2, "0")} beneficios</span>
            </div>
          </div>
          <div className="benefits-grid relative z-10 mx-auto mt-12 grid max-w-[1400px] gap-10 px-6 text-white/75 sm:grid-cols-2 sm:px-12 lg:grid-cols-3 lg:px-16">
            {benefits.map((benefit, index) => (
              <article
                key={benefit}
                className="benefit-flow group flex flex-col gap-3 pl-8 text-left transition duration-500 ease-out hover:-translate-y-1 hover:text-white"
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.35em] text-white/45">
                  {String(index + 1).padStart(2, "0")} / Ventaja clave
                </span>
                <p className="text-base font-medium leading-relaxed text-white transition-colors duration-500 group-hover:text-brand-gold">
                  {benefit}
                </p>
                <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-brand-gold/80 transition duration-500 group-hover:translate-x-1 group-hover:text-white">
                  Confianza VR
                  <span
                    className="h-[1px] w-10 bg-gradient-to-r from-brand-gold to-transparent"
                    aria-hidden="true"
                  />
                </span>
              </article>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-7xl px-6">
          <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
                Selección personalizado
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
            <Link
              href="/proyectos"
              className="inline-flex items-center justify-center rounded-full border border-brand-navy/15 bg-gradient-to-r from-brand-navy via-brand-gold to-brand-gold px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(237,201,103,0.2)] transition hover:shadow-[0_22px_60px_rgba(237,201,103,0.28)]"
            >
              Explorar proyectos
            </Link>
          </header>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {destacados.map((p) => (
              <FeaturedProjectCard key={p.id} project={p} />
            ))}
          </div>
        </div>
      </section>

      {/* SECCIÓN: PROPÓSITO */}
      <section className="px-6 py-16">
        <div className="purpose-banner relative mx-auto max-w-7xl overflow-hidden rounded-[56px] px-8 py-16 text-center text-white md:px-16 md:text-left">
          <div className="purpose-rings" aria-hidden="true" />
          <div className="purpose-orbit" aria-hidden="true" />
          <div className="relative z-10 grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(280px,0.8fr)] md:items-center">
            <div className="space-y-6">
              <h3 className="font-display text-[34px] font-semibold leading-tight tracking-[0.08em] uppercase md:text-[46px]">
                INVIERTE CON PROPÓSITO,
                <span className="block text-[32px] tracking-[0.2em] text-white/85 md:text-[40px]">
                  VIVE CON ESTILO
                </span>
              </h3>
            </div>
            <div className="purpose-pill rounded-[999px] border border-white/40 bg-white/80 px-8 py-6 shadow-[0_25px_80px_rgba(10,23,56,0.25)] backdrop-blur">
              <p className="text-base font-medium text-brand-navy/80 md:text-lg">
                Proyectos únicos, beneficios exclusivos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: ESTADÍSTICAS */}
      <section className="px-6 py-20">
        <div className="metrics-lab relative mx-auto max-w-7xl overflow-hidden rounded-[48px] px-8 py-16 md:px-16">
          <div className="metrics-grid relative z-10 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div className="space-y-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.5em] text-brand-gold/80">
                Confianza
              </p>
              <h3 className="text-2xl font-semibold text-brand-navy md:text-[34px] md:leading-[1.2]">
                Cada número representa una historia de confianza auténtica.
              </h3>
              <p className="text-sm text-brand-mute">
                Métricas que reflejan la experiencia de quienes nos eligen para
                gestionar sus inversiones y nuevos hogares.
              </p>
            </div>
            <div className="metric-track grid gap-5 sm:grid-cols-3">
              <article className="metric-tile">
                <div className="metric-node">
                  <AnimatedCounter
                    value={180}
                    suffix="+"
                    className="block text-4xl font-semibold text-brand-navy md:text-[42px]"
                  />
                  <p className="text-sm text-brand-mute">
                    Familias e inversionistas concretaron su proyecto con VR
                    Inmobiliaria.
                  </p>
                </div>
              </article>
              <article className="metric-tile">
                <div className="metric-node">
                  <AnimatedCounter
                    value={96}
                    suffix="%"
                    className="block text-4xl font-semibold text-brand-navy md:text-[42px]"
                  />
                  <p className="text-sm text-brand-mute">
                    Califican nuestra atención como excepcional por su cercanía
                    y personalización.
                  </p>
                </div>
              </article>
              <article className="metric-tile">
                <div className="metric-node">
                  <span className="flex items-baseline gap-1 text-4xl font-semibold text-brand-navy md:text-[42px]">
                    <AnimatedCounter value={24} className="leading-none" />
                    <span className="text-base font-medium uppercase tracking-[0.3em] text-brand-navy/70 md:text-lg">
                      hrs
                    </span>
                  </span>
                  <p className="text-sm text-brand-mute">
                    Tiempo máximo para recibir respuesta de un asesor
                    especializado.
                  </p>
                </div>
              </article>
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

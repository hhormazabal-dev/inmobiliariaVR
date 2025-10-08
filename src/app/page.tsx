import HeroPortal from "@/components/HeroPortal";
import ProjectCard from "@/components/ProjectCard";
import BrowseByComuna from "@/components/BrowseByComuna";
import TrustStrip from "@/components/TrustStrip";
import SignaturePillars from "@/components/SignaturePillars";
import TestimonialsShowcase from "@/components/TestimonialsShowcase";
import ContactBanner from "@/components/ContactBanner";
import type { Project } from "@/types/project";

const DESTACADOS: Project[] = [
  {
    id: "1",
    slug: "neo-yungay-santiago",
    titulo: "Neo Yungay",
    comuna: "Santiago Centro",
    desdeUF: 2141,
    tipologias: ["1D", "2D"],
    entrega: "en_verde",
    arriendoGarantizado: true,
    creditoInterno: true,
    imagen:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    slug: "alto-nunoa",
    titulo: "Alto Ñuñoa",
    comuna: "Ñuñoa",
    desdeUF: 2950,
    tipologias: ["Studio", "1D", "2D"],
    entrega: "inmediata",
    imagen:
      "https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "3",
    slug: "providencia-hub",
    titulo: "Providencia Hub",
    comuna: "Providencia",
    desdeUF: 3320,
    tipologias: ["2D", "3D"],
    entrega: "en_blanco",
    imagen:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1200&auto=format&fit=crop",
  },
];

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
      "Providencia, Ñuñoa y más zonas están atrayendo proyectos que mezclan vivienda, servicios y amenities premium.",
  },
  {
    categoria: "Checklist Legal",
    titulo: "Documentos clave antes de firmar promesa",
    descripcion:
      "Desde estados de pago hasta permisos de edificación. Repasamos lo que revisamos en cada proyecto recomendado.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <HeroPortal />

      {/* SECCIÓN: PROYECTOS DESTACADOS */}
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-12">
        <header className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
              Selección boutique
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-brand-navy md:text-4xl">
              Proyectos que combinan ubicación, diseño y potencial de valorización.
            </h2>
            <p className="mt-3 text-sm text-brand-mute md:text-base">
              Explora las unidades que seleccionamos hoy para vivir o invertir con tranquilidad.
            </p>
          </div>
          <a
            href="/proyectos"
            className="inline-flex items-center justify-center rounded-full border border-brand-navy/15 bg-white px-5 py-3 text-sm font-semibold text-brand-navy shadow-sm transition hover:border-brand-navy/35 hover:shadow-lg"
          >
            Ver todos los proyectos
          </a>
        </header>

        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {DESTACADOS.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      {/* FRANJA DE CONFIANZA */}
      <TrustStrip />

      {/* Pilares */}
      <SignaturePillars />

      {/* SECCIÓN: EXPLORA POR COMUNA */}
      <BrowseByComuna />

      {/* Insights */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
            Insights y guías
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold text-brand-navy md:text-4xl">
            Decisiones informadas con el Observatorio VREYES.
          </h2>
          <p className="mt-4 text-base text-brand-mute">
            Accede a análisis exclusivos del mercado inmobiliario de Santiago, pensados para
            inversionistas y compradores exigentes.
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
              <h3 className="text-lg font-semibold text-brand-navy">{insight.titulo}</h3>
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

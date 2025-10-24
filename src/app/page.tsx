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
          <a
            href="/proyectos"
            className="inline-flex items-center justify-center rounded-full border border-brand-navy/15 bg-gradient-to-r from-brand-navy via-brand-gold to-brand-gold px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(212,175,55,0.2)] transition hover:shadow-[0_22px_60px_rgba(212,175,55,0.28)]"
          >
            Explorar proyectos
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

      {/* SECCIÓN: PROPÓSITO */}
      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="rounded-[36px] border border-brand-navy/10 bg-white/85 px-6 py-12 text-center shadow-[0_24px_70px_rgba(14,33,73,0.08)] md:px-16">
          <h2 className="font-display text-3xl font-semibold uppercase tracking-[0.08em] text-brand-navy md:text-4xl">
            INVIERTE CON PROPÓSITO, VIVE CON ESTILO
          </h2>
          <p className="mt-4 text-base text-brand-mute">
            Proyectos únicos, beneficios exclusivos.
          </p>
        </div>
      </section>

      {/* Pilares */}
      <SignaturePillars />

      {/* SECCIÓN: ESTADÍSTICAS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-[36px] border border-brand-navy/10 bg-white/85 px-6 py-12 shadow-[0_24px_70px_rgba(14,33,73,0.08)] md:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
            Confianza
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-brand-navy md:text-3xl">
            Cada número representa una historia de confianza:
          </h3>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            <div className="flex flex-col gap-3 rounded-3xl border border-white/60 bg-white/80 p-6 text-brand-navy shadow-[0_18px_50px_rgba(14,33,73,0.06)] backdrop-blur-xl">
              <span className="text-4xl font-semibold text-brand-gold">
                180+
              </span>
              <p className="text-sm text-brand-mute">
                Familias e inversionistas que concretaron su proyecto con
                nosotros.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-3xl border border-white/60 bg-white/80 p-6 text-brand-navy shadow-[0_18px_50px_rgba(14,33,73,0.06)] backdrop-blur-xl">
              <span className="text-4xl font-semibold text-brand-gold">
                96%
              </span>
              <p className="text-sm text-brand-mute">
                Recomiendan VR Inmobiliaria por nuestra atención personalizada.
              </p>
            </div>
            <div className="flex flex-col gap-3 rounded-3xl border border-white/60 bg-white/80 p-6 text-brand-navy shadow-[0_18px_50px_rgba(14,33,73,0.06)] backdrop-blur-xl">
              <span className="text-4xl font-semibold text-brand-gold">
                24 hrs
              </span>
              <p className="text-sm text-brand-mute">
                Promedio para recibir respuesta de un asesor.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN: NOSOTROS */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="rounded-[36px] border border-brand-navy/10 bg-white/90 px-6 py-12 shadow-[0_24px_70px_rgba(14,33,73,0.08)] md:px-12 md:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
            Nosotros
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold text-brand-navy md:text-4xl">
            MÁS QUE UNA INMOBILIARIA, SOMOS TU EQUIPO DE CONFIANZA
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-brand-mute">
            En VR Inmobiliaria creemos que cada cliente merece una experiencia
            transparente, cercana y personalizada. Nuestro compromiso es
            acompañarte desde el primer contacto hasta la entrega de tu
            departamento, guiándote con empatía, conocimiento y respaldo
            financiero.
          </p>
          <p className="mt-6 text-base font-semibold text-brand-navy">
            &quot;Cuando confías en quienes te acompañan, todo el proceso se
            convierte en una experiencia más humana&quot;.
          </p>
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

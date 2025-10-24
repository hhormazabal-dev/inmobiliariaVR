import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Tenía claridad en el presupuesto pero no en el proyecto. La comparativa que prepararon en VR Inmobiliaria nos ahorró semanas. Sentí acompañamiento real.",
    author: "María José · Providencia",
    role: "Compradora primera vivienda",
  },
  {
    quote:
      "Invertí en departamentos para renta y el equipo se preocupó de la estructura financiera completa, incluso de la postventa. El estándar es muy superior.",
    author: "Felipe · Ñuñoa",
    role: "Inversionista inmobiliario",
  },
];

export default function TestimonialsShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="rounded-3xl border border-white/70 bg-white/85 px-6 py-14 shadow-[0_24px_70px_rgba(14,33,73,0.08)] md:px-12">
        <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
          <header className="max-w-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
              Lo que dicen nuestros clientes
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-brand-navy md:text-4xl">
              Experiencias reales de acompañamiento premium.
            </h2>
            <p className="mt-4 text-base text-brand-mute">
              Historias de quienes confiaron en VR Inmobiliaria para elegir
              hogar o potenciar su portafolio.
            </p>
          </header>

          <div className="grid flex-1 grid-cols-1 gap-6 md:grid-cols-2">
            {TESTIMONIALS.map(({ quote, author, role }) => (
              <figure
                key={author}
                className="flex h-full flex-col gap-6 rounded-3xl border border-brand-navy/10 bg-white/90 p-6 shadow-[0_18px_50px_rgba(14,33,73,0.06)] transition hover:-translate-y-1 hover:border-brand-gold/25"
              >
                <Quote className="h-8 w-8 text-brand-gold" strokeWidth={1.4} />
                <blockquote className="text-base leading-relaxed text-brand-navy/90">
                  {quote}
                </blockquote>
                <figcaption className="mt-auto">
                  <p className="text-sm font-semibold text-brand-navy">
                    {author}
                  </p>
                  <p className="text-xs uppercase tracking-[0.25em] text-brand-mute/70">
                    {role}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

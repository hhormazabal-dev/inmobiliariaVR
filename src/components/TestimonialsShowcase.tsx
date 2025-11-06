"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  {
    quote:
      "Buscaba una segunda vivienda en la costa y el equipo se encargó de coordinar visitas, negociar el precio y asegurar beneficios exclusivos. Todo muy transparente.",
    author: "Daniela · Concón",
    role: "Familia segunda vivienda",
  },
  {
    quote:
      "Necesitábamos vender rápido para comprar un departamento más grande. VR nos ayudó con la tasación, financiamiento y cierre en menos de 45 días.",
    author: "Jorge y Camila · La Florida",
    role: "Upgrade familiar",
  },
  {
    quote:
      "Soy médico y tenía poco tiempo para ver proyectos. La asesoría remota, la información financiera y el seguimiento semanal me dieron confianza total.",
    author: "Francisca · Puerto Montt",
    role: "Profesional independiente",
  },
  {
    quote:
      "Vivo fuera de Chile y quería invertir desde el extranjero. Manejan todo el proceso digitalmente y me mantuvieron al tanto con reportes claros.",
    author: "Rodrigo · Miami",
    role: "Inversionista chileno en el exterior",
  },
  {
    quote:
      "El equipo levantó toda la documentación, gestionó el crédito y acompañó la escrituración. Sentí que tenía un aliado en cada paso.",
    author: "Carolina · Temuco",
    role: "Compradora primera vivienda",
  },
  {
    quote:
      "Compararon barrios, analizaron rentas y nos ayudaron a planificar un portafolio de tres propiedades. La mirada estratégica marca la diferencia.",
    author: "Ignacio · Rancagua",
    role: "Inversionista estructurado",
  },
];

const BACKDROP_VIDEOS = ["/100.mp4", "/101.mp4"];

export default function TestimonialsShowcase() {
  const [videoIndex, setVideoIndex] = useState(0);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setVideoIndex((current) => (current + 1) % BACKDROP_VIDEOS.length);
    }, 12000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setOffset((current) => (current + 2) % TESTIMONIALS.length);
    }, 12000);
    return () => window.clearInterval(interval);
  }, []);

  const visibleTestimonials = [
    TESTIMONIALS[offset % TESTIMONIALS.length],
    TESTIMONIALS[(offset + 1) % TESTIMONIALS.length],
  ];

  return (
    <section className="relative mt-16 w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.video
            key={videoIndex}
            src={BACKDROP_VIDEOS[videoIndex]}
            autoPlay
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b1633]/65 via-[#111f3d]/55 to-[#152544]/70" />
        <div className="absolute inset-0 bg-white/8 backdrop-blur-[6px]" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 md:flex-row md:items-start md:justify-between">
        <header className="max-w-sm space-y-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">
            Lo que dicen nuestros clientes
          </p>
          <h2 className="font-display text-3xl font-semibold leading-tight md:text-4xl">
            Experiencias reales de acompañamiento premium.
          </h2>
          <p className="text-sm text-white/85 md:text-base">
            Historias de quienes confiaron en VR Inmobiliaria para elegir hogar
            o potenciar su portafolio.
          </p>
        </header>

        <div className="relative flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={offset}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="grid h-full grid-cols-1 gap-6 md:grid-cols-2"
            >
              {visibleTestimonials.map(({ quote, author, role }) => (
                <figure
                  key={author}
                  className="flex h-full flex-col gap-6 rounded-[24px] border border-white/20 bg-white/15 px-6 py-7 text-white shadow-[0_22px_60px_rgba(8,16,40,0.22)] backdrop-blur-[18px] transition hover:-translate-y-1 hover:border-brand-gold/40 hover:shadow-[0_28px_76px_rgba(8,16,40,0.3)]"
                >
                  <Quote
                    className="h-8 w-8 text-brand-gold"
                    strokeWidth={1.4}
                  />
                  <blockquote className="text-base leading-relaxed text-white/90">
                    {quote}
                  </blockquote>
                  <figcaption className="mt-auto space-y-1">
                    <p className="text-sm font-semibold">{author}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-white/70">
                      {role}
                    </p>
                  </figcaption>
                </figure>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

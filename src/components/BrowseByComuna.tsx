"use client";

import Link from "next/link";
import Image from "next/image";

type Item = {
  nombre: string;
  slug: string;
  proyectos?: number;
  imagen: string;
  highlight: string;
  detalle: string;
};

const COMUNAS: Item[] = [
  {
    nombre: "Santiago Centro",
    slug: "Santiago%20Centro",
    proyectos: 18,
    imagen: "https://images.unsplash.com/photo-1494783367193-149034c05e8f?q=80&w=1400&auto=format&fit=crop",
    highlight: "Corazón cultural y corporativo",
    detalle: "Departamentos compactos, full conectividad y alta demanda de arriendo.",
  },
  {
    nombre: "Ñuñoa",
    slug: "%C3%91u%C3%B1oa",
    proyectos: 12,
    imagen: "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?q=80&w=1400&auto=format&fit=crop",
    highlight: "Barrio creativo + vida de barrio",
    detalle: "Plazas, cafés y ciclo rutas con valorización sostenida los últimos años.",
  },
  {
    nombre: "Providencia",
    slug: "Providencia",
    proyectos: 9,
    imagen: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1400&auto=format&fit=crop",
    highlight: "Eje premium y servicios",
    detalle: "Un mix de oficinas, retail y residencias con ticket alto y liquidez.",
  },
  {
    nombre: "La Florida",
    slug: "La%20Florida",
    proyectos: 7,
    imagen: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=1400&auto=format&fit=crop",
    highlight: "Crecimiento al suroriente",
    detalle: "Proyectos familiares cerca de estaciones de metro y polos comerciales.",
  },
  {
    nombre: "San Miguel",
    slug: "San%20Miguel",
    proyectos: 6,
    imagen: "https://images.unsplash.com/photo-1502005097973-6a7082348e28?q=80&w=1400&auto=format&fit=crop",
    highlight: "Mix residencial & conectividad",
    detalle: "Unidades de inversión con buena plusvalía y acceso directo a Línea 2.",
  },
  {
    nombre: "Independencia",
    slug: "Independencia",
    proyectos: 5,
    imagen: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?q=80&w=1400&auto=format&fit=crop",
    highlight: "Renovación urbana",
    detalle: "Departamentos nuevos, cercanías universitarias y ticket accesible.",
  },
];

function PinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" fill="currentColor"/>
      <circle cx="12" cy="10" r="2.5" fill="#fff"/>
    </svg>
  );
}

export default function BrowseByComuna() {
  return (
    <section className="relative mx-auto mt-10 max-w-7xl overflow-hidden rounded-[40px] border border-white/60 px-6 py-16 shadow-[0_28px_80px_rgba(14,33,73,0.12)]">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1487956382158-bb926046304a?q=80&w=2200&auto=format&fit=crop"
          alt="Santiago skyline at dusk"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/90 via-white/88 to-[#f3f6fb]/92" />
      </div>
      <span className="pointer-events-none absolute -left-20 top-10 h-64 w-64 rounded-full bg-brand-gold/20 blur-[140px]" />
      <span className="pointer-events-none absolute -right-24 bottom-10 h-60 w-60 rounded-full bg-brand-navy/20 blur-[130px]" />
      <header className="relative mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
          Comunas en foco
        </p>
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold text-brand-navy md:text-4xl">
            Vive donde crece tu estilo de vida.
          </h2>
          <p className="mt-3 text-sm text-brand-mute md:text-base">
            Zona norte, oriente o sur: curamos las comunas con mejor conectividad, rentabilidad y experiencias diarias.
          </p>
        </div>
        <div className="inline-flex items-center gap-3 rounded-full border border-brand-navy/10 bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-brand-navy/70">
          Actualizado 2025
        </div>
      </header>

      <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {COMUNAS.map((c) => (
          <Link
            key={c.slug}
            href={`/proyectos?comuna=${c.slug}`}
            className="group relative overflow-hidden rounded-[30px] border border-white/20 bg-white/20 shadow-[0_24px_70px_rgba(14,33,73,0.14)] backdrop-blur-lg transition hover:-translate-y-1.5 hover:border-brand-gold/30 hover:shadow-[0_32px_90px_rgba(14,33,73,0.18)] focus:outline-none focus:ring-4 focus:ring-brand-gold/40"
          >
            <Image
              src={c.imagen}
              alt={c.nombre}
              fill
              className="object-cover brightness-[0.7] transition duration-700 group-hover:scale-105 group-hover:brightness-[0.9]"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0e2149]/70 via-[#0f274f]/55 to-[#111827]/30" />
            <div className="relative flex h-full flex-col justify-between p-6">
              <div className="flex items-center gap-4 text-white/90">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white">
                  <PinIcon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{c.nombre}</h3>
                  <p className="text-xs text-white/70">
                    {typeof c.proyectos === "number"
                      ? `${c.proyectos} proyecto${c.proyectos === 1 ? "" : "s"}`
                      : "Proyectos disponibles"}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                  {c.highlight}
                </p>
                <p className="text-sm text-white/85">{c.detalle}</p>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold text-white">
                <span>Ver vitrina</span>
                <span className="h-[2px] w-9 origin-left rounded bg-brand-gold transition-transform group-hover:scale-x-150" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

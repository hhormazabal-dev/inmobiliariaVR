"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Image from "next/image";

const COMUNAS = [
  "Santiago Centro",
  "Ñuñoa",
  "Providencia",
  "La Florida",
  "Maipú",
  "San Miguel",
  "Independencia",
];

export default function HeroPortal() {
  const router = useRouter();
  const [comuna, setComuna] = useState("");
  const [ufMin, setUfMin] = useState("");
  const [ufMax, setUfMax] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (comuna) params.set("comuna", comuna);
    if (ufMin) params.set("ufMin", ufMin);
    if (ufMax) params.set("ufMax", ufMax);
    router.push(`/proyectos?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden rounded-br-[80px] bg-[#f6f0e7]">
      {/* Fondo */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=2200&auto=format&fit=crop"
          alt="Panorámica de departamentos con vista a Santiago"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#f6f0e7f5] via-[#f6f1eaed] to-[#f6f0e700]" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent" />
      </div>

      {/* Headline centrado superior */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: "easeOut" }}
        className="relative z-10 mx-auto max-w-5xl px-6 pt-10 text-center md:pt-16"
      >
        <h2 className="inline-block rounded-full border border-brand-gold/40 bg-white/70 px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-navy shadow-sm md:text-xs">
          REINVENTAMOS LA FORMA DE INVERTIR Y ELEGIR TU HOGAR
        </h2>
      </motion.div>

      {/* Flechas decorativas (solo desktop) */}
      <div className="pointer-events-none absolute left-6 top-6 hidden h-20 w-20 text-brand-navy/50 md:block">
        <svg viewBox="0 0 70 70" fill="none" className="h-full w-full">
          <path
            d="M66 10c-18 6-28 12-40 26"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M19 33l6 1m-6-1l3-5"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="pointer-events-none absolute right-10 bottom-24 hidden h-20 w-20 text-brand-navy/50 md:block">
        <svg
          viewBox="0 0 70 70"
          fill="none"
          className="h-full w-full rotate-12"
        >
          <path
            d="M6 60c18-6 28-12 40-26"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M51 37l-6-1m6 1l-3 5"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start gap-10 px-6 pb-10 pt-8 md:flex-row md:items-center md:gap-16 md:pb-16 md:pt-10">
        <div className="max-w-xl">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mt-4 font-display text-4xl font-semibold leading-tight text-brand-navy md:mt-6 md:text-6xl"
          >
            Asesoría de autor para elegir tu próximo hogar en Santiago.
          </motion.h1>

          {/* (Párrafo eliminado a tu solicitud) */}

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: "easeOut" }}
            className="mt-10 grid gap-8 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,41,84,0.08)] backdrop-blur-2xl md:max-w-xl"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-mute">
                  Comuna
                </label>
                <select
                  value={comuna}
                  onChange={(e) => setComuna(e.target.value)}
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-brand-navy shadow-sm transition focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/25"
                >
                  <option value="">Todas</option>
                  {COMUNAS.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-mute">
                  UF mínima
                </label>
                <input
                  type="number"
                  value={ufMin}
                  onChange={(e) => setUfMin(e.target.value)}
                  placeholder="2.000"
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-brand-navy shadow-sm transition focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/25"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-brand-mute">
                  UF máxima
                </label>
                <input
                  type="number"
                  value={ufMax}
                  onChange={(e) => setUfMax(e.target.value)}
                  placeholder="3.500"
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm text-brand-navy shadow-sm transition focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/25"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-navy via-brand-gold to-brand-gold px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-[0_20px_40px_rgba(212,175,55,0.25)]"
            >
              <Search className="h-4 w-4" />
              Buscar proyectos seleccionados
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="grid w-full max-w-sm gap-6 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,41,84,0.07)] backdrop-blur-2xl md:max-w-xs"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-gold">
              Resultados reales
            </p>
            <p className="mt-2 text-sm text-brand-mute">
              Tu inversión comienza con asesoría transparente y cercana. Estamos
              contigo en cada paso.
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-4xl font-semibold text-brand-gold">
                180+
              </span>
              <p className="mt-1 text-sm text-brand-mute">
                Familias e inversionistas que concretaron su proyecto con
                nosotros.
              </p>
            </div>
            <div>
              <span className="text-4xl font-semibold text-brand-gold">
                96%
              </span>
              <p className="mt-1 text-sm text-brand-mute">
                Recomiendan VR Inmobiliaria por nuestra atención personalizada.
              </p>
            </div>
            <div>
              <span className="text-4xl font-semibold text-brand-gold">
                24 hrs
              </span>
              <p className="mt-1 text-sm text-brand-mute">
                Promedio para recibir respuesta de un asesor.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Línea de apoyo centrada inferior (se mantiene) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
        className="relative z-10 mx-auto max-w-5xl px-6 pb-12 text-center md:pb-16"
      >
        <p className="text-base leading-relaxed text-brand-mute md:text-lg">
          Te acompañamos a descubrir el hogar o inversión ideal dentro de
          nuestros proyectos, con asesoría inmobiliaria gratuita, cercana y
          diseñada para ti.
        </p>
      </motion.div>
    </section>
  );
}

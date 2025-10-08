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

      {/* Contenido principal */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start gap-10 px-6 py-28 md:flex-row md:items-center md:gap-16 md:py-36">
        <div className="max-w-xl">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center rounded-full border border-brand-gold/40 bg-white/70 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-navy shadow-sm"
          >
            Vivienda & inversión 2025
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mt-6 font-display text-4xl font-semibold leading-tight text-brand-navy md:text-6xl"
          >
            Asesoría de autor para elegir tu próximo hogar en Santiago.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: "easeOut" }}
            className="mt-6 text-base leading-relaxed text-brand-mute md:text-lg"
          >
            Curamos proyectos en comunas estratégicas, combinando datos y sensaciones para que
            compares solo lo esencial. Agenda online, recibe insights de inversión y vive un proceso
            impecable de principio a fin.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: "easeOut" }}
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
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-navy px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:shadow-[0_18px_30px_rgba(14,33,73,0.18)]"
            >
              <Search className="h-4 w-4" />
              Buscar proyectos seleccionados
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="grid w-full max-w-sm gap-6 rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,41,84,0.07)] backdrop-blur-2xl md:max-w-xs"
        >
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-gold">
              Confianza
            </p>
            <p className="mt-2 text-sm text-brand-mute">
              Más que fichas: entregamos comparativas, asesoría legal y acompañamiento financiero.
            </p>
          </div>
          <div className="flex flex-col gap-5">
            <div>
              <span className="text-4xl font-semibold text-brand-navy">180+</span>
              <p className="mt-1 text-sm text-brand-mute">Unidades colocadas en los últimos 18 meses.</p>
            </div>
            <div>
              <span className="text-4xl font-semibold text-brand-navy">96%</span>
              <p className="mt-1 text-sm text-brand-mute">Clientes que recomiendan la experiencia VREYES.</p>
            </div>
            <div>
              <span className="text-4xl font-semibold text-brand-navy">24h</span>
              <p className="mt-1 text-sm text-brand-mute">Tiempo promedio para recibir agenda con un asesor senior.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

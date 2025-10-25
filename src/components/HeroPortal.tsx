"use client";

import { useState, type CSSProperties } from "react";
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

  const heroPattern: CSSProperties = {
    backgroundImage:
      "linear-gradient(135deg, transparent 0, transparent calc(100% - 3px), rgba(212,175,55,0.32) calc(100% - 3px)), linear-gradient(135deg, rgba(14,33,73,0.22) 0 3px, transparent 3px), linear-gradient(225deg, transparent 0, transparent calc(100% - 2px), rgba(14,33,73,0.24) calc(100% - 2px)), linear-gradient(225deg, rgba(212,175,55,0.22) 0 2px, transparent 2px)",
    backgroundSize: "280px 180px, 280px 180px, 220px 160px, 220px 160px",
    backgroundPosition: "top right, top right, bottom left, bottom left",
    backgroundRepeat: "no-repeat",
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (comuna) params.set("comuna", comuna);
    if (ufMin) params.set("ufMin", ufMin);
    if (ufMax) params.set("ufMax", ufMax);
    router.push(`/proyectos?${params.toString()}`);
  };

  return (
    <section
      className="relative overflow-hidden rounded-br-[80px] bg-[#f6f0e7]"
      style={heroPattern}
    >
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

      {/* Líneas estructurales (decorativas) */}
      <div className="pointer-events-none absolute inset-0 hidden md:block">
        <span className="absolute top-16 right-16 h-24 w-px bg-brand-gold/60" />
        <span className="absolute top-16 right-16 h-px w-28 bg-brand-navy/50" />
        <span className="absolute bottom-16 left-20 h-24 w-px bg-brand-navy/35" />
        <span className="absolute bottom-16 left-20 h-px w-32 bg-brand-gold/45" />
        <span className="absolute bottom-24 left-36 h-12 w-24 border border-brand-navy/15" />
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
            Reinventamos la forma de invertir y elegir tu próximo hogar en
            Santiago.
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

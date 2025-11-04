"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { prettifyName } from "@/lib/territoryMeta";

const HERO_VIDEOS = ["/1.mp4", "/2.mp4", "/4.mp4"];
const titleLines = [
  "Reinventamos la forma de invertir",
  "y elegir tu próximo hogar en Santiago.",
];

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const containerVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: easeOutCubic, staggerChildren: 0.18 },
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.85, ease: easeOutCubic },
  },
};

const subtitleVariants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeOutCubic },
  },
};

export default function HeroPortal() {
  const router = useRouter();
  const [comuna, setComuna] = useState("");
  const [ufMin, setUfMin] = useState("");
  const [ufMax, setUfMax] = useState("");
  const [availableComunas, setAvailableComunas] = useState<string[]>([]);
  const [fetchedUfMin, setFetchedUfMin] = useState<number | null>(null);
  const [fetchedUfMax, setFetchedUfMax] = useState<number | null>(null);
  const [videoIndex, setVideoIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [overlayKey, setOverlayKey] = useState(0);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (comuna) params.set("comuna", comuna);
    if (ufMin) params.set("ufMin", ufMin);
    if (ufMax) params.set("ufMax", ufMax);
    router.push(`/proyectos?${params.toString()}`);
  };

  useEffect(() => {
    async function loadCatalogMeta() {
      try {
        const res = await fetch("/api/catalog/comunas", { cache: "no-store" });
        if (!res.ok) {
          return;
        }
        const data = (await res.json()) as {
          comunas?: string[];
          uf?: { min: number | null; max: number | null };
        };
        if (Array.isArray(data.comunas) && data.comunas.length > 0) {
          setAvailableComunas(
            data.comunas
              .filter((item): item is string => Boolean(item))
              .map((name) => name.trim())
              .sort((a, b) => a.localeCompare(b, "es")),
          );
        }
        if (data.uf) {
          setFetchedUfMin(
            typeof data.uf.min === "number" ? Math.floor(data.uf.min) : null,
          );
          setFetchedUfMax(
            typeof data.uf.max === "number" ? Math.ceil(data.uf.max) : null,
          );
        }
      } catch (error) {
        console.error("[HeroPortal] Error cargando metadatos:", error);
      }
    }

    loadCatalogMeta();
  }, []);

  useEffect(() => {
    const firstVideo = videoRefs.current[0];
    if (firstVideo) {
      firstVideo.currentTime = 0;
      const playPromise = firstVideo.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise.catch(() => {
          // autoplay blocked; user interaction will resume playback
        });
      }
    }
  }, []);

  const handleVideoEnded = () => {
    const nextIndex = (videoIndex + 1) % HERO_VIDEOS.length;
    const nextVideo = videoRefs.current[nextIndex];
    const currentVideoEl = videoRefs.current[videoIndex];
    if (!nextVideo) {
      setVideoIndex(nextIndex);
      return;
    }

    setOverlayKey((prev) => prev + 1);
    nextVideo.currentTime = 0;
    const playPromise = nextVideo.play();
    const proceed = () => {
      setVideoIndex(nextIndex);
      if (currentVideoEl) {
        window.setTimeout(() => {
          currentVideoEl.pause();
        }, 1400);
      }
    };
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.then(proceed).catch(proceed);
    } else {
      proceed();
    }
  };

  return (
    <section className="relative overflow-hidden rounded-br-[80px] bg-[#f6f0e7]">
      {/* Fondo */}
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          {HERO_VIDEOS.map((src, idx) => (
            <motion.video
              key={src}
              ref={(el) => {
                videoRefs.current[idx] = el;
              }}
              className="absolute inset-0 h-full w-full object-cover"
              src={src}
              muted
              playsInline
              preload="auto"
              onEnded={() => {
                if (idx === videoIndex) handleVideoEnded();
              }}
              initial={false}
              animate={{ opacity: idx === videoIndex ? 1 : 0 }}
              transition={{ duration: 1.4, ease: easeInOutCubic }}
            />
          ))}
        </div>
        <AnimatePresence mode="wait">
          {overlayKey > 0 && (
            <motion.div
              key={overlayKey}
              className="absolute inset-0 pointer-events-none bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.28, 0] }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 1.2,
                times: [0, 0.35, 1],
                ease: easeInOutCubic,
              }}
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/4" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/5 to-black/16" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-start gap-10 px-6 pb-10 pt-8 md:flex-row md:items-center md:gap-16 md:pb-16 md:pt-10">
        <div className="max-w-xl">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mt-6 space-y-6 md:mt-8"
          >
            <motion.span
              variants={lineVariants}
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.42em] text-white/80 backdrop-blur-sm"
            >
              Asesoría inmobiliaria Personalizado
            </motion.span>
            <motion.h1
              variants={lineVariants}
              className="font-display text-4xl font-semibold tracking-tight text-white leading-[1.18] md:text-6xl md:leading-[1.12]"
            >
              {titleLines.map((line, idx) => (
                <motion.span
                  key={line}
                  variants={lineVariants}
                  className={`block text-balance leading-[1.12] ${
                    idx === titleLines.length - 1
                      ? "bg-gradient-to-r from-white via-white to-brand-gold/70 bg-clip-text text-transparent drop-shadow-[0_12px_28px_rgba(0,0,0,0.25)]"
                      : "text-white drop-shadow-[0_16px_30px_rgba(0,0,0,0.28)]"
                  }`}
                >
                  {line}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p
              variants={subtitleVariants}
              className="max-w-lg text-sm font-medium text-white/80 md:text-base md:leading-relaxed"
            >
              Te acompañamos a descubrir el hogar o inversión ideal dentro de
              nuestros proyectos, con asesoría inmobiliaria gratuita, cercana y
              diseñada para ti.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: easeOutCubic }}
            className="mt-10 grid gap-8 rounded-[36px] border border-white/30 bg-white/10 p-6 shadow-[0_28px_80px_rgba(8,12,28,0.22)] backdrop-blur-2xl md:max-w-xl"
          >
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/70">
                  Comuna
                </label>
                <select
                  value={comuna}
                  onChange={(e) => setComuna(e.target.value)}
                  className="w-full rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm text-white shadow-[0_8px_22px_rgba(8,12,28,0.22)] transition focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
                >
                  <option value="">Todas</option>
                  {(availableComunas.length > 0
                    ? availableComunas
                    : ["Santiago Centro", "Providencia", "Ñuñoa", "La Florida"]
                  ).map((c) => (
                    <option key={c} value={c}>
                      {prettifyName(c)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/70">
                  UF mínima
                </label>
                <input
                  type="number"
                  value={ufMin}
                  onChange={(e) => setUfMin(e.target.value)}
                  placeholder={
                    fetchedUfMin !== null
                      ? fetchedUfMin.toLocaleString("es-CL")
                      : "2.000"
                  }
                  className="w-full rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm text-white shadow-[0_8px_22px_rgba(8,12,28,0.22)] transition placeholder:text-white/60 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white/70">
                  UF máxima
                </label>
                <input
                  type="number"
                  value={ufMax}
                  onChange={(e) => setUfMax(e.target.value)}
                  placeholder={
                    fetchedUfMax !== null
                      ? fetchedUfMax.toLocaleString("es-CL")
                      : "3.500"
                  }
                  className="w-full rounded-xl border border-white/40 bg-white/10 px-4 py-2.5 text-sm text-white shadow-[0_8px_22px_rgba(8,12,28,0.22)] transition placeholder:text-white/60 focus:border-brand-gold/60 focus:outline-none focus:ring-2 focus:ring-brand-gold/30"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSearch}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/40 bg-white/15 px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_32px_rgba(8,12,28,0.28)] transition hover:shadow-[0_18px_48px_rgba(8,12,28,0.34)]"
            >
              <Search className="h-4 w-4" />
              Buscar proyectos seleccionados
            </motion.button>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 mx-auto hidden w-full max-w-6xl items-center justify-between px-6 pb-10 md:flex md:pb-14">
        <span className="h-px flex-1 bg-white/10" />
        <span className="mx-6 inline-flex items-center gap-2 rounded-full border border-white/20 px-3 py-1 text-xs uppercase tracking-[0.38em] text-white/55">
          VR Inmobiliaria
        </span>
        <span className="h-px flex-1 bg-white/10" />
      </div>
    </section>
  );
}

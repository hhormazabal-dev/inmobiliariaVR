"use client";

import { useState } from "react";
import Image from "next/image";

const MOMENTS = [
  {
    // 1) Título/descr. reemplazados con el bloque de abajo
    title: "DISEÑAMOS CONTIGO EL CAMINO IDEAL PARA TU PRÓXIMA PROPIEDAD",
    description:
      'Conversamos sobre tus metas, tiempos y presupuesto para presentarte opciones reales que se adapten a ti. "Tu inversión comienza con una asesoría transparente y cercana".',
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1600&auto=format&fit=crop",
    tag: "Plan personal",
    modal: {
      title: "Mapa claro desde el principio",
      description:
        "Conversamos 30 minutos para fijar objetivos y métricas de éxito. Dejamos documentado un plan de acción personalizado.",
      bullets: [
        "Segmentamos comunas y tipologías según retorno y estilo de vida.",
        "Definimos capacidad de inversión y financiamiento con escenarios realistas.",
        "Compartimos checklist de documentos y próximos hitos.",
      ],
    },
  },
  {
    // 2) Reemplazo
    title: "TE MOSTRAMOS LAS MEJORES OPCIONES DEL MERCADO",
    description:
      'Recibes acompañamiento personalizado de principio a fin: te ayudamos a encontrar el proyecto perfecto, conseguir tu financiamiento y resolver cada duda con total claridad. "Tú eliges con libertad, nosotros te guiamos con experiencia".',
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1600&auto=format&fit=crop",
    tag: "Selección curada",
    modal: {
      title: "Una vitrina que se siente tuya",
      description:
        "Reunimos la información clave y la presentamos simple, destacando oportunidades y riesgos que vemos en cada proyecto.",
      bullets: [
        "Videos y recorridos comentados por nuestro equipo.",
        "Indicadores financieros listos: UF, dividendos, arriendo y gastos.",
        "Radar de alertas (permisos, constructora, calidad de entrega).",
      ],
    },
  },
  {
    // 3) Reemplazo
    title: "TE ACOMPAÑAMOS HASTA LA FIRMA... Y DESPUÉS.",
    description:
      'Nos encargamos de cada detalle para que tu experiencia sea fluida, clara y sin estrés. "Queremos que disfrutes el proceso tanto como el resultado".',
    image:
      "https://images.unsplash.com/photo-1525182008055-f88b95ff7980?q=80&w=1600&auto=format&fit=crop",
    tag: "Cierre experto",
    modal: {
      title: "Firma segura y sin sorpresas",
      description:
        "Coordinamos notaría, escrituración y relacionamiento con bancos. También te apoyamos en seguros y administración.",
      bullets: [
        "Revisión legal punto por punto antes de firmar.",
        "Negociación de condiciones comerciales y beneficios adicionales.",
        "Seguimiento postventa con calendario de hitos y contactos útiles.",
      ],
    },
  },
];

export default function SignaturePillars() {
  const [active, setActive] = useState<number | null>(null);
  const openMoment = typeof active === "number" ? MOMENTS[active] : null;

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20">
      <div className="absolute inset-x-10 top-0 -z-10 h-[420px] rounded-[48px] bg-sunrise-blur blur-[90px]" />
      <header className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
          SOMOS <span className="tracking-normal">VR</span> INMOBILIARIA
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold leading-snug text-brand-navy md:text-[2.6rem]">
          CERCANÍA REAL, DECISIONES INTELIGENTES
        </h2>
        <p className="mt-3 text-sm text-brand-mute md:text-base">
          En VR Inmobiliaria te acompañamos con asesoría humana, claridad y
          respaldo en cada paso para que invertir o comprar tu hogar sea una
          experiencia segura y satisfactoria.
        </p>
      </header>

      {/* Tarjetas con imagen (ya sin duplicados) */}
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {MOMENTS.map(({ title, description, image, tag }, index) => (
          <button
            key={title}
            type="button"
            onClick={() => setActive(index)}
            className="group flex h-full flex-col overflow-hidden rounded-[32px] border border-brand-navy/10 bg-white/85 text-left shadow-[0_20px_60px_rgba(14,33,73,0.08)] transition hover:-translate-y-1 hover:border-brand-gold/30 hover:shadow-[0_28px_80px_rgba(14,33,73,0.14)] focus:outline-none focus:ring-4 focus:ring-brand-gold/40"
            aria-label={`Ver más sobre ${title}`}
          >
            <div className="relative h-56 w-full overflow-hidden">
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover transition duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent" />
              <span className="absolute left-5 top-5 inline-flex rounded-full bg-white/15 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/90 backdrop-blur">
                {tag}
              </span>
            </div>

            <div className="flex flex-1 flex-col justify-between gap-6 p-6">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-brand-navy">
                  {title}
                </h3>
                <p className="text-sm leading-relaxed text-brand-mute">
                  {description}
                </p>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.25em] text-brand-navy/60">
                <span className="rounded-full bg-brand-gold/20 px-4 py-1 text-[10px] text-brand-navy">
                  Siempre a tu lado
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {openMoment ? (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-10"
          onClick={() => setActive(null)}
        >
          <div className="absolute inset-0 bg-brand-navy/45 backdrop-blur-md" />
          <div
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-[36px] border border-white/40 bg-white/20 p-8 text-brand-text shadow-[0_40px_100px_rgba(14,33,73,0.35)] backdrop-blur-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 w-full overflow-hidden rounded-3xl">
              <Image
                src={openMoment.image}
                alt={openMoment.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
              <span className="absolute left-5 top-5 inline-flex rounded-full bg-white/15 px-4 py-1 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/90 backdrop-blur">
                {openMoment.tag}
              </span>
            </div>
            <div className="mt-6 space-y-4 text-brand-navy">
              <div>
                <h3 className="text-2xl font-semibold">
                  {openMoment.modal.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-mute">
                  {openMoment.modal.description}
                </p>
              </div>
              <ul className="space-y-2 text-sm text-brand-navy/90">
                {openMoment.modal.bullets.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span
                      className="mt-[6px] inline-block h-2 w-2 rounded-full bg-brand-gold"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setActive(null)}
                className="rounded-full border border-white/40 bg-white/40 px-5 py-2 text-sm font-semibold text-brand-navy/80 transition hover:bg-white/60"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}

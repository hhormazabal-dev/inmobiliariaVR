"use client";

import Link from "next/link";
import Image from "next/image";
import { useId, useState } from "react";
import Modal from "@/components/ui/Modal";

type CornerLinesProps = {
  pos: "top-right" | "bottom-left";
  size?: number;
  stroke?: number;
  className?: string;
};

function CornerLines({
  pos,
  size = 140,
  stroke = 2,
  className,
}: CornerLinesProps) {
  const uid = useId().replace(/[^a-z0-9-]/gi, "");
  const isTopRight = pos === "top-right";
  const length = size * 0.68;

  const horizontalStart = isTopRight ? size - length : 0;
  const horizontalEnd = isTopRight ? size : length;
  const horizontalY = isTopRight ? stroke / 2 : size - stroke / 2;

  const verticalStart = isTopRight ? 0 : size - length;
  const verticalEnd = isTopRight ? length : size;
  const verticalX = isTopRight ? size - stroke / 2 : stroke / 2;

  const shadowOffset = stroke + 2;
  const shadowHorizontalY = isTopRight
    ? horizontalY + shadowOffset
    : horizontalY - shadowOffset;
  const shadowVerticalX = isTopRight
    ? verticalX - shadowOffset
    : verticalX + shadowOffset;

  const positionClass = isTopRight ? "top-0 right-0" : "bottom-0 left-0";

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden="true"
      className={`pointer-events-none absolute ${positionClass} opacity-80 ${className ?? ""}`}
      fill="none"
    >
      <defs>
        <linearGradient
          id={`${uid}-gold-h`}
          x1={horizontalStart}
          y1={horizontalY}
          x2={horizontalEnd}
          y2={horizontalY}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="rgba(237,201,103,0.88)" />
          <stop offset="1" stopColor="rgba(237,201,103,0)" />
        </linearGradient>
        <linearGradient
          id={`${uid}-gold-v`}
          x1={verticalX}
          y1={verticalStart}
          x2={verticalX}
          y2={verticalEnd}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="rgba(237,201,103,0.88)" />
          <stop offset="1" stopColor="rgba(237,201,103,0)" />
        </linearGradient>
        <linearGradient
          id={`${uid}-shadow-h`}
          x1={horizontalStart}
          y1={shadowHorizontalY}
          x2={horizontalEnd}
          y2={shadowHorizontalY}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="rgba(14,33,73,0.16)" />
          <stop offset="1" stopColor="rgba(14,33,73,0)" />
        </linearGradient>
        <linearGradient
          id={`${uid}-shadow-v`}
          x1={shadowVerticalX}
          y1={verticalStart}
          x2={shadowVerticalX}
          y2={verticalEnd}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="rgba(14,33,73,0.16)" />
          <stop offset="1" stopColor="rgba(14,33,73,0)" />
        </linearGradient>
      </defs>

      <line
        x1={horizontalStart}
        y1={horizontalY}
        x2={horizontalEnd}
        y2={horizontalY}
        stroke={`url(#${uid}-gold-h)`}
        strokeWidth={stroke}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={verticalX}
        y1={verticalStart}
        x2={verticalX}
        y2={verticalEnd}
        stroke={`url(#${uid}-gold-v)`}
        strokeWidth={stroke}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={horizontalStart}
        y1={shadowHorizontalY}
        x2={horizontalEnd}
        y2={shadowHorizontalY}
        stroke={`url(#${uid}-shadow-h)`}
        strokeWidth={Math.max(0.5, stroke - 0.5)}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <line
        x1={shadowVerticalX}
        y1={verticalStart}
        x2={shadowVerticalX}
        y2={verticalEnd}
        stroke={`url(#${uid}-shadow-v)`}
        strokeWidth={Math.max(0.5, stroke - 0.5)}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <path
        d="M19.11 17.2c-.28-.14-1.63-.8-1.88-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.2-.44-2.3-1.4-.85-.75-1.42-1.68-1.59-1.96-.16-.28-.02-.43.12-.56.13-.13.28-.32.41-.48.14-.16.18-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.61-1.46-.84-1.99-.22-.52-.44-.45-.61-.46l-.52-.01c-.18 0-.49.07-.75.35-.25.28-.99.97-.99 2.37 0 1.4 1.02 2.76 1.16 2.94.14.18 2.01 3.08 4.88 4.2 1.81.74 2.52.81 3.43.68.55-.08 1.63-.66 1.86-1.3.23-.64.23-1.18.16-1.3-.07-.12-.25-.19-.53-.33z"
        fill="currentColor"
      />
      <path
        d="M26.5 5.5c-4.7-4.7-12.3-4.7-17 0-3.8 3.8-4.5 9.6-1.8 14.1L6 28l8.6-1.6c4.4 2.4 9.9 1.6 13.6-2.1 4.7-4.7 4.7-12.3 0-17zm-1.8 15.2c-3.1 3.1-7.8 3.8-11.6 1.7l-.84-.45-5.1.95.97-4.98-.49-.86C5.3 12.8 6 8.1 9.1 5c3.9-3.9 10.3-3.9 14.2 0s3.9 10.3 0 14.2z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Footer() {
  const waPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";
  const waHref = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    "Hola, quiero información de proyectos y agendar una asesoría con VR Inmobiliaria.",
  )}`;
  const calLink =
    process.env.NEXT_PUBLIC_CAL_LINK ||
    "https://cal.com/tu-org/visita-proyecto";
  const formAction =
    process.env.NEXT_PUBLIC_CONTACT_FORM_ACTION || "/api/contact";
  const formRedirect =
    process.env.NEXT_PUBLIC_CONTACT_FORM_SUCCESS_URL ||
    "https://www.vreyes.cl/gracias";
  const [open, setOpen] = useState(false);

  return (
    <>
      <footer className="relative mt-24 overflow-hidden border-t border-white/70 bg-white/85">
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="relative">
            <CornerLines pos="top-right" className="hidden md:block" />
            <CornerLines pos="bottom-left" className="hidden md:block" />
            <div className="relative z-10">
              <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
                {/* Marca & propósito */}
                <div>
                  <div className="flex items-center">
                    <Image
                      src="/cuerpo.svg"
                      alt="VR Inmobiliaria"
                      width={120}
                      height={40}
                      className="h-10 w-auto"
                      priority
                    />
                  </div>
                  <p className="mt-4 text-[14px] leading-6 text-brand-mute">
                    Acompañamos tu decisión con información clara, asesoría
                    cercana y procesos simples de principio a fin.
                  </p>

                  {/* Confianza / sellos (placeholder de texto) */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-brand-navy/10 bg-white px-3 py-1 text-[11px] text-brand-mute">
                      Asesoría certificada
                    </span>
                    <span className="rounded-full border border-brand-navy/10 bg-white px-3 py-1 text-[11px] text-brand-mute">
                      Análisis financiero personalizado
                    </span>
                    <span className="rounded-full border border-brand-navy/10 bg-white px-3 py-1 text-[11px] text-brand-mute">
                      Documentación transparente
                    </span>
                  </div>
                </div>

                {/* Navegación */}
                <div>
                  <h4 className="text-[13px] font-semibold uppercase tracking-[0.25em] text-brand-navy">
                    Navegación
                  </h4>
                  <ul className="mt-4 space-y-2 text-[14px] text-brand-mute">
                    <li>
                      <Link
                        href="/proyectos"
                        className="hover:underline underline-offset-4"
                      >
                        Proyectos
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/nosotros"
                        className="hover:underline underline-offset-4"
                      >
                        Nosotros
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contacto"
                        className="hover:underline underline-offset-4"
                      >
                        Contacto
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[13px] font-semibold uppercase tracking-[0.25em] text-brand-navy">
                    Escríbenos
                  </h4>
                  <div className="mt-3 flex flex-col gap-3 text-sm text-brand-mute">
                    <p>
                      Completa tus datos y te contactaremos dentro de las
                      próximas 24 horas hábiles.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setOpen(true)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-navy/10 bg-white px-5 py-2 text-sm font-semibold text-brand-navy shadow-[0_10px_30px_rgba(14,33,73,0.08)] transition hover:border-brand-navy/25 hover:text-brand-navy/90 hover:shadow-[0_16px_40px_rgba(14,33,73,0.12)]"
                      >
                        Abrir formulario
                      </button>
                      <div className="inline-flex items-center gap-3 text-sm text-brand-mute">
                        <span>o escríbenos directo</span>
                        <a
                          href={waHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/10 px-4 py-2 text-sm font-semibold text-brand-green hover:bg-brand-green hover:text-white"
                        >
                          <WhatsAppIcon className="h-4 w-4" />
                          WhatsApp
                        </a>
                      </div>
                    </div>
                    <p className="font-semibold text-brand-navy">
                      También puedes escribirnos:
                    </p>
                    <p>
                      <a
                        href="mailto:mtbollmann@vreyes.cl"
                        className="hover:underline underline-offset-4"
                      >
                        mtbollmann@vreyes.cl
                      </a>
                      {" · "}
                      <a
                        href="tel:+56976943264"
                        className="hover:underline underline-offset-4"
                      >
                        +56 9 7694 3264
                      </a>
                    </p>
                    <p>San Pío X 2475, Oficina 50, Providencia</p>
                    <p>
                      <a
                        href={calLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full border border-brand-navy/15 px-4 py-1.5 text-sm font-semibold text-brand-navy hover:bg-brand-navy/5"
                      >
                        Agendar asesoría
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Legal */}
              <div className="mt-12 border-t border-white/60 pt-6 text-[13px] text-brand-mute md:flex md:items-center md:justify-between">
                <p>
                  © {new Date().getFullYear()} VR Inmobiliaria — Todos los
                  derechos reservados.
                </p>
                <div className="mt-3 flex flex-wrap gap-3 text-brand-mute md:mt-0">
                  <Link
                    href="/legal/terminos"
                    className="hover:underline underline-offset-4"
                  >
                    Términos
                  </Link>
                  <span>·</span>
                  <Link
                    href="/legal/privacidad"
                    className="hover:underline underline-offset-4"
                  >
                    Privacidad
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Coordinemos una asesoría"
      >
        <div className="space-y-5 bg-white/90 p-6 text-brand-navy backdrop-blur-xl">
          <p className="text-sm text-brand-mute">
            Déjanos tus datos y un miembro del equipo te contactará en menos de
            24 horas hábiles.
          </p>
          <form
            action={formAction}
            method="POST"
            className="grid gap-4"
            onSubmit={() => setOpen(false)}
          >
            <input type="hidden" name="_next" value={formRedirect} />
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-mute">
              Nombre y apellido
              <input
                type="text"
                name="nombre"
                required
                placeholder="Tu nombre completo"
                className="mt-1 w-full rounded-2xl border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy placeholder:text-brand-mute/60 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-mute">
              Correo electrónico
              <input
                type="email"
                name="correo"
                required
                placeholder="nombre@correo.com"
                className="mt-1 w-full rounded-2xl border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy placeholder:text-brand-mute/60 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-mute">
              Teléfono
              <input
                type="tel"
                name="telefono"
                required
                placeholder="+56 9 1234 5678"
                className="mt-1 w-full rounded-2xl border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy placeholder:text-brand-mute/60 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
              />
            </label>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-mute">
              Mensaje
              <textarea
                name="mensaje"
                rows={4}
                required
                placeholder="Cuéntanos qué tipo de propiedad buscas o en qué etapa estás."
                className="mt-1 w-full rounded-2xl border border-brand-navy/15 bg-white px-4 py-3 text-sm text-brand-navy placeholder:text-brand-mute/60 focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
              />
            </label>
            <label className="flex items-center gap-2 text-xs text-brand-mute">
              <input
                type="checkbox"
                name="newsletter"
                value="Si, quiero recibir novedades"
                className="h-4 w-4 rounded border-brand-navy/20 text-brand-gold focus:ring-brand-gold"
              />
              Deseo recibir novedades sobre proyectos y beneficios.
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-navy via-brand-gold to-brand-gold px-6 py-3 text-sm font-semibold text-white shadow-[0_22px_60px_rgba(237,201,103,0.28)] transition hover:shadow-[0_28px_70px_rgba(237,201,103,0.35)]"
            >
              Enviar formulario
            </button>
          </form>
        </div>
      </Modal>
    </>
  );
}

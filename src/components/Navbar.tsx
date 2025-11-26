"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";

type CornerLinesProps = {
  pos: "top-right" | "bottom-left";
  size?: number;
  stroke?: number;
  className?: string;
};

function CornerLines({
  pos,
  size = 120,
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
          <stop offset="0" stopColor="rgba(237,201,103,0.9)" />
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
          <stop offset="0" stopColor="rgba(237,201,103,0.9)" />
          <stop offset="1" stopColor="rgba(237,201,103,0)" />
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

const NAV = [
  { href: "/", label: "Inicio" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const calLink = process.env.NEXT_PUBLIC_CAL_LINK || "/contacto";
  const waPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";
  const waHref = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    "Hola, quiero hablar con un asesor de VR Inmobiliaria sobre proyectos disponibles.",
  )}`;

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      router.push("/");
    }
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={`relative z-40 overflow-visible bg-[linear-gradient(90deg,rgba(241,237,229,0.96)_0%,rgba(255,255,255,0.94)_100%)] backdrop-blur-xl ${
        elevated ? "shadow-[0_8px_28px_rgba(0,0,0,0.06)]" : "shadow-none"
      } border-b border-[rgba(237,201,103,0.35)]`}
    >
      {/* Top bar */}
      <div className="hidden border-b border-white/60 bg-brand-sand/80 text-[13px] text-brand-mute md:block">
        <div className="relative mx-auto max-w-7xl px-6 py-2">
          <CornerLines pos="top-right" />
          <div className="flex items-center justify-between">
            <p className="tracking-wide">
              Acompañamiento personalizado para tu próxima propiedad. Agenda o
              escríbenos ahora.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="tel:+56976943264"
                className="hover:underline underline-offset-4"
              >
                +56 9 7694 3264
              </a>
              <span className="text-brand-navy/30">|</span>
              <a
                href="mailto:mtbollmann@vreyes.cl"
                className="hover:underline underline-offset-4"
              >
                mtbollmann@vreyes.cl
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <CornerLines pos="bottom-left" />
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="flex items-center text-[18px] font-semibold tracking-tight text-brand-navy"
          >
            VR Inmobiliaria
          </Link>

          {/* Nav links */}
          <nav className="hidden items-center gap-2 md:flex">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative rounded-lg px-3 py-2 text-sm tracking-wide transition ${
                  isActive(href)
                    ? "text-brand-navy after:absolute after:left-3 after:right-3 after:-bottom-[4px] after:h-[2px] after:bg-[rgba(237,201,103,0.95)]"
                    : "text-brand-mute hover:text-brand-navy"
                }`}
              >
                {label}
              </Link>
            ))}
            <button
              type="button"
              onClick={handleBack}
              className="rounded-lg px-3 py-2 text-sm tracking-wide text-brand-mute transition hover:text-brand-navy hover:underline underline-offset-4"
            >
              Volver
            </button>
          </nav>

          {/* Buttons */}
          <div className="hidden items-center gap-2 md:flex">
            <a
              href={calLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-brand-navy/10 bg-gradient-to-r from-brand-navy via-brand-gold to-brand-gold px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(237,201,103,0.18)] transition hover:shadow-[0_18px_40px_rgba(237,201,103,0.25)]"
            >
              Agendar asesoría gratuita
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/10 px-4 py-2 text-sm font-semibold text-brand-green hover:bg-brand-green hover:text-white"
            >
              <WhatsAppIcon className="h-4 w-4" /> WhatsApp
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="inline-flex items-center justify-center rounded-lg border border-brand-navy/15 bg-white/90 p-2 text-brand-navy md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menú"
          >
            <div className="h-4 w-5">
              <div className="mb-[5px] h-[2px] w-full bg-current" />
              <div className="mb-[5px] h-[2px] w-full bg-current" />
              <div className="h-[2px] w-full bg-current" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile panel */}
      {open && (
        <div className="border-t border-[rgba(237,201,103,0.25)] bg-[rgba(255,255,255,0.96)] md:hidden">
          <nav className="mx-auto max-w-7xl px-6 py-4">
            <ul className="flex flex-col gap-1">
              {NAV.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-3 py-2 text-[15px] ${
                      isActive(href)
                        ? "bg-brand-navy/5 text-brand-navy"
                        : "text-brand-mute hover:bg-[rgba(241,237,229,0.7)]"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={() => {
                    handleBack();
                    setOpen(false);
                  }}
                  className="w-full rounded-lg px-3 py-2 text-left text-[15px] text-brand-mute hover:bg-[rgba(241,237,229,0.7)] hover:text-brand-navy"
                >
                  Volver
                </button>
              </li>
            </ul>
            <div className="mt-4 flex gap-2">
              <a
                href={calLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-full bg-gradient-to-r from-brand-navy via-brand-gold to-brand-gold px-4 py-2 text-center text-sm font-semibold text-white shadow-[0_12px_30px_rgba(237,201,103,0.18)]"
              >
                Agendar asesoría gratuita
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/10 px-4 py-2 text-sm font-semibold text-brand-green hover:bg-brand-green hover:text-white"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </nav>
        </div>
      )}

      <span className="pointer-events-none absolute bottom-0 left-1/2 h-[4px] w-[125%] -translate-x-1/2 overflow-hidden">
        <span className="absolute inset-0 rounded-full blur-md opacity-80 bg-[linear-gradient(90deg,rgba(168,120,24,0.6)_0%,rgba(237,201,103,0.5)_35%,rgba(255,243,208,0.32)_55%,rgba(237,201,103,0.5)_75%,rgba(168,120,24,0.6)_100%)]" />
        <span className="absolute inset-0 rounded-full bg-[linear-gradient(90deg,#a67618_0%,#d7b045_20%,#ffeebc_50%,#d7b045_80%,#a67618_100%)] [background-size:260%_100%] animate-goldenPulse" />
      </span>
    </header>
  );
}

"use client";

import Link from "next/link";

export default function ContactPageNav() {
  return (
    <nav className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.3em] text-brand-navy/70">
      <Link
        href="/"
        className="hover:text-brand-navy hover:underline underline-offset-4"
      >
        Inicio
      </Link>
      <span className="text-brand-gold">·</span>
      <Link
        href="/proyectos"
        className="hover:text-brand-navy hover:underline underline-offset-4"
      >
        Proyectos
      </Link>
      <span className="text-brand-gold">·</span>
      <button
        type="button"
        onClick={() => window.history.back()}
        className="hover:text-brand-navy hover:underline underline-offset-4"
      >
        Volver
      </button>
    </nav>
  );
}

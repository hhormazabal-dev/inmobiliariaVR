import Link from "next/link";

export default function ContactBanner() {
  const waPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";
  const waHref = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    "Hola, quiero coordinar una asesoría gratuita con VR Inmobiliaria.",
  )}`;
  const calLink =
    process.env.NEXT_PUBLIC_CAL_LINK ||
    "https://cal.com/tu-org/visita-proyecto";

  return (
    <section className="relative mt-20 w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_15%,rgba(237,201,103,0.2),transparent_45%),radial-gradient(circle_at_90%_20%,rgba(14,33,73,0.18),transparent_60%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-6 py-14 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl space-y-5 text-brand-navy">
          <span className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-brand-navy/70">
            Agenda ahora
          </span>
          <h2 className="font-display text-[34px] font-semibold leading-tight md:text-[40px]">
            Diseñemos tu estrategia inmobiliaria.
          </h2>
          <p className="text-sm text-brand-navy/75 md:text-base">
            Conversa con nuestro equipo, revisa alternativas reales y recibe un
            plan de acción claro para concretar tu inversión.
          </p>
          <ul className="space-y-2 text-sm text-brand-navy/70">
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-brand-gold" />
              Comparativa de proyectos con condiciones preferentes para clientes
              VR.
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-brand-gold" />
              Evaluación financiera integral: rentas proyectadas, créditos y
              salida.
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-brand-gold" />
              Acompañamiento dedicado desde la reserva hasta la entrega.
            </li>
          </ul>
        </div>

        <div className="flex w-full flex-col gap-4 text-sm font-semibold text-brand-navy md:max-w-sm">
          <a
            href={calLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-between rounded-2xl bg-gradient-to-r from-[#0f1f44] via-[#1d3460] to-[#27406f] px-6 py-4 text-white shadow-[0_22px_60px_rgba(12,24,52,0.28)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(12,24,52,0.4)]"
          >
            <span className="text-white">Agendar videollamada</span>
            <span className="text-xs uppercase tracking-[0.32em] text-white">
              30 min
            </span>
          </a>
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-between rounded-2xl bg-white/20 px-6 py-4 text-brand-green backdrop-blur-lg transition duration-300 hover:-translate-y-1 hover:bg-white/35"
          >
            <span>Hablar por WhatsApp</span>
            <span className="text-xs uppercase tracking-[0.32em] text-brand-green/70">
              respuesta inmediata
            </span>
          </a>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-between rounded-2xl bg-white/18 px-6 py-4 text-brand-navy backdrop-blur-lg transition duration-300 hover:-translate-y-1 hover:bg-white/28"
          >
            <span>Enviar briefing</span>
            <span className="text-xs uppercase tracking-[0.32em] text-brand-navy/60">
              formulario
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import CitylineIllustration from "@/components/CitylineIllustration";

export default function ContactBanner() {
  const waPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";
  const waHref = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    "Hola, quiero coordinar una asesoría gratuita con VR Inmobiliaria.",
  )}`;
  const calLink =
    process.env.NEXT_PUBLIC_CAL_LINK ||
    "https://cal.com/tu-org/visita-proyecto";

  return (
    <section className="mx-auto max-w-7xl px-6 pb-24 pt-10">
      <div className="relative overflow-hidden rounded-[32px] border border-brand-navy/15 bg-white/95 shadow-[0_28px_80px_rgba(14,33,73,0.12)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(237,201,103,0.25),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(14,33,73,0.2),transparent_50%)]" />
        <CitylineIllustration
          className="pointer-events-none absolute -bottom-14 left-10 hidden w-[260px] md:block"
          variant="dense"
          orientation="left"
        />
        <CitylineIllustration
          className="pointer-events-none absolute -top-10 right-8 hidden w-[200px] opacity-70 md:block"
          orientation="right"
        />
        <div className="relative flex flex-col gap-10 px-8 py-12 text-brand-navy md:flex-row md:items-center md:justify-between md:px-14">
          <div className="max-w-xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
              Agenda ahora
            </p>
            <h2 className="font-display text-3xl font-semibold md:text-4xl">
              Agendar asesoría gratuita
            </h2>
            <p className="text-sm text-brand-mute md:text-base">
              Acompañamiento personalizado para tu próxima propiedad. Agenda o
              escríbenos ahora.
            </p>
          </div>

          <div className="flex flex-col gap-3 text-sm font-semibold">
            <a
              href={calLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-navy via-brand-gold to-brand-gold px-6 py-3 text-white shadow-[0_20px_45px_rgba(237,201,103,0.22)] transition hover:shadow-[0_24px_60px_rgba(237,201,103,0.28)]"
            >
              Agendar asesoría gratuita
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-green/20 bg-white px-6 py-3 text-brand-green transition hover:bg-brand-green hover:text-white"
            >
              Escribir por WhatsApp
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-brand-navy/15 px-6 py-3 text-brand-navy/80 transition hover:bg-brand-navy/5"
            >
              Ver formulario de contacto
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

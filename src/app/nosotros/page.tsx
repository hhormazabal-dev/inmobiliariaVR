import Link from "next/link";

const calLink =
  process.env.NEXT_PUBLIC_CAL_LINK || "https://cal.com/tu-org/visita-proyecto";
const waPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";
const waHref = `https://wa.me/${waPhone}?text=${encodeURIComponent(
  "Hola, quiero coordinar una asesoría con VR Inmobiliaria.",
)}`;

export default function NosotrosPage() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="rounded-[36px] border border-brand-navy/10 bg-white/90 px-6 py-16 shadow-[0_28px_80px_rgba(14,33,73,0.12)] md:px-12">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
          Nosotros
        </p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-brand-navy md:text-5xl">
          MÁS QUE UNA INMOBILIARIA, SOMOS TU EQUIPO DE CONFIANZA
        </h1>
        <p className="mt-6 text-base leading-relaxed text-brand-mute md:text-lg">
          En VR Inmobiliaria creemos que cada cliente merece una experiencia
          transparente, cercana y personalizada. Nuestro compromiso es
          acompañarte desde el primer contacto hasta la entrega de tu
          departamento, guiándote con empatía, conocimiento y respaldo
          financiero.
        </p>
        <p className="mt-4 text-base font-semibold text-brand-navy md:text-lg">
          &quot;Cuando confías en quienes te acompañan, todo el proceso se
          convierte en una experiencia más humana&quot;.
        </p>

        <div className="my-10 h-[2px] w-full rounded-full bg-gradient-to-r from-brand-gold via-brand-green/40 to-brand-gold" />

        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-brand-navy">
            Importante:
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={calLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-brand-navy via-brand-gold to-brand-gold px-5 py-3 text-sm font-semibold text-white shadow-[0_18px_45px_rgba(212,175,55,0.22)] transition hover:shadow-[0_24px_60px_rgba(212,175,55,0.28)]"
            >
              Agendar asesoría
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full border border-brand-green/20 bg-brand-green/10 px-5 py-3 text-sm font-semibold text-brand-green transition hover:bg-brand-green hover:text-white"
            >
              Escribir por WhatsApp
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center rounded-full border border-brand-navy/10 bg-white px-5 py-3 text-sm font-semibold text-brand-navy transition hover:bg-brand-navy/5"
            >
              Ver formulario de contacto
            </Link>
          </div>
          <p className="text-sm text-brand-mute md:text-base">
            Acompañamiento personalizado para tu próxima propiedad. Agenda o
            escríbenos ahora.
          </p>
        </div>
      </div>
    </section>
  );
}

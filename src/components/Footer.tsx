import Link from "next/link";

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
      <path d="M19.11 17.2c-.28-.14-1.63-.8-1.88-.9-.25-.09-.43-.14-.61.14-.18.28-.7.9-.86 1.08-.16.18-.32.2-.6.07-.28-.14-1.2-.44-2.3-1.4-.85-.75-1.42-1.68-1.59-1.96-.16-.28-.02-.43.12-.56.13-.13.28-.32.41-.48.14-.16.18-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.61-1.46-.84-1.99-.22-.52-.44-.45-.61-.46l-.52-.01c-.18 0-.49.07-.75.35-.25.28-.99.97-.99 2.37 0 1.4 1.02 2.76 1.16 2.94.14.18 2.01 3.08 4.88 4.2 1.81.74 2.52.81 3.43.68.55-.08 1.63-.66 1.86-1.3.23-.64.23-1.18.16-1.3-.07-.12-.25-.19-.53-.33z" fill="currentColor"/>
      <path d="M26.5 5.5c-4.7-4.7-12.3-4.7-17 0-3.8 3.8-4.5 9.6-1.8 14.1L6 28l8.6-1.6c4.4 2.4 9.9 1.6 13.6-2.1 4.7-4.7 4.7-12.3 0-17zm-1.8 15.2c-3.1 3.1-7.8 3.8-11.6 1.7l-.84-.45-5.1.95.97-4.98-.49-.86C5.3 12.8 6 8.1 9.1 5c3.9-3.9 10.3-3.9 14.2 0s3.9 10.3 0 14.2z" fill="currentColor"/>
    </svg>
  );
}

export default function Footer() {
  const waPhone = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || "";
  const waHref = `https://wa.me/${waPhone}?text=${encodeURIComponent(
    "Hola, quiero información de proyectos y agenda."
  )}`;
  const calLink =
    process.env.NEXT_PUBLIC_CAL_LINK || "https://cal.com/tu-org/visita-proyecto";

  return (
    <footer className="mt-24 border-t border-white/70 bg-white/85">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Marca & propósito */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-navy font-black text-white">
                V
              </div>
              <span className="text-[18px] font-semibold text-brand-navy">
                VREYES<span className="text-brand-gold">.cl</span>
              </span>
            </div>
            <p className="mt-4 text-[14px] leading-6 text-brand-mute">
              Acompañamos tu decisión con información clara, asesoría cercana y procesos simples de
              principio a fin.
            </p>

            {/* Confianza / sellos (placeholder de texto) */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full border border-brand-navy/10 bg-white px-3 py-1 text-[11px] text-brand-mute">
                Asesoría certificada
              </span>
              <span className="rounded-full border border-brand-navy/10 bg-white px-3 py-1 text-[11px] text-brand-mute">
                Convenios bancarios
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
              <li><Link href="/proyectos" className="hover:underline underline-offset-4">Proyectos</Link></li>
              <li><Link href="/inversion" className="hover:underline underline-offset-4">Inversión</Link></li>
              <li><Link href="/insights" className="hover:underline underline-offset-4">Guías & Insights</Link></li>
              <li><Link href="/nosotros" className="hover:underline underline-offset-4">Nosotros</Link></li>
              <li><Link href="/contacto" className="hover:underline underline-offset-4">Contacto</Link></li>
            </ul>
          </div>

          {/* Contacto (cercanía) */}
          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.25em] text-brand-navy">
              Contacto
            </h4>
            <ul className="mt-4 space-y-2 text-[14px] text-brand-mute">
              <li><a href="tel:+56212345678" className="hover:underline underline-offset-4">+56 2 1234 5678</a></li>
              <li><a href="mailto:contacto@vreyes.cl" className="hover:underline underline-offset-4">contacto@vreyes.cl</a></li>
              <li><span>Lun a Vie · 09:00–19:00</span></li>
              <li><span>Av. Ejemplo 1234, Providencia, Santiago</span></li>
            </ul>
          </div>

          {/* Acciones rápidas */}
          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-[0.25em] text-brand-navy">
              ¿Agendamos?
            </h4>
            <div className="mt-3 flex flex-col gap-2">
              <a
                href={calLink}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-brand-navy px-5 py-2 text-center text-[14px] font-semibold text-white hover:shadow-lg"
              >
                Agendar visita
              </a>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-600/10 px-5 py-2 text-[14px] font-semibold text-emerald-700 hover:bg-emerald-600/15"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
              <Link
                href="/contacto"
                className="rounded-full border border-brand-navy/10 bg-white px-5 py-2 text-center text-[14px] font-semibold text-brand-navy hover:bg-white/90"
              >
                Formulario de contacto
              </Link>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="mt-12 border-t border-white/60 pt-6 text-[13px] text-brand-mute md:flex md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} VREYES.cl — Todos los derechos reservados.</p>
          <div className="mt-3 flex flex-wrap gap-3 text-brand-mute md:mt-0">
            <Link href="/legal/terminos" className="hover:underline underline-offset-4">
              Términos
            </Link>
            <span>·</span>
            <Link href="/legal/privacidad" className="hover:underline underline-offset-4">
              Privacidad
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

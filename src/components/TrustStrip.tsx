const LOGOS = ["BCI", "Itau", "Scotiabank", "BancoEstado", "Santander"];

export default function TrustStrip() {
  return (
    <section className="border-y border-white/60 bg-white/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-gold">
            Partners & respaldo
          </p>
          <p className="mt-2 max-w-xl text-base text-brand-mute">
            Alianzas bancarias y legales para asegurar una compra clara, con preaprobación y
            documentación visible desde el día uno.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-start gap-x-6 gap-y-3 text-brand-navy/60">
          {LOGOS.map((logo) => (
            <span key={logo} className="text-sm font-semibold tracking-[0.35em] uppercase">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function TrustStrip() {
  return (
    <section className="border-y border-white/60 bg-white/85">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-brand-gold">
            ACOMPAÑAMIENTO Y ASESORÍA EN TODO EL PROCESO
          </p>
          <h2 className="mt-3 font-display text-3xl font-semibold leading-snug text-brand-navy md:text-[2.2rem]">
            No estás solo en el proceso.
          </h2>
          <p className="mt-3 text-base text-brand-mute">
            Te asesoramos desde la selección del proyecto hasta la gestión del
            crédito hipotecario, coordinando opciones con entidades bancarias y
            mutuarias para que tomes decisiones seguras y rentables.
          </p>
        </div>
        <div className="flex flex-col gap-4 rounded-[28px] border border-brand-gold/30 bg-white/70 p-6 text-sm text-brand-navy shadow-[0_20px_50px_rgba(212,175,55,0.18)]">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-green/20 text-brand-green">
              ●
            </span>
            <p className="font-semibold uppercase tracking-[0.2em] text-brand-navy/70">
              Entidades bancarias y mutuarias
            </p>
          </div>
          <p className="text-brand-mute">
            Coordinamos evaluaciones financieras, documentación y comparación de
            alternativas para conseguir la opción de financiamiento que mejor
            calza contigo.
          </p>
        </div>
      </div>
    </section>
  );
}

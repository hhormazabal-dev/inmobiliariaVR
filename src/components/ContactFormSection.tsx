"use client";

import { useEffect } from "react";
import { useContactForm } from "@/hooks/useContactForm";

export default function ContactFormSection() {
  const {
    formAction,
    formRedirect,
    handleSubmit,
    isSubmitting,
    submitMessage,
    submitError,
    reset,
  } = useContactForm();

  useEffect(() => {
    if (!submitMessage) return;
    const timeout = window.setTimeout(() => {
      reset();
    }, 4000);
    return () => window.clearTimeout(timeout);
  }, [reset, submitMessage]);

  return (
    <section className="mx-auto max-w-5xl px-6 pb-24">
      <div className="rounded-[36px] border border-brand-navy/15 bg-white/95 p-8 shadow-[0_30px_90px_rgba(14,33,73,0.12)] backdrop-blur-xl md:p-12">
        <div className="grid gap-10 md:grid-cols-[minmax(0,0.55fr)_minmax(0,0.45fr)]">
          <div className="space-y-6 text-brand-navy">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-brand-gold">
              Formulario de contacto
            </p>
            <h2 className="font-display text-3xl font-semibold md:text-4xl">
              Coordinemos tu próxima inversión
            </h2>
            <p className="text-sm text-brand-mute md:text-base">
              Cuéntanos qué tipo de proyecto estás evaluando, tu rango de
              inversión o cualquier duda. Te contactaremos en menos de 24 horas
              hábiles para guiarte con alternativas y financiamiento.
            </p>
            <ul className="space-y-2 text-sm text-brand-navy/70">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-brand-gold">•</span>
                <span>Análisis de proyectos según tu perfil y objetivos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-brand-gold">•</span>
                <span>
                  Comparativa de financiamiento, beneficios y rentabilidad.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-brand-gold">•</span>
                <span>
                  Acompañamiento en reserva, promesa y cierre con la
                  inmobiliaria.
                </span>
              </li>
            </ul>
          </div>

          <form
            action={formAction}
            method="POST"
            onSubmit={handleSubmit}
            className="grid gap-4"
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
                rows={5}
                required
                placeholder="¿Qué tipo de propiedad te interesa? ¿En qué etapa estás?"
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
              Deseo recibir novedades sobre proyectos y beneficios exclusivos.
            </label>
            {submitError && (
              <p className="text-xs font-medium text-red-600">{submitError}</p>
            )}
            {submitMessage && (
              <p className="rounded-2xl bg-brand-green/10 px-4 py-3 text-xs font-medium text-brand-green">
                {submitMessage}
              </p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-brand-navy via-brand-gold to-brand-gold px-5 py-3 text-sm font-semibold text-white shadow-[0_20px_45px_rgba(237,201,103,0.22)] transition hover:shadow-[0_24px_60px_rgba(237,201,103,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Enviando..." : "Enviar mensaje"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

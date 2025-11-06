import type { Metadata } from "next";
import Link from "next/link";
import ContactFormSection from "@/components/ContactFormSection";
import ContactPageNav from "@/components/ContactPageNav";

export const metadata: Metadata = {
  title: "Contacto · VR Inmobiliaria",
  description:
    "Completa el formulario y un asesor de VR Inmobiliaria te contactará en menos de 24 horas hábiles.",
};

export default function ContactoPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#f6f0e7] py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(237,201,103,0.18),transparent_55%),radial-gradient(circle_at_bottom_right,rgba(14,33,73,0.16),transparent_55%)]" />
        <div className="relative mx-auto max-w-5xl px-6 text-brand-navy">
          <ContactPageNav />
          <div className="mt-8 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-brand-gold">
              VR Inmobiliaria
            </p>
            <h1 className="mt-4 font-display text-3xl font-semibold md:text-[40px]">
              Conversemos sobre tu próximo proyecto
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-brand-mute md:text-base">
              Estamos listos para ayudarte con análisis de proyectos,
              financiamiento y gestión completa. Puedes escribirnos directo a{" "}
              <Link
                href="mailto:mtbollmann@vreyes.cl"
                className="font-semibold text-brand-navy underline-offset-4 hover:underline"
              >
                mtbollmann@vreyes.cl
              </Link>{" "}
              o completar el formulario y te contactaremos a la brevedad.
            </p>
          </div>
        </div>
      </section>
      <ContactFormSection />
    </>
  );
}

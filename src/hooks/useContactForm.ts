import { useCallback, useState } from "react";

export function useContactForm() {
  const formAction =
    process.env.NEXT_PUBLIC_CONTACT_FORM_ACTION || "/api/contact";
  const formRedirect =
    process.env.NEXT_PUBLIC_CONTACT_FORM_SUCCESS_URL ||
    "https://www.vreyes.cl/gracias";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setIsSubmitting(false);
    setSubmitMessage(null);
    setSubmitError(null);
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (isSubmitting) return;

      const form = event.currentTarget;
      const data = new FormData(form);
      data.set("_next", formRedirect);

      setIsSubmitting(true);
      setSubmitMessage(null);
      setSubmitError(null);

      try {
        const response = await fetch(formAction, {
          method: "POST",
          headers: {
            Accept: "application/json",
          },
          body: data,
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(
            payload?.message ??
              "No fue posible enviar el formulario. Intenta nuevamente.",
          );
        }

        setSubmitMessage(
          "¡Gracias! Recibimos tus datos. Un asesor se pondrá en contacto contigo pronto.",
        );
        form.reset();
      } catch (error) {
        console.error("[contact-form] Error enviando formulario:", error);
        setSubmitError(
          error instanceof Error
            ? error.message
            : "Ocurrió un problema inesperado. Intenta nuevamente.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    [formAction, formRedirect, isSubmitting],
  );

  return {
    formAction,
    formRedirect,
    isSubmitting,
    submitMessage,
    submitError,
    handleSubmit,
    reset,
  };
}

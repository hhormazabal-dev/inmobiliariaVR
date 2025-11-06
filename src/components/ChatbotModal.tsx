"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import { useChatStore } from "@/store/useChatStore";

const suggestions = [
  "Ver departamentos disponibles",
  "Propiedades en Providencia",
  "Quiero coordinar una visita",
];

function formatMessage(text: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function ChatbotModal() {
  const {
    isOpen,
    close,
    messages,
    sendMessage,
    isLoading,
    whatsappUrl,
    error,
  } = useChatStore((state) => ({
    isOpen: state.isOpen,
    close: state.close,
    messages: state.messages,
    sendMessage: state.sendMessage,
    isLoading: state.isLoading,
    whatsappUrl: state.whatsappUrl,
    error: state.error,
  }));

  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setInput("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const container = scrollRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages, isOpen]);

  const portalTarget = typeof document !== "undefined" ? document.body : null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;
    const value = input;
    setInput("");
    await sendMessage(value);
  };

  const handleSuggestion = async (value: string) => {
    setInput("");
    await sendMessage(value);
  };

  const hasMessages = messages.length > 0;

  const content = (
    <AnimatePresence>
      {isOpen ? (
        <motion.section
          id="asesor-vr-chatbot"
          role="dialog"
          aria-modal="false"
          aria-label="Asesor VR"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.98 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-24 right-6 z-50 w-[min(100vw-2rem,22rem)] overflow-hidden rounded-3xl border border-white/60 bg-white/80 shadow-[0_30px_80px_rgba(14,33,73,0.28)] backdrop-blur-xl"
        >
          <header className="flex items-center justify-between border-b border-white/70 bg-white/40 px-5 py-4">
            <div>
              <h3 className="font-display text-lg font-semibold text-brand-navy">
                Asesor VR
              </h3>
            </div>
            <button
              type="button"
              onClick={close}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/60 text-brand-navy transition hover:bg-white"
            >
              <span className="sr-only">Cerrar chat</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M5 5l14 14M19 5 5 19" />
              </svg>
            </button>
          </header>

          <div className="flex flex-col gap-4 px-5 py-4">
            {!hasMessages && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl border border-white/70 bg-white/60 p-4 text-sm text-brand-navy/80 shadow-inner"
              >
                <p>
                  Hola, soy tu Asesor VR virtual. Puedo ayudarte a encontrar
                  proyectos según comuna, disponibilidad, rango de precios en UF
                  y tipologías disponibles.
                </p>
              </motion.div>
            )}

            <div
              ref={scrollRef}
              className="max-h-72 space-y-3 overflow-y-auto pr-1"
            >
              {messages.map((message) => {
                const lines = formatMessage(message.content);
                const isUser = message.role === "user";

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow ${
                        isUser
                          ? "bg-brand-navy text-white"
                          : "bg-white/80 text-brand-navy backdrop-blur"
                      }`}
                    >
                      {lines.map((line, index) => (
                        <p
                          key={index}
                          className={
                            line.includes("Información referencial")
                              ? "text-xs text-brand-mute/80"
                              : undefined
                          }
                        >
                          {line}
                        </p>
                      ))}

                      {message.ctaWhatsApp && whatsappUrl && (
                        <a
                          href={whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
                            isUser
                              ? "bg-white/10 text-white hover:bg-white/20"
                              : "bg-brand-navy text-white hover:bg-brand-navy/90"
                          } transition`}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          >
                            <path d="M12 2a10 10 0 0 0-8.66 15l-1.3 4.76 4.9-1.28A10 10 0 1 0 12 2Zm5.43 14.56c-.23.67-1.36 1.29-1.86 1.37s-.43.44-2.68-.55a8.58 8.58 0 0 1-2.84-1.77 9.87 9.87 0 0 1-1.92-2.36c-.18-.33-.33-.73-.05-1.1s.63-.72.87-1.08.37-.59.56-.95a.94.94 0 0 0-.05-.9c-.14-.27-.51-1.24-.7-1.7s-.39-.4-.68-.41H8a1.31 1.31 0 0 0-.95.45 4 4 0 0 0-1.27 3 6.93 6.93 0 0 0 1.45 3.63 15.87 15.87 0 0 0 5 4.33 16.18 16.18 0 0 0 4.55 1.32c1.07.14 2.05-.34 2.49-.91a2 2 0 0 0 .38-1.09c0-.2 0-.36-.06-.39s-.18-.08-.38-.15Z" />
                          </svg>
                          Hablar por WhatsApp
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="flex flex-wrap gap-2">
              {suggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSuggestion(item)}
                  className="rounded-full border border-brand-navy/15 bg-white/70 px-3 py-1 text-xs font-semibold text-brand-navy/80 transition hover:border-brand-gold hover:text-brand-navy"
                  disabled={isLoading}
                >
                  {item}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="relative flex items-center rounded-2xl border border-brand-navy/15 bg-white/70 px-3 py-2 shadow-inner focus-within:border-brand-gold focus-within:ring-2 focus-within:ring-brand-gold/10">
                <label htmlFor="asesor-vr-input" className="sr-only">
                  Escribe tu mensaje
                </label>
                <textarea
                  id="asesor-vr-input"
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Cuéntame qué tipo de propiedad necesitas"
                  rows={2}
                  className="w-full resize-none bg-transparent text-sm text-brand-navy placeholder:text-brand-mute/60 focus:outline-none"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-r from-brand-navy to-brand-gold text-white shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold"
                  disabled={isLoading || !input.trim()}
                >
                  <span className="sr-only">Enviar</span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="h-4 w-4"
                  >
                    <path d="m5 12 14-8-6 16-2-6-6-2Z" />
                  </svg>
                </button>
              </div>
              {error && <p className="text-xs text-brand-gold/80">{error}</p>}
            </form>
          </div>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );

  if (!mounted || !portalTarget) {
    return null;
  }

  return createPortal(content, portalTarget);
}

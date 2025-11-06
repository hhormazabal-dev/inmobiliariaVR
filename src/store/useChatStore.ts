"use client";

import { create } from "zustand";

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: number;
  ctaWhatsApp?: boolean;
  streaming?: boolean;
};

type ChatState = {
  isOpen: boolean;
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  whatsappUrl: string;
  open: () => void;
  close: () => void;
  toggle: () => void;
  clear: () => void;
  sendMessage: (input: string) => Promise<void>;
};

type StreamEvent =
  | { type: "metadata"; cta?: boolean }
  | { type: "token"; value: string }
  | { type: "done" }
  | { type: "error"; message: string };

const WHATSAPP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_URL ||
  (process.env.NEXT_PUBLIC_WHATSAPP_PHONE
    ? `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_PHONE}`
    : "");

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

async function readStream(
  response: Response,
  onEvent: (event: StreamEvent) => void,
) {
  if (!response.body) {
    throw new Error("La respuesta no contiene datos.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        const event = JSON.parse(trimmed) as StreamEvent;
        onEvent(event);
      } catch {
        console.warn("[useChatStore] No se pudo parsear el chunk:", trimmed);
      }
    }
  }

  if (buffer.trim()) {
    try {
      const event = JSON.parse(buffer.trim()) as StreamEvent;
      onEvent(event);
    } catch {
      console.warn(
        "[useChatStore] No se pudo parsear el último chunk:",
        buffer,
      );
    }
  }
}

export const useChatStore = create<ChatState>((set, get) => ({
  isOpen: false,
  messages: [],
  isLoading: false,
  error: null,
  whatsappUrl: WHATSAPP_URL,

  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  clear: () => set({ messages: [], error: null }),

  sendMessage: async (input: string) => {
    const trimmed = input.trim();
    if (!trimmed) {
      return;
    }

    const state = get();
    const userMessageId = createId();
    const assistantMessageId = createId();
    const timestamp = Date.now();

    const userMessage: ChatMessage = {
      id: userMessageId,
      role: "user",
      content: trimmed,
      createdAt: timestamp,
    };

    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      createdAt: timestamp,
      streaming: true,
    };

    set({
      messages: [...state.messages, userMessage, assistantMessage],
      isLoading: true,
      error: null,
    });

    const payload = {
      messages: [...state.messages, userMessage].map((message) => ({
        role: message.role,
        content: message.content,
      })),
    };

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        const errorMessage =
          data?.message ||
          "No fue posible procesar tu solicitud. Intenta nuevamente en unos minutos.";

        set((current) => ({
          messages: current.messages.map((message) =>
            message.id === assistantMessageId
              ? {
                  ...message,
                  content: errorMessage,
                  streaming: false,
                  ctaWhatsApp: true,
                }
              : message,
          ),
          isLoading: false,
          error: errorMessage,
        }));
        return;
      }

      let assistantContent = "";
      let ctaWhatsApp = false;

      await readStream(response, (event) => {
        if (event.type === "metadata") {
          ctaWhatsApp = Boolean(event.cta);
          set((current) => ({
            messages: current.messages.map((message) =>
              message.id === assistantMessageId
                ? { ...message, ctaWhatsApp }
                : message,
            ),
          }));
        } else if (event.type === "token") {
          assistantContent += event.value;
          set((current) => ({
            messages: current.messages.map((message) =>
              message.id === assistantMessageId
                ? {
                    ...message,
                    content: assistantContent,
                    ctaWhatsApp,
                  }
                : message,
            ),
          }));
        } else if (event.type === "error") {
          set((current) => ({
            messages: current.messages.map((message) =>
              message.id === assistantMessageId
                ? {
                    ...message,
                    content: event.message,
                    streaming: false,
                    ctaWhatsApp: true,
                  }
                : message,
            ),
            error: event.message,
          }));
        }
      });

      set((current) => ({
        messages: current.messages.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content: assistantContent,
                streaming: false,
                ctaWhatsApp,
              }
            : message,
        ),
        isLoading: false,
        error: null,
      }));
    } catch (error) {
      const fallbackMessage =
        "No fue posible conectar con el asistente en este momento. Escríbenos por WhatsApp y te ayudamos de inmediato.";
      console.error("[useChatStore] Error enviando mensaje:", error);
      set((current) => ({
        messages: current.messages.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                content: fallbackMessage,
                streaming: false,
                ctaWhatsApp: true,
              }
            : message,
        ),
        isLoading: false,
        error: fallbackMessage,
      }));
    }
  },
}));

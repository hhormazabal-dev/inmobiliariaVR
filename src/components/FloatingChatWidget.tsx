"use client";

import { motion } from "framer-motion";
import { useChatStore } from "@/store/useChatStore";
import ChatbotModal from "@/components/ChatbotModal";

function ChatIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 12a8.5 8.5 0 0 1-9 8.5 8.9 8.9 0 0 1-3-.5l-4 1 1-3.5A8.5 8.5 0 1 1 21 12Z" />
      <path d="M8 11h8" />
      <path d="M8 15h5" />
    </svg>
  );
}

export default function FloatingChatWidget() {
  const { isOpen, toggle } = useChatStore((state) => ({
    isOpen: state.isOpen,
    toggle: state.toggle,
  }));

  return (
    <>
      <ChatbotModal />
      <motion.button
        type="button"
        onClick={toggle}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        aria-expanded={isOpen}
        aria-controls="asesor-vr-chatbot"
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 rounded-[26px] border border-white/40 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.85),rgba(219,185,101,0.75)),linear-gradient(135deg,rgba(14,36,81,0.92),rgba(26,49,102,0.88))] px-5 py-3 text-sm font-semibold text-white shadow-[0_22px_55px_rgba(14,33,73,0.38)] backdrop-blur-lg transition hover:-translate-y-[1px] hover:shadow-[0_28px_75px_rgba(14,33,73,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-gold"
      >
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white shadow-inner">
          <span className="absolute inset-0 animate-pulse rounded-full bg-white/10" />
          <ChatIcon className="h-5 w-5" />
          {isOpen ? null : (
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-gold opacity-75" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-brand-gold" />
            </span>
          )}
        </span>
        <div className="flex flex-col text-left leading-tight">
          <span className="text-[11px] uppercase tracking-[0.25em] text-white/70">
            Asesor VR
          </span>
          <span className="text-[13px]">
            {isOpen ? "Cerrar conversación" : "Habla ahora con un asesor"}
          </span>
        </div>
        {!isOpen && (
          <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-white shadow-inner">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-300" />
            En línea
          </span>
        )}
      </motion.button>
    </>
  );
}

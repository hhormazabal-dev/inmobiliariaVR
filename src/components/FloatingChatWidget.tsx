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
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-navy via-brand-gold to-brand-gold px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(237,201,103,0.28)] transition hover:shadow-[0_24px_70px_rgba(237,201,103,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-gold"
      >
        <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/15">
          <ChatIcon className="h-5 w-5 text-white" />
          {isOpen ? null : (
            <span className="absolute -right-1 -top-1 inline-flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/70 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
            </span>
          )}
        </span>
        <span>{isOpen ? "Cerrar Asesor VR" : "Habla con Asesor VR"}</span>
      </motion.button>
    </>
  );
}

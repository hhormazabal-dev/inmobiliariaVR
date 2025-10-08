"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-brand-navy/30 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-[0_40px_90px_rgba(14,33,73,0.2)] backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <div className="border-b border-white/80 bg-white/80 px-6 py-4 backdrop-blur">
            <h3 className="text-lg font-semibold text-brand-navy">{title}</h3>
          </div>
        ) : null}
        <div className="p-0">{children}</div>
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-navy/10 bg-white/80 text-brand-navy hover:bg-white"
        >
          ✕
        </button>
      </div>
    </div>,
    document.body
  );
}

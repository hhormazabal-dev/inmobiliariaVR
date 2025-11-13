import "./globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingChatWidget from "@/components/FloatingChatWidget";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const sans = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "VR Inmobiliaria — Asesoría gratuita y Proyectos Seleccionados",
  description:
    "Reinventamos la forma de invertir y elegir tu hogar con acompañamiento cercano, proyectos seleccionados y respuesta ágil.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const chatEnabled =
    process.env.NEXT_PUBLIC_SHOW_CHAT_WIDGET === "true" ||
    process.env.NEXT_PUBLIC_ENABLE_CHAT_WIDGET === "true";

  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans text-brand-text antialiased">
        <Navbar />
        <main className="bg-transparent">{children}</main>
        <Footer />
        {chatEnabled ? <FloatingChatWidget /> : null}
      </body>
    </html>
  );
}

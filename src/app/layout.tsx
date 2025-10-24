import "./globals.css";
import type { Metadata } from "next";
import { Playfair_Display, Manrope } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const display = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "VR Inmobiliaria — Asesoría y Proyectos Seleccionados",
  description:
    "Reinventamos la forma de invertir y elegir tu hogar con acompañamiento cercano, proyectos curados y respuesta ágil.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans text-brand-text antialiased">
        <Navbar />
        <main className="bg-transparent">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

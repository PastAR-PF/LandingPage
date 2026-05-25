import { Inter, Outfit } from 'next/font/google';
import "./globals.css";

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata = {
  title: "PastAR — Gestión Inteligente de Ganado Bovino",
  description:
    "Plataforma integral de monitoreo, trazabilidad y gestión bovina con tecnología IoT. Collar sensor con GPS, alertas predictivas y análisis en tiempo real para productores ganaderos argentinos.",
  keywords: [
    "ganadería",
    "trazabilidad bovina",
    "collar sensor",
    "gestión ganadera",
    "monitoreo de ganado",
    "IoT agro",
    "PastAR",
    "agritech",
  ],
  openGraph: {
    title: "PastAR — Gestión Inteligente de Ganado Bovino",
    description:
      "Monitoreo en tiempo real, trazabilidad completa y análisis predictivo. Todo desde una sola plataforma.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${inter.variable} ${outfit.variable}`}>
      <body>{children}</body>
    </html>
  );
}

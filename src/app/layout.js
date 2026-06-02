import { Space_Grotesk, Source_Sans_3, IBM_Plex_Mono } from 'next/font/google';
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
});
const sourceSans3 = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-source-sans',
});
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

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
    <html lang="es" className={`${spaceGrotesk.variable} ${sourceSans3.variable} ${ibmPlexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}

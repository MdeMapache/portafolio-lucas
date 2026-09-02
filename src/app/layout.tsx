import type { Metadata } from "next";
import { Oswald, Inter, JetBrains_Mono } from "next/font/google";
import AudioController from "@/components/AudioController";
import { AuthProvider } from "@/components/AuthProvider";
import BackgroundLayer from "@/components/BackgroundLayer";
import { PortfolioProvider } from "@/components/PortfolioProvider";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Mapache — Portafolio Dev",
  description: "Portafolio de desarrollo de software, estilo perfil de Steam.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${oswald.variable} ${inter.variable} ${jetbrains.variable} font-body min-h-screen`}
      >
        {/*
          AuthProvider va por fuera porque quién sos no depende del contenido,
          pero el contenido sí depende de quién sos (qué controles se muestran).
          BackgroundLayer va acá y no en la página para que el fondo no se
          remonte al navegar.
        */}
        <AuthProvider>
          <PortfolioProvider>
            <BackgroundLayer />
            {/* Fuera de la página: el control es global y no debe remontarse
                al cambiar de sección, o la música se cortaría en cada clic. */}
            <AudioController />
            {children}
          </PortfolioProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

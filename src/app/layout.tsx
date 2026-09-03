import type { Metadata } from "next";
import { Oswald, Inter, JetBrains_Mono } from "next/font/google";
import AudioController from "@/components/AudioController";
import { AuthProvider } from "@/components/AuthProvider";
import BackgroundLayer from "@/components/BackgroundLayer";
import { PortfolioProvider } from "@/components/PortfolioProvider";
import { getProfileForMetadata, getSiteUrl } from "@/lib/portfolio/profileServer";
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

/**
 * Metadatos y vista previa del enlace.
 *
 * Se generan en el servidor leyendo el perfil de Supabase, para que el título y
 * la descripción que ve alguien al pegar la URL sean los mismos que el sitio
 * muestra. Con metadatos fijos, cambiar el nombre desde el panel dejaba el
 * `<head>` desactualizado sin que nadie se enterara.
 *
 * `getProfileForMetadata` nunca falla: si Supabase está pausado o caído cae a
 * los defaults, así que la página se sigue sirviendo igual.
 */
export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfileForMetadata();
  const site = getSiteUrl();
  const titulo = `${profile.name} — ${profile.role}`;

  return {
    metadataBase: new URL(site),
    title: titulo,
    description: profile.bio,
    openGraph: {
      type: "profile",
      locale: "es_CL",
      url: site,
      title: titulo,
      description: profile.bio,
      siteName: `${profile.name} · Portafolio`,
    },
    twitter: {
      card: "summary_large_image",
      title: titulo,
      description: profile.bio,
    },
  };
}

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

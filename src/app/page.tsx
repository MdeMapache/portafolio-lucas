import SectionRouter from "@/components/layout/SectionRouter";

/**
 * La página es sólo el contenedor: toda la navegación ocurre en el cliente
 * dentro de SectionRouter, que monta y desmonta paneles sin cambiar de ruta.
 */
export default function Home() {
  return (
    <>
      <SectionRouter />

      <footer className="relative z-[1] text-center py-6 font-mono text-[10px] text-steam-dim/50 tracking-wider">
        PORTAFOLIO.DEV // NEXT.JS · TYPESCRIPT · TAILWIND · SUPABASE
      </footer>
    </>
  );
}

import SectionRouter from "@/components/layout/SectionRouter";

/**
 * La página es sólo el contenedor: toda la navegación ocurre en el cliente
 * dentro de SectionRouter, que monta y desmonta paneles sin cambiar de ruta.
 */
export default function Home() {
  return (
    <>
      <SectionRouter />

      {/* `px-4` y `break-words`: con la escala de texto al máximo esta línea no
          entraba en un teléfono y desbordaba el ancho del documento. */}
      <footer className="relative z-[1] text-center px-4 py-6 font-mono text-[10px] text-steam-dim/50 tracking-wider break-words">
        PORTAFOLIO.DEV // NEXT.JS · TYPESCRIPT · TAILWIND · SUPABASE
      </footer>
    </>
  );
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        /*
          Aislamiento de origen SÓLO para los demos autohospedados.

          Godot 4 exporta a web con hilos por defecto, y eso usa
          SharedArrayBuffer, que el navegador únicamente habilita en documentos
          "cross-origin isolated". Estas dos cabeceras lo consiguen.

          Va acotado a /demos/ a propósito: aplicar COEP require-corp a todo el
          sitio bloquearía las imágenes de Supabase Storage, que se sirven desde
          otro origen sin cabecera CORP. Sería cambiar un problema por otro.

          Aun con esto, un build CON hilos no se puede embeber en un iframe
          desde una página que no esté aislada. Para que el demo se vea dentro
          del portafolio hay que exportar SIN hilos. Ver public/demos/README.md.
        */
        source: "/demos/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
          // Permite que el propio portafolio lo embeba.
          { key: "Cross-Origin-Resource-Policy", value: "same-site" },
        ],
      },
      {
        /*
          El .wasm y el .pck pesan 50 MB juntos, así que conviene que el
          navegador los reutilice entre visitas.

          Acá había `immutable, max-age=31536000` con el argumento de que son
          inmutables por build. Es falso: no llevan hash en el nombre. Cada
          export nuevo pisa `index.pck` con el mismo nombre, así que la URL no
          cambia. Y `immutable` significa literalmente "no vuelvas a preguntar":
          el navegador no revalida ni con recarga normal. Resultado: cualquiera
          que hubiera abierto la demo se quedaba con esa versión hasta un año,
          y publicar un nivel nuevo no llegaba a nadie.

          `must-revalidate` conserva la copia local y sólo pregunta si cambió.
          Si no cambió, la respuesta es un 304 sin cuerpo: los 50 MB no se
          vuelven a bajar. Son un par de cientos de bytes por visita a cambio de
          que la demo se pueda actualizar, que es el único comportamiento
          aceptable para un archivo que se sobrescribe.
        */
        source: "/demos/:path*.(wasm|pck|zip)",
        headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;

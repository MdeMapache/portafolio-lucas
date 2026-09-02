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
        // Los .wasm y .pck de Godot son inmutables por build: conviene
        // cachearlos fuerte para que el demo no se descargue entero cada vez.
        source: "/demos/:path*.(wasm|pck|zip)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;

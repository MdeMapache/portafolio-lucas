import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        /*
          Acá vivían `Cross-Origin-Opener-Policy: same-origin` y
          `Cross-Origin-Embedder-Policy: require-corp`, para dar aislamiento de
          origen a un export de Godot con hilos, que necesita SharedArrayBuffer.

          Se fueron porque nunca sirvieron: un documento aislado tampoco puede
          embeberse en un iframe cuyo padre no lo esté, así que la demo se
          exporta SIN hilos desde el principio (ver public/demos/README.md). No
          habilitaban nada.

          Y sí rompían algo. `require-corp` bloquea cualquier subrecurso
          cross-origin sin cabecera CORP, incluidos los scripts que cargan los
          SDK de Google: con la demo de TavernQuest —que es la app Flutter real
          contra Firebase— el navegador cortaba pedidos con
          ERR_BLOCKED_BY_RESPONSE.NotSameOriginAfterDefaultedToSameOriginByCoep.

          Queda sólo CORP, que es lo que permite que el portafolio embeba sus
          propias demos en un iframe.
        */
        source: "/demos/:path*",
        headers: [{ key: "Cross-Origin-Resource-Policy", value: "same-site" }],
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

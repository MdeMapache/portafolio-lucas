import { ImageResponse } from "next/og";
import { getProfileForMetadata } from "@/lib/portfolio/profileServer";

export const alt = "Portafolio — panel de piloto";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Imagen de vista previa del enlace.
 *
 * Es lo que se ve cuando alguien pega la URL en WhatsApp, Discord o LinkedIn.
 * Reproduce la chapa del sitio: placa biselada, escuadras, franja de peligro y
 * fósforo sobre acero.
 *
 * Se dibuja con Satori, que soporta un subconjunto de CSS: sólo flexbox —nada
 * de grid—, todo contenedor con más de un hijo necesita `display: flex`
 * explícito, y no hay fuentes del sistema más allá de las que trae. Por eso el
 * diseño se apoya en color, bloques y proporción en vez de tipografía.
 */
export default async function Image() {
  const profile = await getProfileForMetadata();

  const acero = "#5f8ca8";
  const ambar = "#e8b020";
  const fosforo = "#5fd17a";
  const fondo = "#0a0d10";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: fondo,
          // Rejilla técnica de fondo, como la del sitio.
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(95,140,168,.07) 0 1px, transparent 1px 44px), repeating-linear-gradient(90deg, rgba(95,140,168,.07) 0 1px, transparent 1px 44px)",
          padding: 48,
          position: "relative",
        }}
      >
        {/* Franja de peligro superior. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 14,
            backgroundImage:
              "repeating-linear-gradient(-45deg, #e8b020 0 14px, #12100a 14px 28px)",
          }}
        />

        {/* Escuadras de las cuatro esquinas. */}
        {[
          { top: 34, left: 34, borderTop: `4px solid ${acero}`, borderLeft: `4px solid ${acero}` },
          { top: 34, right: 34, borderTop: `4px solid ${acero}`, borderRight: `4px solid ${acero}` },
          { bottom: 34, left: 34, borderBottom: `4px solid ${acero}`, borderLeft: `4px solid ${acero}` },
          { bottom: 34, right: 34, borderBottom: `4px solid ${acero}`, borderRight: `4px solid ${acero}` },
        ].map((pos, i) => (
          <div key={i} style={{ position: "absolute", width: 46, height: 46, ...pos }} />
        ))}

        {/* Cabecera: placa con rótulo + indicador de segmentos. */}
        <div style={{ display: "flex", alignItems: "center", marginTop: 18 }}>
          <div
            style={{
              display: "flex",
              backgroundColor: acero,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 8,
              paddingBottom: 8,
            }}
          >
            <div style={{ color: fondo, fontSize: 20, letterSpacing: 6, fontWeight: 700 }}>
              PILOTO
            </div>
          </div>

          <div style={{ display: "flex", marginLeft: 18 }}>
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                style={{
                  width: 6,
                  height: 22,
                  backgroundColor: fosforo,
                  marginRight: 5,
                  opacity: 1 - i * 0.15,
                }}
              />
            ))}
          </div>
        </div>

        {/* Lectura de telemetría, arriba a la derecha. Es puro instrumental,
            pero sin esto la mitad superior queda vacía y la composición se
            desbalancea hacia abajo. */}
        <div
          style={{
            position: "absolute",
            top: 96,
            right: 62,
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
          }}
        >
          {[
            { w: 168, c: fosforo, o: 0.85 },
            { w: 132, c: ambar, o: 0.7 },
            { w: 196, c: acero, o: 0.55 },
            { w: 104, c: ambar, o: 0.4 },
            { w: 150, c: acero, o: 0.3 },
          ].map((b, i) => (
            <div key={i} style={{ display: "flex", marginBottom: 9 }}>
              <div style={{ width: b.w, height: 7, backgroundColor: b.c, opacity: b.o }} />
            </div>
          ))}
        </div>

        {/* Identidad. */}
        <div style={{ display: "flex", flexDirection: "column", marginTop: "auto" }}>
          {/* Regla de escala sobre el nombre. */}
          <div
            style={{
              display: "flex",
              height: 8,
              width: 420,
              marginBottom: 20,
              backgroundImage:
                "repeating-linear-gradient(90deg, rgba(95,140,168,.6) 0 2px, transparent 2px 16px)",
            }}
          />

          <div style={{ display: "flex", color: acero, fontSize: 22, letterSpacing: 4 }}>
            {`${profile.name.replace(/\s+/g, "").toUpperCase()}.EXE`}
          </div>

          <div
            style={{
              display: "flex",
              color: "#eef3f8",
              fontSize: 84,
              fontWeight: 700,
              letterSpacing: -1,
              marginTop: 6,
            }}
          >
            {profile.name}
          </div>

          <div style={{ display: "flex", color: "#c2ccd6", fontSize: 30, marginTop: 10 }}>
            {profile.role}
          </div>

          <div style={{ display: "flex", color: "#7d8a97", fontSize: 22, marginTop: 6 }}>
            {profile.location}
          </div>
        </div>

        {/* Pie: estado, con el punto verde de "operativo". */}
        <div style={{ display: "flex", alignItems: "center", marginTop: 34 }}>
          <div style={{ width: 10, height: 10, backgroundColor: fosforo, marginRight: 12 }} />
          <div style={{ display: "flex", color: fosforo, fontSize: 18, letterSpacing: 4 }}>
            SISTEMA OPERATIVO
          </div>
          <div style={{ display: "flex", flex: 1 }} />
          <div style={{ display: "flex", color: ambar, fontSize: 18, letterSpacing: 4 }}>
            PROYECTOS · DEMOS · CV
          </div>
        </div>
      </div>
    ),
    size,
  );
}

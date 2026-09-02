/**
 * Catálogo de fondos de perfil, equivalente a los "Fondos Animados de Perfil"
 * de Steam. Cada preset es puro CSS (gradientes + keyframes definidos en
 * globals.css), así que no pesan nada y animan sin JavaScript.
 *
 * Además de estos, el usuario puede subir su propio GIF desde el panel de
 * edición; ese caso lo maneja `BackgroundChoice.kind === "custom"`.
 */
export type BackgroundPreset = {
  id: string;
  label: string;
  /** Clase aplicada a la capa de fondo; los keyframes viven en globals.css. */
  className: string;
  /** Miniatura para el selector del panel de edición. */
  swatch: string;
  animated: boolean;
};

export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  {
    id: "steam-default",
    label: "Steam clásico",
    className: "bg-preset-steam",
    swatch: "radial-gradient(ellipse at top, #22344a 0%, #1b2838 45%, #0e1621 100%)",
    animated: false,
  },
  {
    id: "green-data",
    label: "Data (verde)",
    className: "bg-preset-data",
    swatch: "linear-gradient(135deg, #04170a 0%, #0b3d17 50%, #04170a 100%)",
    animated: true,
  },
  {
    id: "nebula",
    label: "Nebulosa",
    className: "bg-preset-nebula",
    swatch: "linear-gradient(135deg, #1a1040 0%, #3b1d6e 50%, #0e1621 100%)",
    animated: true,
  },
  {
    id: "synthwave",
    label: "Synthwave",
    className: "bg-preset-synthwave",
    swatch: "linear-gradient(180deg, #2b1055 0%, #7b2d8e 60%, #ff2e88 100%)",
    animated: true,
  },
  {
    id: "terminal",
    label: "Terminal",
    className: "bg-preset-terminal",
    swatch: "linear-gradient(180deg, #001b0e 0%, #00120a 100%)",
    animated: true,
  },
];

export const DEFAULT_BACKGROUND_ID = "steam-default";

export function findPreset(id: string): BackgroundPreset {
  return BACKGROUND_PRESETS.find((p) => p.id === id) ?? BACKGROUND_PRESETS[0];
}

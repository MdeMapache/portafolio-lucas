"use client";

import { useRef, useState } from "react";
import AssetImage from "@/components/ui/AssetImage";
import { usePortfolio } from "@/components/PortfolioProvider";
import { BACKGROUND_PRESETS } from "@/lib/portfolio/backgrounds";
import { Button, Field } from "./fields";

/**
 * Pestaña "Fondo": el equivalente a los Fondos Animados de Perfil de Steam.
 * Ofrece el catálogo de presets y la opción de subir un GIF propio.
 */
export default function BackgroundTab() {
  const { data, update, uploadAsset, deleteAsset } = usePortfolio();
  const { background } = data;

  const [uploading, setUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const previous = background.kind === "custom" ? background.assetId : null;
    const id = await uploadAsset(file);

    if (id) {
      await update({ background: { kind: "custom", assetId: id } });
      if (previous) await deleteAsset(previous);
    }

    setUploading(false);
    e.target.value = "";
  }

  async function selectPreset(presetId: string) {
    const previous = background.kind === "custom" ? background.assetId : null;
    await update({ background: { kind: "preset", presetId } });
    // El GIF anterior ya no lo referencia nadie: lo sacamos de IndexedDB.
    if (previous) await deleteAsset(previous);
  }

  return (
    <div>
      <Field label="Fondos disponibles" hint="Se aplican al instante y quedan guardados.">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {BACKGROUND_PRESETS.map((preset) => {
            const active = background.kind === "preset" && background.presetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => selectPreset(preset.id)}
                aria-pressed={active}
                className={`group relative h-20 border transition-all overflow-hidden ${
                  active
                    ? "border-steam-link ring-1 ring-steam-link/50"
                    : "border-steam-line hover:border-steam-link/70 hover:-translate-y-0.5"
                }`}
                style={{ background: preset.swatch }}
              >
                <span className="absolute inset-x-0 bottom-0 bg-black/65 px-2 py-1 text-left text-[10.5px] text-steam-text">
                  {preset.label}
                  {preset.animated ? (
                    <span className="ml-1 text-steam-green" title="Animado">
                      &#9679;
                    </span>
                  ) : null}
                </span>
                {active ? (
                  <span className="absolute top-1 right-1.5 text-steam-link text-xs">&#10003;</span>
                ) : null}
              </button>
            );
          })}
        </div>
      </Field>

      <Field
        label="Fondo propio"
        hint="Imagen o GIF animado. Se guarda en IndexedDB, así que aguanta archivos grandes."
      >
        <div className="flex items-center gap-4">
          <div className="w-28 h-20 shrink-0 border border-steam-line bg-steam-bgDeep flex items-center justify-center overflow-hidden">
            {background.kind === "custom" ? (
              <AssetImage
                assetId={background.assetId}
                alt="Vista previa del fondo"
                className="w-full h-full object-cover"
                fallback={<span className="text-[10px] text-steam-dim">cargando…</span>}
              />
            ) : (
              <span className="text-[10px] text-steam-dim">sin fondo propio</span>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant={background.kind === "custom" ? "ghost" : "primary"}
              onClick={() => fileInput.current?.click()}
              disabled={uploading}
            >
              {uploading ? "Subiendo…" : background.kind === "custom" ? "Reemplazar" : "Subir GIF"}
            </Button>
            {background.kind === "custom" ? (
              <Button type="button" variant="danger" onClick={() => selectPreset("steam-default")}>
                Quitar
              </Button>
            ) : null}
          </div>

          <input
            ref={fileInput}
            type="file"
            accept="image/*,image/gif"
            className="hidden"
            onChange={handleUpload}
          />
        </div>
      </Field>
    </div>
  );
}

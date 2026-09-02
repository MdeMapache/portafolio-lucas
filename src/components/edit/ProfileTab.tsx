"use client";

import { useRef, useState } from "react";
import AssetImage from "@/components/ui/AssetImage";
import { usePortfolio } from "@/components/PortfolioProvider";
import { Button, EditRow, Field, LevelSlider, TextArea, TextInput } from "./fields";

/** Pestaña "Perfil": avatar, datos personales, chips de tecnologías y CV. */
export default function ProfileTab() {
  const { data, update, uploadAsset, deleteAsset } = usePortfolio();
  const { profile } = data;

  const [busy, setBusy] = useState<null | "avatar" | "cv">(null);
  const avatarInput = useRef<HTMLInputElement>(null);
  const cvInput = useRef<HTMLInputElement>(null);

  /** Parchea un subconjunto del perfil sin pisar el resto. */
  function patchProfile(patch: Partial<typeof profile>) {
    return update({ profile: { ...profile, ...patch } });
  }

  async function handleAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setBusy("avatar");
    const previous = profile.avatarAssetId;
    const id = await uploadAsset(file);

    if (id) {
      await patchProfile({ avatarAssetId: id });
      // Recién borramos el anterior cuando el nuevo ya quedó guardado.
      if (previous) await deleteAsset(previous);
    }

    setBusy(null);
    e.target.value = "";
  }

  async function handleCv(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setBusy("cv");
    const previous = data.cvAssetId;
    const id = await uploadAsset(file);

    if (id) {
      await update({ cvAssetId: id });
      if (previous) await deleteAsset(previous);
    }

    setBusy(null);
    e.target.value = "";
  }

  function updateTag(index: number, value: string) {
    const tags = [...profile.tags];
    tags[index] = value;
    patchProfile({ tags });
  }

  return (
    <div>
      {/* Avatar ------------------------------------------------------------ */}
      <Field label="Foto de perfil" hint="Acepta imágenes y GIF animados.">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 shrink-0 border-2 border-steam-line bg-gradient-to-br from-red-500 to-purple-700 flex items-center justify-center overflow-hidden">
            <AssetImage
              assetId={profile.avatarAssetId}
              alt="Vista previa del avatar"
              className="w-full h-full object-cover"
              fallback={
                <span className="font-display text-2xl text-white">
                  {profile.name.charAt(0) || "?"}
                </span>
              }
            />
          </div>
          <div className="flex gap-2">
            <Button type="button" onClick={() => avatarInput.current?.click()} disabled={busy !== null}>
              {busy === "avatar" ? "Subiendo…" : "Cambiar"}
            </Button>
            {profile.avatarAssetId ? (
              <Button
                type="button"
                variant="danger"
                onClick={async () => {
                  const previous = profile.avatarAssetId;
                  await patchProfile({ avatarAssetId: null });
                  if (previous) await deleteAsset(previous);
                }}
              >
                Quitar
              </Button>
            ) : null}
          </div>
          <input
            ref={avatarInput}
            type="file"
            accept="image/*,image/gif"
            className="hidden"
            onChange={handleAvatar}
          />
        </div>
      </Field>

      {/* Datos ------------------------------------------------------------- */}
      <Field label="Nombre">
        <TextInput
          value={profile.name}
          onChange={(e) => patchProfile({ name: e.target.value })}
          placeholder="Mapache"
        />
      </Field>

      <Field label="Rol">
        <TextInput
          value={profile.role}
          onChange={(e) => patchProfile({ role: e.target.value })}
          placeholder="Desarrollador Frontend & Game Dev"
        />
      </Field>

      <Field label="Ubicación">
        <TextInput
          value={profile.location}
          onChange={(e) => patchProfile({ location: e.target.value })}
          placeholder="Quilpué, Chile"
        />
      </Field>

      <Field label="Descripción">
        <TextArea
          rows={4}
          value={profile.bio}
          onChange={(e) => patchProfile({ bio: e.target.value })}
        />
      </Field>

      <Field label="Nivel">
        <LevelSlider value={profile.level} max={100} onChange={(level) => patchProfile({ level })} />
      </Field>

      <Field label="Estado">
        <label className="flex items-center gap-2.5 text-[13px] text-steam-text cursor-pointer">
          <input
            type="checkbox"
            checked={profile.availableForWork}
            onChange={(e) => patchProfile({ availableForWork: e.target.checked })}
            className="accent-steam-green w-4 h-4"
          />
          Disponible para trabajar
        </label>
      </Field>

      {/* Chips ------------------------------------------------------------- */}
      <Field label="Chips de tecnologías" hint="Los que salen bajo el nombre en el encabezado.">
        <div>
          {profile.tags.map((tag, i) => (
            <EditRow
              key={i}
              onRemove={() => patchProfile({ tags: profile.tags.filter((_, j) => j !== i) })}
            >
              <TextInput value={tag} onChange={(e) => updateTag(i, e.target.value)} />
            </EditRow>
          ))}
          <Button
            type="button"
            onClick={() => patchProfile({ tags: [...profile.tags, "NUEVA TECNOLOGÍA"] })}
          >
            + Agregar chip
          </Button>
        </div>
      </Field>

      {/* CV ---------------------------------------------------------------- */}
      <Field label="Curriculum Vitae" hint="PDF. Se muestra en el visor del encabezado.">
        <div className="flex items-center gap-2.5">
          <span className="text-[12px] text-steam-dim">
            {data.cvAssetId ? "PDF cargado" : "Sin CV cargado"}
          </span>
          <Button type="button" onClick={() => cvInput.current?.click()} disabled={busy !== null}>
            {busy === "cv" ? "Subiendo…" : data.cvAssetId ? "Reemplazar" : "Subir PDF"}
          </Button>
          {data.cvAssetId ? (
            <Button
              type="button"
              variant="danger"
              onClick={async () => {
                const previous = data.cvAssetId;
                await update({ cvAssetId: null });
                if (previous) await deleteAsset(previous);
              }}
            >
              Quitar
            </Button>
          ) : null}
          <input
            ref={cvInput}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={handleCv}
          />
        </div>
      </Field>
    </div>
  );
}

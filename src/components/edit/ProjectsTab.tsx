"use client";

import { useRef, useState } from "react";
import AssetImage from "@/components/ui/AssetImage";
import { usePortfolio } from "@/components/PortfolioProvider";
import type { Project } from "@/lib/portfolio/types";
import { Button, Field, LevelSlider, TextArea, TextInput } from "./fields";

function newProject(): Project {
  return {
    id: `pr-${Date.now().toString(36)}`,
    icon: "📦",
    title: "Proyecto nuevo",
    description: "",
    longDescription: "",
    lastCommit: "hoy",
    done: 0,
    total: 10,
    demoUrl: null,
    repoUrl: null,
    tech: [],
    screenshotAssetIds: [],
    featured: false,
  };
}

/**
 * Pestaña "Proyectos": la vitrina de demos.
 *
 * Cada proyecto lleva enlace a demo en vivo, enlace al repositorio, capturas y
 * avance. Igual que en Steam, uno solo puede quedar destacado arriba.
 */
export default function ProjectsTab() {
  const { data, update, uploadAsset, deleteAsset } = usePortfolio();
  const { projects } = data;

  const [openId, setOpenId] = useState<string | null>(projects[0]?.id ?? null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const shotInput = useRef<HTMLInputElement>(null);
  const shotTargetId = useRef<string | null>(null);

  function patchProject(id: string, patch: Partial<Project>) {
    update({ projects: projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
  }

  /** Destacar uno implica desdestacar el resto. */
  function setFeatured(id: string) {
    update({ projects: projects.map((p) => ({ ...p, featured: p.id === id })) });
  }

  async function removeProject(project: Project) {
    update({ projects: projects.filter((p) => p.id !== project.id) });
    // Las capturas del proyecto borrado quedarían huérfanas en IndexedDB.
    for (const assetId of project.screenshotAssetIds) await deleteAsset(assetId);
  }

  function pickScreenshot(projectId: string) {
    shotTargetId.current = projectId;
    shotInput.current?.click();
  }

  async function handleScreenshot(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    const projectId = shotTargetId.current;
    if (!file || !projectId) return;

    setUploadingFor(projectId);
    const id = await uploadAsset(file);
    const project = projects.find((p) => p.id === projectId);

    if (id && project) {
      patchProject(projectId, { screenshotAssetIds: [...project.screenshotAssetIds, id] });
    }

    setUploadingFor(null);
    shotTargetId.current = null;
    e.target.value = "";
  }

  async function removeScreenshot(project: Project, assetId: string) {
    patchProject(project.id, {
      screenshotAssetIds: project.screenshotAssetIds.filter((a) => a !== assetId),
    });
    await deleteAsset(assetId);
  }

  return (
    <div>
      {projects.map((project) => {
        const open = openId === project.id;

        return (
          <div key={project.id} className="mb-3 border border-steam-line/60 bg-steam-bgDeep/60">
            {/* Cabecera plegable ------------------------------------------ */}
            <div className="flex items-center gap-2 px-3 py-2">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : project.id)}
                className="flex-1 flex items-center gap-2.5 text-left min-w-0"
                aria-expanded={open}
              >
                <span className="text-lg shrink-0">{project.icon}</span>
                <span className="text-[13px] text-steam-bright truncate">{project.title}</span>
                {project.featured ? (
                  <span className="shrink-0 text-[9px] font-mono uppercase px-1.5 py-0.5 border border-steam-gold text-steam-gold">
                    destacado
                  </span>
                ) : null}
                <span className="ml-auto shrink-0 text-steam-dim text-xs">{open ? "▾" : "▸"}</span>
              </button>
              <Button type="button" variant="danger" onClick={() => removeProject(project)}>
                Borrar
              </Button>
            </div>

            {/* Cuerpo ------------------------------------------------------ */}
            {open ? (
              <div className="px-3 pb-3 pt-1 border-t border-steam-line/60">
                <div className="flex gap-3">
                  <div className="w-16">
                    <Field label="Icono">
                      <TextInput
                        value={project.icon}
                        maxLength={4}
                        onChange={(e) => patchProject(project.id, { icon: e.target.value })}
                        className="text-center text-lg"
                      />
                    </Field>
                  </div>
                  <div className="flex-1">
                    <Field label="Título">
                      <TextInput
                        value={project.title}
                        onChange={(e) => patchProject(project.id, { title: e.target.value })}
                      />
                    </Field>
                  </div>
                </div>

                <Field label="Resumen" hint="Una línea. Es lo que se ve en la tarjeta.">
                  <TextInput
                    value={project.description}
                    onChange={(e) => patchProject(project.id, { description: e.target.value })}
                  />
                </Field>

                <Field label="Descripción detallada" hint="Se muestra al expandir el proyecto.">
                  <TextArea
                    rows={4}
                    value={project.longDescription}
                    onChange={(e) => patchProject(project.id, { longDescription: e.target.value })}
                  />
                </Field>

                {/*
                  No es `type="url"`: un demo autohospedado en `public/demos/`
                  se carga con una ruta relativa, que `type="url"` marca como
                  inválida. Ver public/demos/README.md.
                */}
                <Field
                  label="Demo en vivo"
                  hint="URL completa, o una ruta propia como /demos/runner-2d/index.html."
                >
                  <TextInput
                    type="text"
                    placeholder="/demos/runner-2d/index.html"
                    value={project.demoUrl ?? ""}
                    onChange={(e) =>
                      patchProject(project.id, { demoUrl: e.target.value.trim() || null })
                    }
                  />
                </Field>

                <Field label="Repositorio">
                  <TextInput
                    type="url"
                    placeholder="https://github.com/usuario/repo"
                    value={project.repoUrl ?? ""}
                    onChange={(e) =>
                      patchProject(project.id, { repoUrl: e.target.value.trim() || null })
                    }
                  />
                </Field>

                <Field label="Tecnologías" hint="Separadas por coma.">
                  <TextInput
                    value={project.tech.join(", ")}
                    onChange={(e) =>
                      patchProject(project.id, {
                        tech: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                  />
                </Field>

                <div className="flex gap-3">
                  <div className="flex-1">
                    <Field label="Tareas hechas">
                      <LevelSlider
                        value={project.done}
                        max={project.total}
                        onChange={(done) => patchProject(project.id, { done })}
                      />
                    </Field>
                  </div>
                  <div className="w-28">
                    <Field label="Total">
                      <TextInput
                        type="number"
                        min={1}
                        value={project.total}
                        onChange={(e) => {
                          const total = Math.max(1, Number(e.target.value) || 1);
                          // El avance no puede superar el total.
                          patchProject(project.id, { total, done: Math.min(project.done, total) });
                        }}
                      />
                    </Field>
                  </div>
                </div>

                <Field label="Último commit" hint='Texto libre, ej. "hace 2 días".'>
                  <TextInput
                    value={project.lastCommit}
                    onChange={(e) => patchProject(project.id, { lastCommit: e.target.value })}
                  />
                </Field>

                <Field label="Capturas">
                  <div className="flex flex-wrap items-center gap-2">
                    {project.screenshotAssetIds.map((assetId) => (
                      <div key={assetId} className="relative">
                        <div className="w-20 h-14 border border-steam-line overflow-hidden bg-steam-bgDeep">
                          <AssetImage
                            assetId={assetId}
                            alt="Captura del proyecto"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeScreenshot(project, assetId)}
                          aria-label="Eliminar captura"
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-black/80 text-white text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => pickScreenshot(project.id)}
                      disabled={uploadingFor === project.id}
                    >
                      {uploadingFor === project.id ? "Subiendo…" : "+ Captura"}
                    </Button>
                  </div>
                </Field>

                {!project.featured ? (
                  <Button type="button" variant="primary" onClick={() => setFeatured(project.id)}>
                    Destacar este proyecto
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        );
      })}

      <Button
        type="button"
        variant="primary"
        onClick={() => {
          const project = newProject();
          update({ projects: [...projects, project] });
          setOpenId(project.id);
        }}
      >
        + Agregar proyecto
      </Button>

      <input
        ref={shotInput}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleScreenshot}
      />
    </div>
  );
}

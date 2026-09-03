"use client";

import { useState } from "react";
import { usePortfolio } from "@/components/PortfolioProvider";
import type { Education, Experience, Language } from "@/lib/portfolio/types";
import { Button, EditRow, Field, TextArea, TextInput } from "./fields";

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Interruptor "sigue vigente".
 *
 * Traduce el checkbox al `end: string | null` del modelo. Cuando se destilda
 * hay que poner *algo* en `end`, porque un string vacío se vería igual que
 * seguir vigente: se propone el año actual y que lo corrija quien edita.
 */
function CurrentToggle({
  end,
  onChange,
}: {
  end: string | null;
  onChange: (end: string | null) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-[11.5px] text-steam-dim cursor-pointer">
      <input
        type="checkbox"
        checked={end === null}
        onChange={(e) => onChange(e.target.checked ? null : String(new Date().getFullYear()))}
        className="mech-check"
      />
      Actualmente
    </label>
  );
}

/** Dos campos de fecha en una fila, con el interruptor de vigencia. */
function PeriodFields({
  start,
  end,
  onStart,
  onEnd,
}: {
  start: string;
  end: string | null;
  onStart: (v: string) => void;
  onEnd: (v: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      <TextInput
        value={start}
        placeholder="May. 2025"
        onChange={(e) => onStart(e.target.value)}
        className="w-32"
        aria-label="Desde"
      />
      <span className="text-steam-dim text-[12px]">—</span>
      <TextInput
        value={end ?? ""}
        placeholder="Sep. 2025"
        disabled={end === null}
        onChange={(e) => onEnd(e.target.value)}
        className="w-32 disabled:opacity-40"
        aria-label="Hasta"
      />
      <CurrentToggle end={end} onChange={onEnd} />
    </div>
  );
}

/**
 * Pestaña "Trayectoria": experiencia laboral, formación e idiomas.
 *
 * Las tareas de cada puesto se editan como texto libre, una por línea. Es más
 * cómodo que una lista de inputs con botones de agregar y borrar por viñeta, y
 * el modelo sigue guardando un array — la conversión se hace acá.
 */
export default function TrayectoriaTab() {
  const { data, update } = usePortfolio();
  const { experience, education, languages } = data;

  const [openId, setOpenId] = useState<string | null>(experience[0]?.id ?? null);

  function patchExp(id: string, patch: Partial<Experience>) {
    update({ experience: experience.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  }

  function patchEdu(id: string, patch: Partial<Education>) {
    update({ education: education.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  }

  function patchLang(id: string, patch: Partial<Language>) {
    update({ languages: languages.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
  }

  return (
    <div>
      {/* Experiencia ------------------------------------------------------ */}
      <Field label="Experiencia laboral" hint="El orden de la lista es el que se ve en el sitio.">
        <div>
          {experience.map((item) => {
            const open = openId === item.id;

            return (
              <div key={item.id} className="mb-3 border border-steam-line/60 bg-steam-bgDeep/60">
                <div className="flex items-center gap-2 px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : item.id)}
                    aria-expanded={open}
                    className="flex-1 flex items-center gap-2.5 text-left min-w-0"
                  >
                    <span className="text-[13px] text-steam-bright truncate">
                      {item.role || "Sin cargo"}
                    </span>
                    <span className="text-[11.5px] text-steam-dim truncate">{item.company}</span>
                    {item.end === null ? (
                      <span className="shrink-0 text-[9px] font-mono uppercase px-1.5 py-0.5 border border-steam-green text-steam-green">
                        activo
                      </span>
                    ) : null}
                    <span className="ml-auto shrink-0 text-steam-dim text-xs">
                      {open ? "▾" : "▸"}
                    </span>
                  </button>
                  <Button
                    type="button"
                    variant="danger"
                    onClick={() =>
                      update({ experience: experience.filter((x) => x.id !== item.id) })
                    }
                  >
                    Borrar
                  </Button>
                </div>

                {open ? (
                  <div className="px-3 pb-3 pt-1 border-t border-steam-line/60">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-3">
                      <Field label="Cargo">
                        <TextInput
                          value={item.role}
                          onChange={(e) => patchExp(item.id, { role: e.target.value })}
                        />
                      </Field>
                      <Field label="Empresa">
                        <TextInput
                          value={item.company}
                          onChange={(e) => patchExp(item.id, { company: e.target.value })}
                        />
                      </Field>
                    </div>

                    <Field label="Ubicación">
                      <TextInput
                        value={item.location}
                        onChange={(e) => patchExp(item.id, { location: e.target.value })}
                      />
                    </Field>

                    <span className="block text-[11px] uppercase tracking-wide text-steam-dim mb-1.5">
                      Período
                    </span>
                    <PeriodFields
                      start={item.start}
                      end={item.end}
                      onStart={(start) => patchExp(item.id, { start })}
                      onEnd={(end) => patchExp(item.id, { end })}
                    />

                    <Field label="Resumen" hint="Una línea. Puede quedar vacía.">
                      <TextInput
                        value={item.summary}
                        onChange={(e) => patchExp(item.id, { summary: e.target.value })}
                      />
                    </Field>

                    <Field label="Tareas" hint="Una por línea. Las vacías se descartan.">
                      <TextArea
                        rows={6}
                        value={item.highlights.join("\n")}
                        onChange={(e) =>
                          patchExp(item.id, {
                            highlights: e.target.value.split("\n").filter((l) => l.trim() !== ""),
                          })
                        }
                      />
                    </Field>
                  </div>
                ) : null}
              </div>
            );
          })}

          <Button
            type="button"
            onClick={() => {
              const item: Experience = {
                id: newId("exp"),
                role: "Cargo nuevo",
                company: "",
                location: "",
                start: "",
                end: null,
                summary: "",
                highlights: [],
              };
              update({ experience: [...experience, item] });
              setOpenId(item.id);
            }}
          >
            + Agregar puesto
          </Button>
        </div>
      </Field>

      {/* Formación -------------------------------------------------------- */}
      <Field label="Formación">
        <div>
          {education.map((item) => (
            <EditRow
              key={item.id}
              onRemove={() => update({ education: education.filter((x) => x.id !== item.id) })}
            >
              <TextInput
                value={item.title}
                placeholder="Título"
                onChange={(e) => patchEdu(item.id, { title: e.target.value })}
                className="mb-2"
              />
              <div className="flex flex-wrap gap-2 mb-2">
                <TextInput
                  value={item.institution}
                  placeholder="Institución"
                  onChange={(e) => patchEdu(item.id, { institution: e.target.value })}
                  className="flex-1 min-w-[9rem]"
                />
                <TextInput
                  value={item.location}
                  placeholder="Ubicación"
                  onChange={(e) => patchEdu(item.id, { location: e.target.value })}
                  className="flex-1 min-w-[9rem]"
                />
              </div>
              <PeriodFields
                start={item.start}
                end={item.end}
                onStart={(start) => patchEdu(item.id, { start })}
                onEnd={(end) => patchEdu(item.id, { end })}
              />
            </EditRow>
          ))}

          <Button
            type="button"
            onClick={() =>
              update({
                education: [
                  ...education,
                  {
                    id: newId("edu"),
                    title: "",
                    institution: "",
                    location: "",
                    start: "",
                    end: null,
                  },
                ],
              })
            }
          >
            + Agregar formación
          </Button>
        </div>
      </Field>

      {/* Idiomas ---------------------------------------------------------- */}
      <Field label="Idiomas" hint="El nivel es texto libre. Vacío se muestra como sin declarar.">
        <div>
          {languages.map((lang) => (
            <EditRow
              key={lang.id}
              onRemove={() => update({ languages: languages.filter((l) => l.id !== lang.id) })}
            >
              <div className="flex flex-wrap gap-2">
                <TextInput
                  value={lang.name}
                  placeholder="Idioma"
                  onChange={(e) => patchLang(lang.id, { name: e.target.value })}
                  className="flex-1 min-w-[8rem]"
                />
                <TextInput
                  value={lang.level}
                  placeholder="Nivel (ej. B2, Intermedio)"
                  onChange={(e) => patchLang(lang.id, { level: e.target.value })}
                  className="flex-1 min-w-[8rem]"
                />
              </div>
            </EditRow>
          ))}

          <Button
            type="button"
            onClick={() =>
              update({ languages: [...languages, { id: newId("lang"), name: "", level: "" }] })
            }
          >
            + Agregar idioma
          </Button>
        </div>
      </Field>
    </div>
  );
}

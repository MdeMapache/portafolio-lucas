"use client";

import { usePortfolio } from "@/components/PortfolioProvider";
import type { Skill, TechBadge } from "@/lib/portfolio/types";
import { Button, EditRow, Field, LevelSlider, TextInput } from "./fields";

/** Genera un id único y estable para una fila nueva. */
function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

/** Pestaña "Stack": insignias de tecnologías y barras de nivel de dominio. */
export default function SkillsTab() {
  const { data, update } = usePortfolio();
  const { skills, techBadges } = data;

  function patchSkill(id: string, patch: Partial<Skill>) {
    update({ skills: skills.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  }

  function patchBadge(id: string, patch: Partial<TechBadge>) {
    update({ techBadges: techBadges.map((b) => (b.id === id ? { ...b, ...patch } : b)) });
  }

  return (
    <div>
      <Field label="Insignias del stack" hint="Cuadraditos de la barra lateral. Nivel de 0 a 5.">
        <div>
          {techBadges.map((badge) => (
            <EditRow
              key={badge.id}
              onRemove={() => update({ techBadges: techBadges.filter((b) => b.id !== badge.id) })}
            >
              <div className="flex items-center gap-3">
                <TextInput
                  value={badge.label}
                  maxLength={4}
                  onChange={(e) => patchBadge(badge.id, { label: e.target.value.toUpperCase() })}
                  className="w-20 text-center font-mono"
                />
                <div className="flex-1">
                  <LevelSlider
                    value={badge.level}
                    max={5}
                    onChange={(level) => patchBadge(badge.id, { level })}
                  />
                </div>
              </div>
            </EditRow>
          ))}
          <Button
            type="button"
            onClick={() =>
              update({
                techBadges: [...techBadges, { id: newId("tb"), label: "NEW", level: 1 }],
              })
            }
          >
            + Agregar insignia
          </Button>
        </div>
      </Field>

      <Field label="Nivel de dominio" hint="Las barras animadas de la barra lateral.">
        <div>
          {skills.map((skill) => (
            <EditRow
              key={skill.id}
              onRemove={() => update({ skills: skills.filter((s) => s.id !== skill.id) })}
            >
              <TextInput
                value={skill.name}
                onChange={(e) => patchSkill(skill.id, { name: e.target.value })}
                className="mb-2"
              />
              <LevelSlider
                value={skill.level}
                onChange={(level) => patchSkill(skill.id, { level })}
              />
            </EditRow>
          ))}
          <Button
            type="button"
            onClick={() =>
              update({ skills: [...skills, { id: newId("sk"), name: "Nueva skill", level: 50 }] })
            }
          >
            + Agregar skill
          </Button>
        </div>
      </Field>
    </div>
  );
}

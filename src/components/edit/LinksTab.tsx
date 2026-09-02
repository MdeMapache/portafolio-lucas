"use client";

import { usePortfolio } from "@/components/PortfolioProvider";
import type { Contact, Group, Stat } from "@/lib/portfolio/types";
import { Button, EditRow, Field, TextInput } from "./fields";

function newId(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Pestaña "Enlaces": las secciones de la barra lateral, equivalentes a los
 * Grupos de la Comunidad y las redes de un perfil de Steam, más los contadores
 * del encabezado.
 */
export default function LinksTab() {
  const { data, update } = usePortfolio();
  const { contacts, groups, stats } = data;

  function patchContact(id: string, patch: Partial<Contact>) {
    update({ contacts: contacts.map((c) => (c.id === id ? { ...c, ...patch } : c)) });
  }

  function patchGroup(id: string, patch: Partial<Group>) {
    update({ groups: groups.map((g) => (g.id === id ? { ...g, ...patch } : g)) });
  }

  function patchStat(id: string, patch: Partial<Stat>) {
    update({ stats: stats.map((s) => (s.id === id ? { ...s, ...patch } : s)) });
  }

  return (
    <div>
      <Field label="Redes y contacto" hint="El código son 1–2 caracteres, ej. GH, IN, @.">
        <div>
          {contacts.map((contact) => (
            <EditRow
              key={contact.id}
              onRemove={() => update({ contacts: contacts.filter((c) => c.id !== contact.id) })}
            >
              <div className="flex gap-2 mb-2">
                <TextInput
                  value={contact.code}
                  maxLength={2}
                  onChange={(e) => patchContact(contact.id, { code: e.target.value.toUpperCase() })}
                  className="w-14 text-center font-mono"
                  aria-label="Código"
                />
                <TextInput
                  value={contact.name}
                  onChange={(e) => patchContact(contact.id, { name: e.target.value })}
                  placeholder="Texto visible"
                  aria-label="Texto visible"
                />
              </div>
              <TextInput
                type="url"
                value={contact.url ?? ""}
                onChange={(e) => patchContact(contact.id, { url: e.target.value.trim() || null })}
                placeholder="https://… o mailto:…"
                className="mb-2"
                aria-label="Enlace"
              />
              <div className="flex items-center gap-3">
                <TextInput
                  value={contact.role}
                  onChange={(e) => patchContact(contact.id, { role: e.target.value })}
                  placeholder="Descripción corta"
                  aria-label="Descripción"
                />
                <label className="flex items-center gap-1.5 text-[11px] text-steam-dim whitespace-nowrap cursor-pointer">
                  <input
                    type="checkbox"
                    checked={contact.online}
                    onChange={(e) => patchContact(contact.id, { online: e.target.checked })}
                    className="accent-steam-green"
                  />
                  activo
                </label>
              </div>
            </EditRow>
          ))}
          <Button
            type="button"
            onClick={() =>
              update({
                contacts: [
                  ...contacts,
                  { id: newId("ct"), code: "??", name: "", role: "", url: null, online: true },
                ],
              })
            }
          >
            + Agregar contacto
          </Button>
        </div>
      </Field>

      <Field label="Comunidades y formación">
        <div>
          {groups.map((group) => (
            <EditRow
              key={group.id}
              onRemove={() => update({ groups: groups.filter((g) => g.id !== group.id) })}
            >
              <div className="flex gap-2 mb-2">
                <TextInput
                  value={group.icon}
                  maxLength={4}
                  onChange={(e) => patchGroup(group.id, { icon: e.target.value })}
                  className="w-14 text-center"
                  aria-label="Icono"
                />
                <TextInput
                  value={group.name}
                  onChange={(e) => patchGroup(group.id, { name: e.target.value })}
                  placeholder="Nombre"
                  aria-label="Nombre"
                />
              </div>
              <TextInput
                value={group.sub}
                onChange={(e) => patchGroup(group.id, { sub: e.target.value })}
                placeholder="Subtítulo"
                className="mb-2"
                aria-label="Subtítulo"
              />
              <TextInput
                type="url"
                value={group.url ?? ""}
                onChange={(e) => patchGroup(group.id, { url: e.target.value.trim() || null })}
                placeholder="https://… (opcional)"
                aria-label="Enlace"
              />
            </EditRow>
          ))}
          <Button
            type="button"
            onClick={() =>
              update({
                groups: [
                  ...groups,
                  { id: newId("gr"), icon: "🌐", name: "", sub: "", url: null },
                ],
              })
            }
          >
            + Agregar comunidad
          </Button>
        </div>
      </Field>

      <Field label="Contadores" hint="La fila de números bajo la vitrina.">
        <div>
          {stats.map((stat) => (
            <EditRow
              key={stat.id}
              onRemove={() => update({ stats: stats.filter((s) => s.id !== stat.id) })}
            >
              <div className="flex gap-2">
                <TextInput
                  type="number"
                  value={stat.num}
                  onChange={(e) => patchStat(stat.id, { num: Number(e.target.value) || 0 })}
                  className="w-24 text-center font-mono"
                  aria-label="Número"
                />
                <TextInput
                  value={stat.label}
                  onChange={(e) => patchStat(stat.id, { label: e.target.value })}
                  placeholder="Etiqueta"
                  aria-label="Etiqueta"
                />
              </div>
            </EditRow>
          ))}
          <Button
            type="button"
            onClick={() =>
              update({ stats: [...stats, { id: newId("st"), num: 0, label: "Nuevo" }] })
            }
          >
            + Agregar contador
          </Button>
        </div>
      </Field>
    </div>
  );
}

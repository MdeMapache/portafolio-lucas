# Tarea: integrar diseño estilo Steam en el portafolio Next.js

Este es un proyecto Next.js (App Router, TypeScript, Tailwind) ubicado en la raíz
del repo actual. Crea o reemplaza los siguientes archivos EXACTAMENTE con el
contenido indicado, respetando las rutas. Si una carpeta no existe, créala.
Al terminar, corre `npm run dev` y confirma que no hay errores de compilación.

---

## 1. `tailwind.config.ts` (raíz del proyecto — reemplazar)

```ts
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        steam: {
          bgDeep: "#0e1621",
          bgTop: "#1b2838",
          panel: "#16202d",
          panel2: "#1e2c3d",
          line: "#2a3f5a",
          text: "#c6d4df",
          dim: "#7f9cb3",
          bright: "#ffffff",
          link: "#66c0f4",
          linkHover: "#9cd6ff",
          green: "#a4d007",
          gold: "#cc9a06",
        },
      },
      fontFamily: {
        display: ["var(--font-oswald)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
```

---

## 2. `src/app/globals.css` (reemplazar)

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  background: radial-gradient(ellipse at top, #22344a 0%, #1b2838 45%, #0e1621 100%);
  background-attachment: fixed;
  color: #c6d4df;
}

/* textura sutil de grilla, como el fondo de Steam */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
  background-size: 38px 38px;
  pointer-events: none;
  z-index: 0;
}
```

---

## 3. `src/app/layout.tsx` (reemplazar)

```tsx
import type { Metadata } from "next";
import { Oswald, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-oswald",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Mapache — Portafolio Dev",
  description: "Portafolio de desarrollo de software, estilo perfil de Steam.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${oswald.variable} ${inter.variable} ${jetbrains.variable} font-body`}
      >
        {children}
      </body>
    </html>
  );
}
```

---

## 4. `src/app/page.tsx` (reemplazar)

```tsx
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ShowcaseGrid from "@/components/ShowcaseGrid";
import StatsRow from "@/components/StatsRow";
import ActivityFeed from "@/components/ActivityFeed";
import TechStack from "@/components/TechStack";
import Groups from "@/components/Groups";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="relative z-[1] max-w-[1240px] mx-auto px-8 py-7 pb-20">
        <Hero />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
          <div>
            <ShowcaseGrid />
            <StatsRow />
            <ActivityFeed />
          </div>

          <div>
            <TechStack />
            <Groups />
            <Contact />
          </div>
        </div>
      </div>

      <footer className="relative z-[1] text-center py-8 text-steam-dim text-[11px] font-mono">
        PORTAFOLIO.DEV — construido con Next.js, TypeScript y Tailwind · inspirado en la interfaz de Steam
      </footer>
    </>
  );
}
```

---

## 5. `src/data/portfolio.ts` (crear carpeta `src/data/` si no existe)

```ts
export const profile = {
  name: "Mapache",
  role: "Desarrollador Frontend & Game Dev · Chile",
  level: 6,
  tags: ["HTML / CSS / JS", "ANGULAR + IONIC", "GODOT", "TYPESCRIPT"],
};

export const showcase = [
  { icon: "🕹️", label: "Godot" },
  { icon: "📱", label: "Ionic/Angular" },
  { icon: "🌐", label: "JS Vanilla" },
  { icon: "⚙️", label: "TypeScript" },
];

export const stats = [
  { num: 12, label: "Proyectos" },
  { num: 4, label: "En producción" },
  { num: 3, label: "Certificaciones" },
  { num: 2, label: "En progreso" },
];

export type Project = {
  icon: string;
  title: string;
  lastCommit: string;
  description: string;
  done: number;
  total: number;
};

export const projects: Project[] = [
  {
    icon: "🕹️",
    title: "Runner 2D — Godot",
    lastCommit: "hoy",
    description:
      "Juego de plataformas con sistema de físicas y niveles procedurales.",
    done: 32,
    total: 40,
  },
  {
    icon: "📱",
    title: "App de gestión — Ionic + Angular",
    lastCommit: "hace 2 días",
    description:
      "App híbrida con autenticación, backend en Supabase y notificaciones push.",
    done: 18,
    total: 25,
  },
  {
    icon: "🌐",
    title: "Sitio portafolio — HTML/CSS/JS",
    lastCommit: "hace 5 días",
    description:
      "Landing personal responsiva con animaciones y formulario de contacto.",
    done: 10,
    total: 10,
  },
];

export const skills = [
  { name: "JavaScript", level: 85 },
  { name: "Angular / Ionic", level: 70 },
  { name: "Godot / GDScript", level: 55 },
  { name: "TypeScript", level: 60 },
];

export const techBadges = [
  { label: "JS", level: 5 },
  { label: "TS", level: 4 },
  { label: "NG", level: 4 },
  { label: "ION", level: 3 },
  { label: "GD", level: 3 },
  { label: "CSS", level: 4 },
  { label: "GIT", level: 3 },
  { label: "SQL", level: 2 },
];

export const groups = [{ icon: "🌱", name: "Terraria Chile", sub: "668 miembros" }];

export const contacts = [
  { code: "GH", name: "github.com/mapache", role: "Repositorios", online: true },
  { code: "IN", name: "linkedin.com/in/mapache", role: "Perfil profesional", online: true },
  { code: "@", name: "contacto@mapache.dev", role: "Correo", online: false },
];
```

---

## 6. Componentes (crear carpeta `src/components/` si no existe)

### `src/components/SectionLabel.tsx`

```tsx
export default function SectionLabel({
  title,
  count,
  id,
}: {
  title: string;
  count: string;
  id?: string;
}) {
  return (
    <div
      id={id}
      className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-steam-panel2 to-transparent border-l-[3px] border-steam-link text-sm mb-3"
    >
      <span className="text-steam-bright">{title}</span>
      <span className="text-xs font-mono text-steam-dim">{count}</span>
    </div>
  );
}
```

### `src/components/Navbar.tsx`

```tsx
export default function Navbar() {
  return (
    <nav className="relative z-10 flex items-center justify-between px-8 py-3.5 bg-black/40 border-b border-white/5 backdrop-blur-sm">
      <div className="flex items-center gap-9">
        <div className="flex items-center gap-2 font-display text-lg tracking-wider text-steam-bright">
          <span className="w-2.5 h-2.5 bg-steam-green rounded-sm shadow-[0_0_8px_#a4d007]" />
          MAPACHE.DEV
        </div>
        <div className="hidden md:flex gap-6 font-display text-[13px] tracking-wide">
          <a href="#" className="text-steam-bright">PERFIL</a>
          <a href="#proyectos" className="text-steam-dim hover:text-steam-bright">PROYECTOS</a>
          <a href="#skills" className="text-steam-dim hover:text-steam-bright">HABILIDADES</a>
          <a href="#contacto" className="text-steam-dim hover:text-steam-bright">CONTACTO</a>
        </div>
      </div>
      <div className="flex items-center gap-2.5 text-[13px]">
        <span className="hidden sm:inline text-steam-dim">Disponible para trabajar</span>
        <span className="w-2 h-2 rounded-full bg-steam-green shadow-[0_0_6px_#a4d007]" />
        <div className="w-[30px] h-[30px] border border-steam-line bg-gradient-to-br from-red-500 to-pink-500" />
      </div>
    </nav>
  );
}
```

### `src/components/Hero.tsx`

```tsx
import { profile } from "@/data/portfolio";

export default function Hero() {
  return (
    <div className="relative overflow-hidden flex flex-col md:flex-row gap-7 items-start md:items-end bg-gradient-to-br from-steam-line/30 to-steam-panel/60 border border-steam-line p-7 mb-6">
      <div className="pointer-events-none absolute -right-16 -top-16 w-72 h-72 rounded-full bg-steam-link/10 blur-2xl" />

      <div className="relative flex-shrink-0">
        <div className="w-[150px] h-[150px] flex items-center justify-center border-2 border-steam-line bg-gradient-to-br from-red-500 to-purple-700 font-display text-5xl text-white">
          {profile.name.charAt(0)}
        </div>
        <div className="absolute -bottom-2.5 -right-2.5 w-9 h-9 rounded-full flex items-center justify-center border-2 border-steam-gold bg-steam-panel font-mono font-bold text-steam-gold text-sm">
          {profile.level}
        </div>
      </div>

      <div className="relative flex-1">
        <div className="font-display text-3xl text-steam-bright mb-1.5">{profile.name}</div>
        <div className="font-mono text-sm text-steam-dim mb-3.5">{profile.role}</div>
        <div className="flex flex-wrap gap-2 mb-4">
          {profile.tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] px-2.5 py-1 border border-steam-line text-steam-dim font-mono tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex gap-2.5">
          <a
            href="#"
            className="px-5 py-2 text-[12.5px] font-display uppercase tracking-wide border border-steam-link text-white bg-gradient-to-b from-[#2a5a7a] to-[#1c3c52] hover:from-[#347399] hover:to-[#25516f]"
          >
            Ver CV
          </a>
          <a
            href="#proyectos"
            className="px-5 py-2 text-[12.5px] font-display uppercase tracking-wide border border-steam-line text-steam-dim"
          >
            Ver proyectos
          </a>
        </div>
      </div>
    </div>
  );
}
```

### `src/components/ShowcaseGrid.tsx`

```tsx
import { showcase } from "@/data/portfolio";
import SectionLabel from "./SectionLabel";

export default function ShowcaseGrid() {
  return (
    <>
      <SectionLabel id="proyectos" title="Expositor de proyectos" count={`${showcase.length} fijados`} />
      <div className="bg-steam-panel border border-white/5 p-5 mb-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {showcase.map((item) => (
            <div
              key={item.label}
              className="relative aspect-square flex items-center justify-center bg-steam-panel2 border border-steam-line text-3xl cursor-pointer transition-transform hover:-translate-y-1 hover:border-steam-link"
            >
              {item.icon}
              <span className="absolute bottom-1.5 left-0 right-0 text-center text-[9px] font-mono text-steam-dim">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
```

### `src/components/StatsRow.tsx`

```tsx
import { stats } from "@/data/portfolio";

export default function StatsRow() {
  return (
    <div className="bg-steam-panel border border-white/5 mb-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 border border-steam-line">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`text-center py-4 px-2 ${i !== stats.length - 1 ? "border-r border-steam-line" : ""}`}
          >
            <div className="font-display text-3xl text-steam-bright font-bold">{s.num}</div>
            <div className="text-[11px] text-steam-dim uppercase tracking-wide mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### `src/components/ActivityFeed.tsx`

```tsx
import { projects, type Project } from "@/data/portfolio";
import SectionLabel from "./SectionLabel";

function ActivityCard({ project }: { project: Project }) {
  const pct = Math.round((project.done / project.total) * 100);
  const complete = pct === 100;

  return (
    <div className="flex gap-3.5 py-3.5 border-b border-white/5 last:border-b-0">
      <div className="w-[88px] h-[52px] flex-shrink-0 flex items-center justify-center bg-steam-panel2 border border-steam-line text-xl">
        {project.icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-baseline mb-0.5">
          <span className="text-steam-bright text-[15px] font-semibold">{project.title}</span>
          <span className="text-[11px] font-mono text-steam-dim">último commit: {project.lastCommit}</span>
        </div>
        <div className="text-[12.5px] text-steam-dim mb-2">{project.description}</div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-steam-dim whitespace-nowrap">
            Avance del proyecto&nbsp;&nbsp;{project.done}/{project.total} tareas
          </span>
          <div className="flex-1 h-[5px] rounded-full bg-steam-panel2 overflow-hidden">
            <div
              className={`h-full ${complete ? "bg-steam-green" : "bg-gradient-to-r from-[#4c8fb0] to-steam-link"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[11px] font-mono text-steam-dim">{complete ? "Completo" : `${pct}%`}</span>
        </div>
      </div>
    </div>
  );
}

export default function ActivityFeed() {
  return (
    <>
      <SectionLabel title="Actividad reciente" count="18 commits esta semana" />
      <div className="bg-steam-panel border border-white/5">
        {projects.map((p) => (
          <ActivityCard key={p.title} project={p} />
        ))}
      </div>
    </>
  );
}
```

### `src/components/TechStack.tsx`

```tsx
import { techBadges, skills } from "@/data/portfolio";

export default function TechStack() {
  return (
    <div className="bg-steam-panel border border-white/5 p-5 mb-5" id="skills">
      <div className="flex justify-between text-[13px] text-steam-bright tracking-wide mb-2.5">
        <span>Stack tecnológico</span>
        <span className="text-steam-link">{techBadges.length}</span>
      </div>
      <div className="grid grid-cols-5 gap-2 mb-5">
        {techBadges.map((b) => (
          <div
            key={b.label}
            className="relative aspect-square flex items-center justify-center bg-steam-panel2 border border-steam-line text-[15px]"
          >
            {b.label}
            <span className="absolute bottom-0.5 right-0.5 text-[7px] font-mono text-steam-gold">
              {b.level}
            </span>
          </div>
        ))}
      </div>

      <div className="text-[13px] text-steam-bright tracking-wide mb-2.5">Nivel de dominio</div>
      {skills.map((s) => (
        <div key={s.name} className="mb-2.5">
          <div className="flex justify-between text-xs mb-1">
            <span>{s.name}</span>
            <span className="font-mono text-[10.5px] text-steam-dim">{s.level}%</span>
          </div>
          <div className="h-[5px] rounded-full bg-steam-panel2 overflow-hidden">
            <div className="h-full bg-steam-green" style={{ width: `${s.level}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
```

### `src/components/Groups.tsx`

```tsx
import { groups } from "@/data/portfolio";

export default function Groups() {
  return (
    <div className="bg-steam-panel border border-white/5 p-5 mb-5">
      <div className="flex justify-between text-[13px] text-steam-bright tracking-wide mb-2.5">
        <span>Comunidades</span>
        <span className="text-steam-link">{groups.length}</span>
      </div>
      {groups.map((g) => (
        <div key={g.name} className="flex gap-2.5 items-center py-2 border-b border-white/5 last:border-b-0">
          <div className="w-[34px] h-[34px] flex items-center justify-center bg-steam-panel2 border border-steam-line text-[15px]">
            {g.icon}
          </div>
          <div>
            <div className="text-[12.5px] text-steam-bright">{g.name}</div>
            <div className="text-[10.5px] text-steam-dim">{g.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### `src/components/Contact.tsx`

```tsx
import { contacts } from "@/data/portfolio";

export default function Contact() {
  return (
    <div className="bg-steam-panel border border-white/5 p-5" id="contacto">
      <div className="flex justify-between text-[13px] text-steam-bright tracking-wide mb-2.5">
        <span>Contacto</span>
        <span className="text-steam-link">online</span>
      </div>
      {contacts.map((c) => (
        <div key={c.name} className="flex items-center gap-2.5 py-2.5 border-b border-white/5 last:border-b-0">
          <div className="relative w-8 h-8 flex items-center justify-center bg-steam-panel2 border border-steam-line text-sm">
            {c.code}
            <span
              className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-steam-panel ${
                c.online ? "bg-steam-green" : "bg-steam-line"
              }`}
            />
          </div>
          <div>
            <div className="text-[12.5px] text-steam-link">{c.name}</div>
            <div className="text-[10.5px] text-steam-dim">{c.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## Verificación final

1. Confirmá que `@/*` está mapeado a `src/*` en `tsconfig.json` (viene por defecto con `create-next-app`). Si no existe, agregá en `compilerOptions`:
   ```json
   "paths": { "@/*": ["./src/*"] }
   ```
2. Corré `npm run dev` y confirmá que compila sin errores.
3. Abrí `http://localhost:3000` y confirmá que se ve el diseño oscuro estilo Steam (nav superior, hero con avatar, grid de proyectos, sidebar con stack tecnológico), no la página de bienvenida default de Next.js.
4. Si hay errores de TypeScript o imports, corregilos manteniendo la estructura de archivos indicada arriba.

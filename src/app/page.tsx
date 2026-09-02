import ActivityFeed from "@/components/ActivityFeed";
import Contact from "@/components/Contact";
import Groups from "@/components/Groups";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ProjectShowcase from "@/components/ProjectShowcase";
import StatsRow from "@/components/StatsRow";
import TechStack from "@/components/TechStack";

export default function Home() {
  return (
    <>
      <Navbar />

      <main
        id="perfil"
        className="relative z-[1] max-w-[1240px] mx-auto px-4 sm:px-8 py-7 pb-20"
      >
        <Hero />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">
          <div className="min-w-0">
            <ProjectShowcase />
            <StatsRow />
            <ActivityFeed />
          </div>

          <aside className="min-w-0">
            <TechStack />
            <Groups />
            <Contact />
          </aside>
        </div>
      </main>

      <footer className="relative z-[1] text-center py-8 text-steam-dim/70 text-[11px] font-mono">
        PORTAFOLIO.DEV — Next.js, TypeScript y Tailwind · inspirado en la interfaz de Steam
      </footer>
    </>
  );
}

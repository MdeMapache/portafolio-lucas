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

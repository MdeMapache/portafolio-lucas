"use client";

import Certifications from "@/components/Certifications";
import TechStack from "@/components/TechStack";

export default function SkillsSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-5 items-start">
      <TechStack />
      <Certifications />
    </div>
  );
}

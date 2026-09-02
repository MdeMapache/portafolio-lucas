"use client";

import ActivityFeed from "@/components/ActivityFeed";
import ProjectShowcase from "@/components/ProjectShowcase";
import StatsRow from "@/components/StatsRow";

export default function ProjectsSection() {
  return (
    <div>
      <StatsRow />
      <ProjectShowcase />
      <ActivityFeed />
    </div>
  );
}

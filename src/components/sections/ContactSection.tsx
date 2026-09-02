"use client";

import Contact from "@/components/Contact";
import Groups from "@/components/Groups";

export default function ContactSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-5 items-start">
      <Contact />
      <Groups />
    </div>
  );
}

"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import FeaturedShelf from "@/components/FeaturedShelf";
import Hierarchy from "@/components/Hierarchy";
import Roles from "@/components/Roles";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import { Megaphone, X } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const { announcements } = useApp();
  const [closedAnnouncements, setClosedAnnouncements] = useState<string[]>([]);

  const activeAnnouncements = announcements.filter(
    (a) => !closedAnnouncements.includes(a.id)
  );

  const handleClose = (id: string) => {
    setClosedAnnouncements((prev) => [...prev, id]);
  };

  return (
    <main className="page-enter bg-cream min-h-screen flex flex-col font-body">
      <Navbar />

      {/* Announcements Bar */}
      {activeAnnouncements.length > 0 && (
        <div className="bg-sage-dark/5 border-b border-sage-dark/10">
          <div className="mx-auto max-w-7xl px-6 py-2 lg:px-10 flex flex-col gap-2">
            {activeAnnouncements.map((ann) => {
              const bgType =
                ann.type === "success"
                  ? "bg-leaf-light/50 border-leaf/30"
                  : ann.type === "warning"
                  ? "bg-butter-light/50 border-butter/30"
                  : "bg-blush-light/50 border-blush/30";

              return (
                <div
                  key={ann.id}
                  className={`flex items-center justify-between gap-4 rounded-card border px-4 py-2 text-xs text-sage-dark ${bgType} transition-all`}
                >
                  <div className="flex items-center gap-2">
                    <Megaphone size={14} className="shrink-0 animate-pulse" style={{ animationDuration: "2.5s" }} />
                    <span>
                      <strong className="font-semibold">{ann.title}:</strong>{" "}
                      {ann.content}
                    </span>
                  </div>
                  <button
                    onClick={() => handleClose(ann.id)}
                    className="shrink-0 text-sage-dark/60 hover:text-sage-dark"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex-1">
        <Hero />
        <Stats />
        <FeaturedShelf />
        <Hierarchy />
        <Roles />
      </div>
      <Footer />
    </main>
  );
}

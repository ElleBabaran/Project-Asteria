"use client";

import { useState } from "react";
import { ArrowRight, FileType, Heart, Search, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

// Default cards if no resources exist (for layout purposes)
const defaultCatalogCards = [
  {
    country: "India",
    path: "CBSE · Class 8 · Science",
    topic: "Crop Production and Management",
    rot: "-12deg",
    rotFrom: "-25deg",
    color: "bg-leaf-light",
    delay: "0.1s",
    topOffset: "140px",
    leftOffset: "-30px",
    resourceId: undefined,
    fileType: "PDF",
    fileSize: "12 Pages"
  },
  {
    country: "United States",
    path: "Common Core · Grade 8 · Math",
    topic: "Linear Equations",
    rot: "4deg",
    rotFrom: "0deg",
    color: "bg-blush-light",
    delay: "0.28s",
    drift: true,
    topOffset: "70px",
    leftOffset: "0px",
    resourceId: undefined,
    fileType: "PDF",
    fileSize: "12 Pages"
  },
  {
    country: "United Kingdom",
    path: "GCSE · Biology",
    topic: "Cell Structure",
    rot: "18deg",
    rotFrom: "30deg",
    color: "bg-butter-light",
    delay: "0.46s",
    topOffset: "0px",
    leftOffset: "30px",
    resourceId: undefined,
    fileType: "PDF",
    fileSize: "12 Pages"
  },
];

const colors = ["bg-leaf-light", "bg-blush-light", "bg-butter-light", "bg-sage-light"];

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { resources, heroResourceIds } = useApp();

  // Transform actual resources into card format
  const getCatalogCards = () => {
    const approvedResources = resources.filter((res) => res.status === "approved");

    if (approvedResources.length === 0) {
      return defaultCatalogCards; // Show default if no resources
    }

    const rotations = ["-12deg", "4deg", "18deg"];
    const rotFroms = ["-25deg", "0deg", "30deg"];
    const delays = ["0.1s", "0.28s", "0.46s"];
    const topOffsets = ["140px", "70px", "0px"];
    const leftOffsets = ["-30px", "0px", "30px"];
    const drifts = [false, true, false];

    const selectedHeroResources = heroResourceIds
      .map((id) => approvedResources.find((res) => res.id === id))
      .filter((res): res is (typeof approvedResources)[number] => Boolean(res));
    const remainingResources = approvedResources.filter(
      (res) => !selectedHeroResources.some((selected) => selected.id === res.id)
    );
    const heroResources = [...selectedHeroResources, ...remainingResources].slice(0, 3);

    return heroResources.map((res, i) => ({
      country: res.country,
      path: `${res.curriculum} · ${res.grade} · ${res.subject}`,
      topic: res.title,
      rot: rotations[i],
      rotFrom: rotFroms[i],
      color: colors[i % colors.length],
      delay: delays[i],
      topOffset: topOffsets[i],
      leftOffset: leftOffsets[i],
      drift: drifts[i],
      resourceId: res.id,
      fileType: res.fileType || "PDF",
      fileSize: res.fileSize || "2.0 MB",
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push(`/explore`);
    }
  };

  return (
    <section id="top" className="relative overflow-hidden px-6 pt-16 pb-24 lg:px-10 lg:pt-24 font-body">
      {/* Subtle background blobs — GPU-composited, no repaints */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-leaf-light/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-blush-light/30 blur-3xl" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
        {/* Left column */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-sage/20 bg-sage/5 px-3 py-1.5 mb-6">
            <Sparkles size={12} className="text-sage" />
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-sage">
              A free library, by volunteers, for students everywhere
            </p>
          </div>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-sage-dark sm:text-6xl lg:text-[4.25rem]">
            Every note, sorted
            <br />
            <span className="italic text-blush">like it was made</span>
            <br />
            for your class.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink/70">
            Project Astera collects study guides, worksheets, and past papers
            from volunteers around the world, then files them by country,
            curriculum, grade, and subject &mdash; so finding what you need
            takes seconds, not searches.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/explore"
              className="group flex items-center gap-2 rounded-card bg-sage-dark px-6 py-3.5 text-sm font-semibold text-paper shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
            >
              Explore resources
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/volunteer-apply"
              className="flex items-center gap-2 rounded-card border-2 border-sage-dark/15 px-6 py-3.5 text-sm font-semibold text-sage-dark transition-all duration-200 hover:border-sage-dark/40 hover:bg-sage-dark/5"
            >
              Become a volunteer
              <Heart size={16} className="text-rose-500 fill-rose-500/20 transition-all duration-300 group-hover:fill-rose-500/40" />
            </Link>
          </div>

          <form
            onSubmit={handleSearch}
            className="mt-10 flex max-w-md items-center gap-3 rounded-card border-2 border-sage-dark/10 bg-paper px-4 py-3 shadow-card shimmer-focus transition-shadow"
          >
            <Search size={18} className="shrink-0 text-sage" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Try "Class 8 Science, CBSE, India"`}
              className="w-full bg-transparent text-sm text-ink placeholder:text-ink/40 focus:outline-none"
            />
            <button
              type="submit"
              className="shrink-0 rounded-[0.6rem] bg-leaf px-3 py-1.5 text-xs font-semibold text-sage-dark transition-transform hover:scale-105 active:scale-95"
            >
              Search
            </button>
          </form>
        </div>

        {/* Card catalog signature element */}
        <div className="relative mx-auto h-[420px] w-full max-w-md lg:h-[480px]">
          {/* Ground shadow */}
          <div className="absolute inset-x-10 bottom-2 h-4 rounded-full bg-sage-dark/10 blur-md" />
          {getCatalogCards().map((card, i) => (
            <Link
              href={card.resourceId ? `/resources/${card.resourceId}` : "#"}
              key={i}
              className="animate-fan-in absolute left-1/2 w-72"
              style={
                {
                  "--rot-from": card.rotFrom,
                  "--rot-to": card.rot,
                  transform: `translateX(calc(-50% + ${card.leftOffset})) rotate(${card.rot})`,
                  top: card.topOffset,
                  zIndex: i,
                  animationDelay: card.delay,
                } as React.CSSProperties
              }
            >
              <div
                className={`rounded-card ${card.color} p-6 shadow-card label-tab cursor-pointer transition-all duration-300 hover:-translate-y-3 hover:scale-[1.03] hover:shadow-xl ${
                  card.drift ? "animate-drift" : ""
                }`}
              >
                <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-sage-dark/60">
                  {card.country}
                </p>
                <p className="mt-1 font-mono text-[0.65rem] text-sage-dark/50">{card.path}</p>
                <p className="mt-4 font-display text-xl font-semibold leading-snug text-sage-dark">
                  {card.topic}
                </p>
                <div className="mt-5 flex items-center justify-between text-sage-dark/50">
                  <span className="font-mono text-[0.6rem] uppercase tracking-widest">
                    {card.fileType} · {card.fileSize}
                  </span>
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-paper/70 transition-colors hover:bg-paper">
                    <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

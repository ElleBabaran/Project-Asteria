import { ChevronRight, Folder, FolderOpen } from "lucide-react";

const primaryPath = [
  { label: "Country", example: "India", color: "bg-sage text-paper" },
  { label: "Curriculum", example: "CBSE", color: "bg-leaf text-sage-dark" },
  { label: "Grade", example: "Class 8", color: "bg-blush text-sage-dark" },
  { label: "Subject", example: "Science", color: "bg-butter text-sage-dark" },
  { label: "Topic", example: "Crop Production", color: "bg-paper text-sage-dark border border-sage-dark/15" },
];

const secondaryPath = [
  { label: "country", example: "United Kingdom", color: "bg-sage text-paper" },
  { label: "curriculum", example: "GCSE", color: "bg-leaf text-sage-dark" },
  { label: "subject", example: "Biology", color: "bg-blush text-sage-dark" },
  { label: "topic", example: "Cell Structure", color: "bg-paper text-sage-dark border border-sage-dark/15" },
];

const usPath = [
  { label: "Country", example: "United States", color: "bg-sage text-paper" },
  { label: "Curriculum", example: "AP", color: "bg-leaf text-sage-dark" },
  { label: "Grade", example: "10th", color: "bg-blush text-sage-dark" },
  { label: "Topic", example: "World History", color: "bg-paper text-sage-dark border border-sage-dark/15" }, 
];

export default function Hierarchy() {
  return (
    <section id="how-it-works" className="bg-sage-dark px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="reveal font-mono text-xs font-semibold uppercase tracking-[0.2em] text-leaf-light">
          How resources are filed
        </p>
        <h2 className="reveal mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-paper sm:text-5xl">
          One path to every resource
        </h2>
        <p className="reveal mt-5 max-w-xl text-lg leading-relaxed text-paper/70">
          Open a country, pick a curriculum, drill down to grade and subject,
          and land on the exact topic you&apos;re studying.
        </p>

        {/* Primary example path */}
        <div className="reveal-group mt-12 flex flex-wrap items-center gap-3 lg:flex-nowrap lg:overflow-x-auto">
          {primaryPath.map((level, i) => (
            <div key={`primary-${level.label}`} className="flex shrink-0 items-center gap-3">
              <div className={`flex flex-col gap-2 rounded-card px-5 py-4 ${level.color} min-w-[9.5rem] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03]`}>
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] opacity-60">
                  {level.label}
                </span>
                <span className="flex items-center gap-2 font-display text-base font-semibold">
                  {i === primaryPath.length - 1 ? (
                    <FolderOpen size={16} className="opacity-70" />
                  ) : (
                    <Folder size={16} className="opacity-70" />
                  )}
                  {level.example}
                </span>
              </div>
              {i < primaryPath.length - 1 && (
                <ChevronRight size={20} className="shrink-0 text-paper/30" />
              )}
            </div>
          ))}
        </div>

        {/* Secondary example path — unique keys to avoid React warning */}
        <div className="reveal-group mt-6 flex flex-wrap items-center gap-3 lg:flex-nowrap lg:overflow-x-auto">
          {secondaryPath.map((level, i) => (
            <div key={`secondary-${level.label}`} className="flex shrink-0 items-center gap-3">
              <div className={`flex flex-col gap-2 rounded-card px-5 py-4 ${level.color} min-w-[9.5rem] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03]`}>
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] opacity-60">
                  {level.label}
                </span>
                <span className="flex items-center gap-2 font-display text-base font-semibold">
                  {i === secondaryPath.length - 1 ? (
                    <FolderOpen size={16} className="opacity-70" />
                  ) : (
                    <Folder size={16} className="opacity-70" />
                  )}
                  {level.example}
                </span>
              </div>
              {i < secondaryPath.length - 1 && (
                <ChevronRight size={20} className="shrink-0 text-paper/30" />
              )}
            </div>
          ))}
        </div>
        {/* US example path */}      
        <div className="reveal-group mt-6 flex flex-wrap items-center gap-3 lg:flex-nowrap lg:overflow-x-auto">
          {usPath.map((level, i) => (
            <div key={`us-path-${i}`} className="flex shrink-0 items-center gap-3">
              <div className={`flex flex-col gap-2 rounded-card px-5 py-4 ${level.color} min-w-[9.5rem] transition-all duration-300 hover:-translate-y-1 hover:scale-[1.03]`}>
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.18em] opacity-60">
                  {level.label}
                </span>
                <span className="flex items-center gap-2 font-display text-base font-semibold">
                  {i === usPath.length - 1 ? (
                    <FolderOpen size={16} className="opacity-70" />
                  ) : (
                    <Folder size={16} className="opacity-70" />
                  )}
                  {level.example}
                </span>
              </div>
              {i < usPath.length - 1 && (
                <ChevronRight size={20} className="shrink-0 text-paper/30" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

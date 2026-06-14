import CountUp from "@/components/CountUp";
import { BookMarked, Globe2, Users, Smile } from "lucide-react";

const stats = [
  {
    value: 12400,
    suffix: "+",
    label: "Resources shelved",
    color: "text-sage-dark",
    bg: "bg-sage/10",
    icon: BookMarked,
    iconColor: "text-sage",
  },
  {
    value: 38,
    suffix: "",
    label: "Countries covered",
    color: "text-blush",
    bg: "bg-blush/10",
    icon: Globe2,
    iconColor: "text-blush",
  },
  {
    value: 640,
    suffix: "",
    label: "Active volunteers",
    color: "text-leaf",
    bg: "bg-leaf/10",
    icon: Users,
    iconColor: "text-leaf",
  },
  {
    value: 91000,
    suffix: "+",
    label: "Students helped",
    color: "text-butter",
    bg: "bg-butter/10",
    icon: Smile,
    iconColor: "text-butter",
  },
];

export default function Stats() {
  return (
    <section className="relative border-y border-sage-dark/10 bg-paper px-6 py-14 lg:px-10 overflow-hidden">
      {/* Subtle decorative gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-sage/3 via-transparent to-blush/3" aria-hidden />

      <div className="reveal-group relative mx-auto grid max-w-7xl grid-cols-2 gap-8 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="group flex flex-col items-center gap-3 text-center transition-transform duration-300 hover:-translate-y-1 sm:items-start sm:text-left"
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-[0.65rem] ${stat.bg} transition-transform duration-300 group-hover:scale-110`}>
                <Icon size={18} className={stat.iconColor} />
              </span>
              <div>
                <p className={`font-display text-4xl font-semibold tracking-tight lg:text-5xl ${stat.color}`}>
                  <CountUp to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1.5 font-mono text-xs uppercase tracking-[0.18em] text-ink/50">
                  {stat.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

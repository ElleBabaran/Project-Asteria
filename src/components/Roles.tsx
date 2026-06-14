import { ArrowRight, GraduationCap, ShieldCheck, Upload } from "lucide-react";
import Link from "next/link";

const roles = [
  {
    icon: GraduationCap,
    title: "Students",
    color: "bg-blush-light",
    accentColor: "text-blush",
    description:
      "Search by subject, grade, curriculum, or country. Save favorites, track downloads, and pick up recommended resources right where you left off.",
    points: ["Browse & search the library", "Save resources to favorites", "Download history & recommendations"],
  },
  {
    icon: Upload,
    title: "Volunteers",
    color: "bg-leaf-light",
    accentColor: "text-leaf",
    description:
      "Upload notes, worksheets, and guides from your own classroom. Add the right tags, track how your resources are helping students, and see feedback.",
    points: ["Upload & describe resources", "Track downloads & feedback", "Edit submissions anytime"],
  },
  {
    icon: ShieldCheck,
    title: "Administrators",
    color: "bg-butter-light",
    accentColor: "text-butter",
    description:
      "Review and approve every upload before it goes live, keep categories tidy, and watch the library grow through clear analytics.",
    points: ["Approve or reject uploads", "Manage users & categories", "View site-wide analytics"],
  },
];

export default function Roles() {
  return (
    <section id="volunteer" className="px-6 py-20 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <p className="reveal font-mono text-xs font-semibold uppercase tracking-[0.2em] text-sage">
          Three roles, one shared shelf
        </p>
        <h2 className="reveal mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-sage-dark sm:text-5xl">
          Built for everyone in the room
        </h2>

        <div className="reveal-group mt-12 grid gap-6 lg:grid-cols-3">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.title}
                className="group flex flex-col rounded-card border border-sage-dark/10 bg-paper p-7 shadow-card transition-all duration-300 hover:-translate-y-2 hover:border-sage/30 hover:shadow-lg"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-[0.65rem] ${role.color} transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                  <Icon size={22} className="text-sage-dark" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold text-sage-dark">
                  {role.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink/65">{role.description}</p>
                <ul className="mt-6 flex flex-col gap-2.5 border-t border-sage-dark/10 pt-5">
                  {role.points.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-ink/70">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage transition-transform duration-300 group-hover:scale-150" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* CTA Banner — fixed href to actual volunteer apply page */}
        <div className="reveal mt-10 flex flex-col items-center gap-5 rounded-card bg-sage-dark px-8 py-10 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <h3 className="font-display text-2xl font-semibold text-paper sm:text-3xl">
              Have notes worth sharing?
            </h3>
            <p className="mt-2 text-sm text-paper/70">
              Apply as a volunteer and put your study materials on the shelf
              for students everywhere.
            </p>
          </div>
          <Link
            href="/volunteer-apply"
            className="group flex shrink-0 items-center gap-2 rounded-card bg-butter px-6 py-3.5 text-sm font-semibold text-sage-dark shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
          >
            Apply to volunteer
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}

"use client";

import { BookOpen } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function Footer() {
  const { user, resources, categories } = useApp();
  const approvedCount = resources.filter(r => r.status === "approved").length;

  const columns = [
    {
      title: "Library",
      links: [
        { label: "Explore resources", href: "/explore", show: true },
        { label: "Browse by country", href: "/explore?focus=country", show: true },
        { label: "Browse by subject", href: "/explore?focus=subject", show: true },
        { label: "Submit a resource", href: user?.role === "admin" ? "/dashboard/admin?tab=upload" : "/dashboard/volunteer", show: user?.role === "volunteer" || user?.role === "admin" },
      ].filter(l => l.show),
    },
    {
      title: "Get involved",
      links: [
        { label: "Become a volunteer", href: "/volunteer-apply", show: !user || user?.role === "student" || user?.role === "guest" },
        { label: "Volunteer dashboard", href: "/dashboard/volunteer", show: user?.role === "volunteer" },
        { label: "Admin dashboard", href: "/dashboard/admin", show: user?.role === "admin" },
        { label: "Partner with us", href: "/partner", show: true },
        { label: "Contact support", href: "/contact", show: true },
      ].filter(l => l.show),
    },
    {
      title: "About",
      links: [
        { label: "Our mission", href: "/about#mission", show: true },
        { label: "Meet the team", href: "/about#team", show: true },
        { label: "Contact us", href: "/contact", show: true },
        { label: "Privacy policy", href: "/privacy", show: true },
        { label: "Terms of use", href: "/terms", show: true },
      ].filter(l => l.show),
    },
  ];

  return (
    <footer id="about" className="border-t border-sage-dark/10 bg-paper px-6 py-16 lg:px-10 font-body">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-card bg-sage text-paper">
                <BookOpen size={18} strokeWidth={2.25} />
              </span>
              <span className="font-display text-xl font-semibold tracking-tight text-sage-dark">
                Project Astera
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink/60">
              A free, volunteer-built library of study materials for students
              everywhere — organized by country, curriculum, grade, and
              subject.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-sage">
                {col.title}
              </h4>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="link-sweep text-sm text-ink/65 transition-colors hover:text-sage-dark"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-sage-dark/8 pt-8 sm:flex-row">
          <p className="text-xs text-ink/45">
            © {new Date().getFullYear()} Project Astera. Built by volunteers, for students.
          </p>
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-ink/35">
            {approvedCount.toLocaleString()} resources · {categories.countries.length} countries
          </p>
        </div>
      </div>
    </footer>
  );
}

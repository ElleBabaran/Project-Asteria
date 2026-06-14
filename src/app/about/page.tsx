"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, Globe, Heart, Award, Users } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="bg-cream min-h-screen flex flex-col font-body">
      <Navbar />

      {/* Hero Header */}
      <section className="bg-sage-dark text-paper py-16 px-6 lg:px-10 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-leaf-light">
            Our Story & Journey
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            About Project Astera
          </h1>
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-paper/85">
            We believe that high-quality, structured learning guides should be accessible to students everywhere, regardless of their location or economic background.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-20 px-6 lg:px-10 max-w-7xl mx-auto w-full">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-sage">
              What Drives Us
            </span>
            <h2 className="font-display text-3xl font-bold text-sage-dark sm:text-4xl leading-tight">
              Our Mission to Democratize Global Education
            </h2>
            <p className="text-sm leading-relaxed text-ink/75">
              Project Astera is a volunteer-led nonprofit initiative. In many regions, students prepare for exams using outdated books or disorganized internet searches. We bridge the gap by compiling notes directly aligned with regional school curricula.
            </p>
            
            <div className="grid gap-6 sm:grid-cols-2 pt-4">
              <div className="flex gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-card bg-leaf-light text-sage-dark shrink-0">
                  <Globe size={18} />
                </span>
                <div>
                  <h4 className="font-semibold text-sage-dark text-sm">Organized Taxonomy</h4>
                  <p className="text-xs text-ink/60 mt-1">Every worksheet is filed down to country, syllabus, grade, and chapter.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-card bg-blush-light text-sage-dark shrink-0">
                  <Heart size={18} />
                </span>
                <div>
                  <h4 className="font-semibold text-sage-dark text-sm">Volunteer Verified</h4>
                  <p className="text-xs text-ink/60 mt-1">Every study guide is review-moderated by our admin team before going live.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-paper p-8 rounded-card border-2 border-sage-dark/10 shadow-card space-y-6">
            <h3 className="font-display text-xl font-bold text-sage-dark">Our Milestones</h3>
            <div className="space-y-4 divide-y divide-sage-dark/5">
              {[
                { year: "2024", event: "Project Astera founded by an international team of educators." },
                { year: "2025", event: "Shelved over 5,000 notes and expanded to cover CBSE (India) and GCSE (UK) syllabi." },
                { year: "2026", event: "Helped over 90,000 students globally and integrated multi-curricula frameworks." }
              ].map((m) => (
                <div key={m.year} className="pt-4 first:pt-0 flex gap-4 text-sm">
                  <span className="font-mono font-bold text-sage shrink-0">{m.year}</span>
                  <p className="text-ink/75">{m.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="bg-paper border-y border-sage-dark/10 py-20 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto w-full text-center">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-sage">
            The Hearts Behind Astera
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold text-sage-dark sm:text-4xl">
            Meet the Team
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-ink/60 max-w-md mx-auto leading-relaxed">
            Astera is run by a global council of teachers, engineers, and student leaders working in coordination.
          </p>

          <div className="grid gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: "Elena Rostova", role: "Co-Founder & Education Lead", dept: "United Kingdom", color: "bg-leaf-light" },
              { name: "Arjun Mehta", role: "Engineering Director", dept: "India", color: "bg-blush-light" },
              { name: "Chloe Jenkins", role: "Community Organizer", dept: "Australia", color: "bg-butter-light" },
              { name: "Maria Santos", role: "Curriculum Director", dept: "Philippines", color: "bg-sage-light" }
            ].map((member) => (
              <div key={member.name} className="group p-6 rounded-card border-2 border-sage-dark/8 bg-cream/35 hover:-translate-y-1 hover:border-sage/20 transition-all text-center">
                <div className={`h-16 w-16 mx-auto rounded-full ${member.color} flex items-center justify-center text-sage-dark font-bold text-lg mb-4`}>
                  {member.name.charAt(0)}
                </div>
                <h4 className="font-display font-semibold text-sage-dark">{member.name}</h4>
                <p className="text-xs text-ink/50 mt-1 font-mono">{member.role}</p>
                <span className="inline-block mt-3 text-[10px] font-bold text-sage bg-paper px-2 py-0.5 rounded border">
                  {member.dept}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 lg:px-10 max-w-4xl mx-auto w-full text-center space-y-6">
        <h2 className="font-display text-3xl font-bold text-sage-dark">Want to support our mission?</h2>
        <p className="text-sm text-ink/70 max-w-lg mx-auto leading-relaxed">
          You don&apos;t have to be a full-time teacher to help. We are always looking for students who can submit notes, worksheets, or translate files.
        </p>
        <div className="flex justify-center gap-4 pt-2">
          <Link href="/volunteer-apply" className="rounded-card bg-sage-dark text-paper px-6 py-3 text-xs font-semibold shadow hover:bg-sage">
            Become a Volunteer
          </Link>
          <Link href="/partner" className="rounded-card border-2 border-sage-dark/15 text-sage-dark px-6 py-3 text-xs font-semibold">
            Partner With Us
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, User, Mail, GraduationCap, CheckCircle, Award } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

export default function VolunteerApplyPage() {
  const { submitVolunteerApplication } = useApp();
  const [name, setName] = useState("");

  const [email, setEmail] = useState("");
  const [background, setBackground] = useState("student");
  const [subject, setSubject] = useState("Mathematics");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState("");


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!name || !email || !message) {
      setFormError("Please fill in all required fields.");
      return;
    }
    submitVolunteerApplication({
      name,
      email,
      background,
      subject,
      message
    });
    setIsSubmitted(true);
  };



  return (
    <main className="bg-cream min-h-screen flex flex-col font-body">
      <Navbar />

      <section className="flex-1 mx-auto max-w-4xl w-full px-6 py-16 lg:px-10 grid gap-12 lg:grid-cols-[1fr_1.2fr] items-center">
        
        {/* Left Side: Copy */}
        <div className="space-y-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-card bg-leaf-light text-sage-dark">
            <Heart size={20} className="fill-rose-500/10 text-rose-500" />
          </span>
          <h1 className="font-display text-3xl font-semibold text-sage-dark sm:text-4xl leading-tight">
            Become a Volunteer Contributor
          </h1>
          <p className="text-sm leading-relaxed text-ink/75">
            Volunteers make Project Astera possible. By donating study guides, syllabus summaries, and worksheets, you help make structured education accessible to students everywhere.
          </p>

          <div className="space-y-4">
            <div className="flex gap-3 text-xs text-ink/70">
              <CheckCircle size={16} className="text-leaf shrink-0 mt-0.5" />
              <span>Share resources from your school or college classes.</span>
            </div>
            <div className="flex gap-3 text-xs text-ink/70">
              <CheckCircle size={16} className="text-leaf shrink-0 mt-0.5" />
              <span>Receive contributor badges and track downloads metrics.</span>
            </div>
            <div className="flex gap-3 text-xs text-ink/70">
              <CheckCircle size={16} className="text-leaf shrink-0 mt-0.5" />
              <span>Help students navigate high-stakes exams.</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form / Success */}
        <div className="bg-paper rounded-card border-2 border-sage-dark/8 p-6 sm:p-8 shadow-card relative overflow-hidden">
          {isSubmitted ? (
            <div className="text-center py-10 space-y-4">
              <Award size={48} className="mx-auto text-leaf animate-bounce" />
              <h3 className="font-display text-2xl font-bold text-sage-dark">Application Received!</h3>
              <p className="text-xs text-ink/65 leading-relaxed max-w-xs mx-auto">
                Thank you, <strong className="text-ink">{name}</strong>! We sent a registration confirmation email to <strong className="text-ink">{email}</strong>. Our volunteer coordinators will review your background and activate your volunteer credentials shortly.
              </p>
              <div className="pt-4 flex flex-col gap-2">
                <Link
                  href="/login"
                  className="rounded-card bg-sage-dark text-paper py-2.5 text-xs font-semibold shadow"
                >
                  Go to Login Dashboard
                </Link>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-xs text-ink/50 hover:text-ink font-semibold"
                >
                  Submit another application
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-display text-lg font-bold text-sage-dark border-b border-sage-dark/8 pb-3 mb-4">
                Volunteer Form
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-sage-dark">Full Name *</label>
                <div className="flex items-center gap-2 rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2">
                  <User size={13} className="text-sage" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Arjun Verma"
                    className="w-full bg-transparent text-xs text-ink focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-sage-dark">Email Address *</label>
                <div className="flex items-center gap-2 rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2">
                  <Mail size={13} className="text-sage" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="arjun@example.com"
                    className="w-full bg-transparent text-xs text-ink focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-sage-dark">Background</label>
                  <select
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    className="w-full rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2 text-xs text-ink outline-none"
                  >
                    <option value="student">High School / Univ Student</option>
                    <option value="teacher">Active School Teacher</option>
                    <option value="professor">College Professor</option>
                    <option value="parent">Parent / Homeschooler</option>
                    <option value="other">Education Enthusiast</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-sage-dark">Primary Subject</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2 text-xs text-ink outline-none"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Sciences (Bio, Chem, Phys)</option>
                    <option value="English">Languages & Literature</option>
                    <option value="History">Social Sciences & History</option>
                    <option value="multiple">Multiple / Other subjects</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-sage-dark">Why do you want to volunteer? *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us about the study materials you would like to upload..."
                  rows={4}
                  className="w-full rounded-card border border-sage-dark/10 bg-cream/35 p-3 text-xs text-ink outline-none focus:border-sage"
                  required
                />
              </div>

              {/* Inline validation error */}
              {formError && (
                <p className="rounded-card border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                className="w-full rounded-card bg-sage-dark text-paper py-3 font-semibold text-xs shadow hover:bg-sage transition-all active:scale-95"
              >
                Submit Application
              </button>
            </form>
          )}
        </div>

      </section>

      <Footer />
    </main>
  );
}

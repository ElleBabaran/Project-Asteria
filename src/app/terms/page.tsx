"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <main className="bg-cream min-h-screen flex flex-col font-body">
      <Navbar />

      <section className="flex-1 mx-auto max-w-4xl w-full px-6 py-16 lg:px-10">
        <div className="bg-paper rounded-card border-2 border-sage-dark/8 p-8 shadow-card prose prose-sage">
          <h1 className="font-display text-3xl font-semibold text-sage-dark mb-4">Terms of Use</h1>
          <p className="text-xs text-ink/50 font-mono mb-8">Last Updated: June 13, 2026</p>

          <div className="space-y-6 text-sm text-ink/75 leading-relaxed">
            <p>
              Welcome to Project Astera. By accessing or using our library website, you agree to comply with and be bound by the following Terms of Use.
            </p>

            <h3 className="font-display font-semibold text-sage-dark text-lg mt-6">1. Free Educational License</h3>
            <p>
              All study notes, guides, worksheets, and diagrams uploaded by volunteers are licensed under a Creative Commons Attribution-NonCommercial (CC BY-NC) license. You may download, print, and distribute these materials for individual or classroom educational purposes, but they may NOT be sold or commercialized.
            </p>

            <h3 className="font-display font-semibold text-sage-dark text-lg mt-6">2. Acceptable Volunteer Uploads</h3>
            <p>
              Volunteers who submit resources must ensure:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>They own the copyright to the notes or have open distribution permissions.</li>
              <li>The documents contain no spam, offensive remarks, or advertisement marketing links.</li>
              <li>The curriculum tags are accurate.</li>
            </ul>

            <h3 className="font-display font-semibold text-sage-dark text-lg mt-6">3. Content Moderation</h3>
            <p>
              Project Astera administrators reserve the right to approve, reject, modify metadata, or delete any resource at their discretion to maintain a safe and spam-free library catalog.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

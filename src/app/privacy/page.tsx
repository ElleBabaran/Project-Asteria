"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <main className="bg-cream min-h-screen flex flex-col font-body">
      <Navbar />

      <section className="flex-1 mx-auto max-w-4xl w-full px-6 py-16 lg:px-10">
        <div className="bg-paper rounded-card border-2 border-sage-dark/8 p-8 shadow-card prose prose-sage">
          <h1 className="font-display text-3xl font-semibold text-sage-dark mb-4">Privacy Policy</h1>
          <p className="text-xs text-ink/50 font-mono mb-8">Last Updated: June 13, 2026</p>

          <div className="space-y-6 text-sm text-ink/75 leading-relaxed">
            <p>
              At Project Astera, one of our main priorities is the privacy of our visitors and students. This Privacy Policy document contains types of information that is collected and recorded by Project Astera and how we use it.
            </p>

            <h3 className="font-display font-semibold text-sage-dark text-lg mt-6">1. Information We Collect</h3>
            <p>
              We collect minimal information to provide educational services. For registered students and volunteers, we collect:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Name or Username</li>
              <li>Email address (for account sync and verification)</li>
              <li>Material tags and metadata uploads (for volunteers)</li>
              <li>Saved lists and favorite resource identifiers (cached in local state)</li>
            </ul>

            <h3 className="font-display font-semibold text-sage-dark text-lg mt-6">2. How We Use Your Information</h3>
            <p>
              We use the collected information for operations including:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Provide, operate, and maintain our educational library catalog.</li>
              <li>Understand and analyze how you use our library to recommend matching resources.</li>
              <li>Develop new features (like practice quizzes or translations).</li>
              <li>Moderate volunteer resource uploads to verify licensing rules.</li>
            </ul>

            <h3 className="font-display font-semibold text-sage-dark text-lg mt-6">3. LocalStorage and Cookies</h3>
            <p>
              Project Astera simulates state features by storing settings, recently viewed notes, and favorites directly in your browser&apos;s <code>localStorage</code>. No tracking cookies are sent to advertisement networks.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

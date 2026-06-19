"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Globe, Building, Mail, Award, CheckCircle } from "lucide-react";

export default function PartnerPage() {
  const [orgName, setOrgName] = useState("");
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("school");
  const [details, setDetails] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName || !contactName || !email || !details) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSending(true);

    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orgName, contactName, email, type, details }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to submit partnership request. Please try again.");
        return;
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error("[partner submit]", error);
      alert("Unable to submit request. Please check your connection and try again.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="bg-cream min-h-screen flex flex-col font-body">
      <Navbar />

      <section className="flex-1 mx-auto max-w-4xl w-full px-6 py-16 lg:px-10 grid gap-12 lg:grid-cols-[1fr_1.2fr] items-center">
        
        {/* Left Side Copy */}
        <div className="space-y-6">
          <span className="flex h-10 w-10 items-center justify-center rounded-card bg-butter-light text-sage-dark">
            <Building size={20} />
          </span>
          <h1 className="font-display text-3xl font-semibold text-sage-dark sm:text-4xl leading-tight">
            Partner With Project Astera
          </h1>
          <p className="text-sm leading-relaxed text-ink/75">
            We partner with schools, community learning hubs, local libraries, and NGOs to deliver physical and digital copies of study guides to students who need them most.
          </p>

          <div className="space-y-4">
            <div className="flex gap-3 text-xs text-ink/70">
              <CheckCircle size={16} className="text-leaf shrink-0 mt-0.5" />
              <span><strong>Integration:</strong> Map our library catalog directly into your student portal.</span>
            </div>
            <div className="flex gap-3 text-xs text-ink/70">
              <CheckCircle size={16} className="text-leaf shrink-0 mt-0.5" />
              <span><strong>Bulk Prints:</strong> Request offline printing kits for low-bandwidth environments.</span>
            </div>
            <div className="flex gap-3 text-xs text-ink/70">
              <CheckCircle size={16} className="text-leaf shrink-0 mt-0.5" />
              <span><strong>Co-Branding:</strong> Custom curriculum templates for schools.</span>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-paper rounded-card border-2 border-sage-dark/8 p-6 sm:p-8 shadow-card relative">
          {isSubmitted ? (
            <div className="text-center py-10 space-y-4">
              <Award size={48} className="mx-auto text-leaf animate-bounce" />
              <h3 className="font-display text-2xl font-bold text-sage-dark">Proposal Received</h3>
              <p className="text-xs text-ink/65 leading-relaxed max-w-xs mx-auto">
                Thank you! We received the partnership proposal from <strong className="text-ink">{orgName}</strong>. A program manager will reach out to <strong className="text-ink">{email}</strong> within 3 business days to discuss collaboration pathways.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-6 rounded-card bg-sage-dark text-paper px-6 py-2 text-xs font-semibold shadow"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-display text-lg font-bold text-sage-dark border-b border-sage-dark/8 pb-3 mb-4">
                Partnership Inquiry
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-sage-dark">Organization Name *</label>
                <div className="flex items-center gap-2 rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2">
                  <Building size={13} className="text-sage" />
                  <input
                    type="text"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. St. Mary High School"
                    className="w-full bg-transparent text-xs text-ink focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-sage-dark">Contact Person *</label>
                <div className="flex items-center gap-2 rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2">
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Elena Vance"
                    className="w-full bg-transparent text-xs text-ink focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-sage-dark">Contact Email *</label>
                  <div className="flex items-center gap-2 rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="elena@stmary.edu"
                      className="w-full bg-transparent text-xs text-ink focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-sage-dark">Partnership Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2 text-xs text-ink outline-none"
                  >
                    <option value="school">Primary/Secondary School</option>
                    <option value="ngo">NGO / Educational Charity</option>
                    <option value="university">University / College</option>
                    <option value="sponsor">Corporate Sponsor</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-sage-dark">Collaboration Intent *</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Explain how you would like to collaborate (e.g. bulk downloads, curriculum alignment, student signups)..."
                  rows={4}
                  className="w-full rounded-card border border-sage-dark/10 bg-cream/35 p-3 text-xs text-ink outline-none focus:border-sage"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full rounded-card bg-sage-dark text-paper py-3 font-semibold text-xs shadow hover:bg-sage transition-all disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSending ? "Sending..." : "Submit Partnership Request"}
              </button>
            </form>
          )}
        </div>

      </section>

      <Footer />
    </main>
  );
}

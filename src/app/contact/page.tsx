"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, CheckCircle, Info } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("general");
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("Please fill in all required fields.");
      return;
    }
    setIsSubmitted(true);
  };

  return (
    <main className="bg-cream min-h-screen flex flex-col font-body">
      <Navbar />

      <section className="flex-1 mx-auto max-w-5xl w-full px-6 py-16 lg:px-10 grid gap-12 lg:grid-cols-[1fr_1.3fr] items-start">
        
        {/* Left: contact detail cards */}
        <div className="space-y-6">
          <div>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-sage block mb-2">Get in touch</span>
            <h1 className="font-display text-3xl font-semibold text-sage-dark sm:text-4xl">Contact Us</h1>
            <p className="mt-3 text-sm leading-relaxed text-ink/75">
              Have questions about copyright, volunteer qualifications, or technical platform issues? Reach out below and our support team will follow up.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 p-4 bg-paper rounded-card border border-sage-dark/5 shadow-sm">
              <Mail className="text-sage shrink-0 mt-1" size={18} />
              <div>
                <h4 className="font-semibold text-sage-dark text-xs">Email support</h4>
                <p className="text-xs text-ink/65 mt-0.5">support@projectastera.org</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-paper rounded-card border border-sage-dark/5 shadow-sm">
              <MapPin className="text-sage shrink-0 mt-1" size={18} />
              <div>
                <h4 className="font-semibold text-sage-dark text-xs">Office Address</h4>
                <p className="text-xs text-ink/65 mt-0.5">A-12, Global Education Council Hub, Sector 62, Noida, UP, India</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <div className="bg-paper rounded-card border-2 border-sage-dark/8 p-6 sm:p-8 shadow-card relative">
          {isSubmitted ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle size={44} className="mx-auto text-leaf animate-bounce" />
              <h3 className="font-display text-2xl font-bold text-sage-dark">Message Sent!</h3>
              <p className="text-xs text-ink/65 leading-relaxed max-w-xs mx-auto">
                Thank you, <strong className="text-ink">{name}</strong>! We have received your inquiry. A ticket has been opened and we will get back to <strong className="text-ink">{email}</strong> within 24 hours.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="mt-4 text-xs font-semibold text-sage hover:underline"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-display text-lg font-bold text-sage-dark border-b border-sage-dark/8 pb-3 mb-4">
                Send a Message
              </h3>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-sage-dark">Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2 text-xs text-ink outline-none focus:border-sage"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-sage-dark">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2 text-xs text-ink outline-none focus:border-sage"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-sage-dark">Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2 text-xs text-ink outline-none focus:border-sage"
                >
                  <option value="general">General Inquiry</option>
                  <option value="tech">Website Bugs / Tech issues</option>
                  <option value="copyright">Copyright / DMCA / Content abuse</option>
                  <option value="press">Press / Media outreach</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-sage-dark">Message *</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your details here..."
                  rows={4}
                  className="w-full rounded-card border border-sage-dark/10 bg-cream/35 p-3 text-xs text-ink outline-none focus:border-sage"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 rounded-card bg-sage-dark text-paper py-3 font-semibold text-xs shadow hover:bg-sage transition-all pt-2"
              >
                <Send size={12} />
                <span>Send Support Ticket</span>
              </button>
            </form>
          )}
        </div>

      </section>

      <Footer />
    </main>
  );
}

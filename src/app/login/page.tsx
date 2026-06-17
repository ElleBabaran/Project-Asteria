"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import { BookOpen, Key, Mail, User, Shield, CheckCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { login } = useApp();
  const router = useRouter();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [role, setRole] = useState<"student" | "volunteer" | "admin">("student");
  
  // Input fields
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  // Verification step mock
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (isLoginTab) {
      // Login flow
      login(email, role);
      alert(`Successfully logged in as ${email.split("@")[0]} (${role})!`);
      router.push(`/dashboard/${role}`);
    } else {
      // Signup flow requires verification
      if (!name) return;
      setIsVerifying(true);
    }
  };

  const handleVerifyComplete = () => {
    setIsVerifying(false);
    login(email, role);
    alert(`Account verified! Logged in as ${name} (${role}).`);
    router.push(`/dashboard/${role}`);
    
    // Clear fields
    setEmail("");
    setName("");
    setPassword("");
  };

  return (
    <main className="bg-cream min-h-screen flex flex-col font-body">
      <Navbar />

      <section className="flex-1 flex items-center justify-center py-16 px-6">
        <div className="w-full max-w-md bg-paper rounded-card border-2 border-sage-dark/8 p-8 shadow-2xl relative overflow-hidden">
          
          {/* Logo brand decoration */}
          <div className="flex flex-col items-center text-center mb-8">
            <span className="flex h-10 w-10 items-center justify-center rounded-card bg-sage text-paper mb-3">
              <BookOpen size={20} />
            </span>
            <h2 className="font-display text-2xl font-bold text-sage-dark">
              {isLoginTab ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-xs text-ink/50 mt-1">
              {isLoginTab
                ? "Access your dashboard and study library"
                : "Join Astera resource network today"}
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex border border-sage-dark/10 rounded-card p-1 mb-6 bg-cream/35">
            <button
              onClick={() => setIsLoginTab(true)}
              className={`flex-1 py-2 text-xs font-semibold rounded-card transition-all ${
                isLoginTab ? "bg-paper text-sage-dark shadow-sm" : "text-ink/50 hover:text-sage-dark"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLoginTab(false)}
              className={`flex-1 py-2 text-xs font-semibold rounded-card transition-all ${
                !isLoginTab ? "bg-paper text-sage-dark shadow-sm" : "text-ink/50 hover:text-sage-dark"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name - Register only */}
            {!isLoginTab && (
              <div className="space-y-1">
                <label className="text-xs font-semibold text-sage-dark block">Full Name</label>
                <div className="flex items-center gap-2 rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2.5 shadow-inner">
                  <User size={14} className="text-sage" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full bg-transparent text-xs text-ink placeholder:text-ink/40 focus:outline-none"
                    required
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-sage-dark block">Email Address</label>
              <div className="flex items-center gap-2 rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2.5 shadow-inner">
                <Mail size={14} className="text-sage" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. you@example.com"
                  className="w-full bg-transparent text-xs text-ink placeholder:text-ink/40 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-sage-dark block">Password</label>
              <div className="flex items-center gap-2 rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2.5 shadow-inner">
                <Key size={14} className="text-sage" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-xs text-ink placeholder:text-ink/40 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Role select */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-sage-dark block">Log in Role Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "student", label: "Student" },
                  { id: "volunteer", label: "Volunteer" },
                  { id: "admin", label: "Admin" }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRole(item.id as any)}
                    className={`py-2 text-[10px] font-bold rounded-card border transition-all uppercase tracking-wider ${
                      role === item.id
                        ? "bg-sage-dark text-paper border-sage-dark"
                        : "bg-paper text-sage-dark border-sage-dark/15 hover:bg-cream/40"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Terms Consent - Register only */}
            {!isLoginTab && (
              <p className="text-[10px] text-ink/50 leading-relaxed pt-2">
                By checking register, you consent to our privacy terms and agree to verify your school email domain.
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-1.5 rounded-card bg-sage-dark text-paper py-3 font-semibold text-xs shadow-card hover:bg-sage transition-all mt-4"
            >
              <span>{isLoginTab ? "Sign In to Library" : "Request Registration"}</span>
              <ArrowRight size={13} />
            </button>
          </form>

          {/* Verification Dialog Box */}
          {isVerifying && (
            <div className="absolute inset-0 bg-paper/95 flex flex-col items-center justify-center p-6 text-center z-10">
              <Mail className="text-sage animate-pulse mb-3" size={40} />
              <h3 className="font-display font-semibold text-sage-dark">Email Verification Sent</h3>
              <p className="text-xs text-ink/65 mt-2 max-w-xs leading-relaxed">
                We sent a simulation code to <strong className="font-medium text-ink">{email}</strong>. Check your inbox and click the button below to confirm verification.
              </p>

              <div className="mt-6 flex flex-col gap-2 w-full">
                <button
                  onClick={handleVerifyComplete}
                  className="w-full flex items-center justify-center gap-1 rounded-card bg-leaf-light px-4 py-2.5 text-xs font-semibold text-sage-dark hover:bg-leaf shadow-sm"
                >
                  <CheckCircle size={13} />
                  <span>Verify Email & Login</span>
                </button>
                <button
                  onClick={() => setIsVerifying(false)}
                  className="text-xs text-ink/50 font-semibold py-1.5 hover:text-ink"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}

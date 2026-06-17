"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import { BookOpen, Key, Mail, User, CheckCircle, ArrowRight, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

// Password strength checker
function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

  if (score <= 1) return { score, label: "Very Weak", color: "bg-red-500" };
  if (score === 2) return { score, label: "Weak", color: "bg-orange-500" };
  if (score === 3) return { score, label: "Fair", color: "bg-yellow-500" };
  if (score === 4) return { score, label: "Strong", color: "bg-lime-500" };
  return { score, label: "Very Strong", color: "bg-green-500" };
}

export default function LoginPage() {
  const { login } = useApp();
  const router = useRouter();

  const [isLoginTab, setIsLoginTab] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"student" | "volunteer">("student");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const strength = getPasswordStrength(password);

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Uppercase letter (A-Z)", met: /[A-Z]/.test(password) },
    { label: "Lowercase letter (a-z)", met: /[a-z]/.test(password) },
    { label: "Number (0-9)", met: /\d/.test(password) },
    { label: "Special character (!@#$...)", met: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isLoginTab) {
        // --- Real Login via DB ---
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Login failed.");
          return;
        }

        // Login to local context with role from DB
        login(data.user.email, data.user.role);
        router.push(`/dashboard/${data.user.role}`);
      } else {
        // --- Real Register via DB ---
        if (!name) {
          setError("Full name is required.");
          return;
        }

        const allMet = passwordRequirements.every((r) => r.met);
        if (!allMet) {
          setError("Please meet all password requirements.");
          return;
        }

        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, role }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Registration failed.");
          return;
        }

        // Show verification notice (mock - real email requires Resend/Nodemailer)
        setIsVerifying(true);
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyComplete = () => {
    setIsVerifying(false);
    login(email, role);
    router.push(`/dashboard/${role}`);
    setEmail("");
    setName("");
    setPassword("");
    setRole("student");
  };

  const switchTab = (toLogin: boolean) => {
    setIsLoginTab(toLogin);
    setError("");
    setPassword("");
    setRole("student");
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
              onClick={() => switchTab(true)}
              className={`flex-1 py-2 text-xs font-semibold rounded-card transition-all ${
                isLoginTab ? "bg-paper text-sage-dark shadow-sm" : "text-ink/50 hover:text-sage-dark"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => switchTab(false)}
              className={`flex-1 py-2 text-xs font-semibold rounded-card transition-all ${
                !isLoginTab ? "bg-paper text-sage-dark shadow-sm" : "text-ink/50 hover:text-sage-dark"
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-card px-3 py-2.5 mb-4">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

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
                    placeholder="Enter your full name"
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
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-xs text-ink placeholder:text-ink/40 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-ink/40 hover:text-sage-dark transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Password strength & requirements (Register only) */}
              {!isLoginTab && password.length > 0 && (
                <div className="mt-2 space-y-2">
                  {/* Strength bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-sage-dark/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                        style={{ width: `${(strength.score / 5) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-mono text-ink/50 w-20 text-right">{strength.label}</span>
                  </div>

                  {/* Requirements checklist */}
                  <ul className="space-y-1">
                    {passwordRequirements.map((req) => (
                      <li key={req.label} className={`flex items-center gap-1.5 text-[10px] transition-colors ${req.met ? "text-green-600" : "text-ink/50"}`}>
                        <CheckCircle size={10} className={req.met ? "text-green-500" : "text-ink/20"} />
                        {req.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Role Selector - Register only */}
            {!isLoginTab && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-sage-dark block">I am joining as a...</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "student", label: "👨‍🎓 Student", desc: "Browse & save resources" },
                    { id: "volunteer", label: "✍️ Volunteer", desc: "Upload & share materials" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRole(item.id as any)}
                      className={`flex flex-col items-start p-3 rounded-card border-2 text-left transition-all ${
                        role === item.id
                          ? "border-sage-dark bg-sage-dark/5 text-sage-dark"
                          : "border-sage-dark/10 bg-cream/20 text-ink/60 hover:border-sage-dark/30"
                      }`}
                    >
                      <span className="text-xs font-bold">{item.label}</span>
                      <span className="text-[10px] mt-0.5 opacity-70">{item.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Terms Consent - Register only */}
            {!isLoginTab && (
              <p className="text-[10px] text-ink/50 leading-relaxed pt-1">
                By registering, you consent to our privacy terms. Your account will be created with the <strong className="text-sage-dark">{role === "volunteer" ? "Volunteer" : "Student"}</strong> role — {role === "volunteer" ? "you can upload and manage study materials." : "you can browse, save, and review study materials."}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-1.5 rounded-card bg-sage-dark text-paper py-3 font-semibold text-xs shadow-card hover:bg-sage transition-all mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>{isLoading ? "Please wait..." : isLoginTab ? "Sign In to Library" : "Create Account"}</span>
              {!isLoading && <ArrowRight size={13} />}
            </button>
          </form>

          {/* Verification Dialog Box */}
          {isVerifying && (
            <div className="absolute inset-0 bg-paper/95 flex flex-col items-center justify-center p-6 text-center z-10">
              <Mail className="text-sage animate-pulse mb-3" size={40} />
              <h3 className="font-display font-semibold text-sage-dark">Account Created!</h3>
              <p className="text-xs text-ink/65 mt-2 max-w-xs leading-relaxed">
                Your account has been created for <strong className="font-medium text-ink">{email}</strong>. Click below to continue to your dashboard.
              </p>

              <div className="mt-6 flex flex-col gap-2 w-full">
                <button
                  onClick={handleVerifyComplete}
                  className="w-full flex items-center justify-center gap-1 rounded-card bg-leaf-light px-4 py-2.5 text-xs font-semibold text-sage-dark hover:bg-leaf shadow-sm"
                >
                  <CheckCircle size={13} />
                  <span>Go to Dashboard</span>
                </button>
                <button
                  onClick={() => setIsVerifying(false)}
                  className="text-xs text-ink/50 font-semibold py-1.5 hover:text-ink"
                >
                  Back
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

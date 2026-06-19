"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { Settings, Shield, User, Award, RefreshCw, X, LayoutDashboard } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DevSandbox() {
  const { user, login, logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleRoleChange = (role: "student" | "volunteer" | "admin" | "guest") => {
    if (role === "guest") {
      logout();
      router.push("/");
    } else {
      login(
        `${role}-${Date.now()}`,
        `${role.charAt(0).toUpperCase()}${role.slice(1)}`,
        `${role}@astera.org`,
        role
      );
      router.push(`/dashboard/${role}`);
    }
  };

  const resetLocalStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-body">
      {/* Trigger Button — gentle pulse instead of bounce+spin */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 rounded-full bg-sage-dark px-4 py-3 text-sm font-semibold text-paper shadow-lg border border-sage-light/20 transition-all duration-300 hover:bg-sage hover:scale-105 active:scale-95 ${
          isOpen ? "scale-95 opacity-90" : ""
        }`}
        aria-label="Open Dev Sandbox"
        aria-expanded={isOpen}
      >
        <Settings
          size={16}
          className={`transition-transform duration-700 ${isOpen ? "rotate-90" : "rotate-0"}`}
        />
        <span>Role Switcher</span>
        {user ? (
          <span className="flex h-5 items-center justify-center rounded-full bg-butter/20 px-2 text-[10px] font-bold text-butter uppercase tracking-wider">
            {user.role}
          </span>
        ) : (
          <span className="flex h-5 items-center justify-center rounded-full bg-ink/20 px-2 text-[10px] font-bold text-paper/70 uppercase tracking-wider">
            Guest
          </span>
        )}
      </button>

      {/* Sandbox Panel — animated slide-up */}
      <div
        className={`absolute bottom-14 right-0 w-80 transition-all duration-300 ease-out origin-bottom-right ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0 pointer-events-auto"
            : "scale-95 opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="rounded-card border border-sage-dark/15 bg-paper/95 p-5 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-sage-dark/10 pb-3">
            <div className="flex items-center gap-2">
              <Settings size={18} className="text-sage" />
              <h4 className="font-display font-semibold text-sage-dark">Dev Sandbox</h4>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 text-ink/40 transition-colors hover:bg-ink/5 hover:text-ink"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-ink/60">
            Switch roles below to instantly access respective dashboards and test all interactions.
          </p>

          <div className="mt-4 flex flex-col gap-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-sage">
              Choose Role:
            </span>

            {/* Guest */}
            <button
              onClick={() => handleRoleChange("guest")}
              className={`flex items-center justify-between rounded-card px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                !user
                  ? "bg-sage-dark text-paper"
                  : "bg-sage-dark/5 text-sage-dark hover:bg-sage-dark/10"
              }`}
            >
              <span className="flex items-center gap-2">
                <User size={15} />
                <span>Guest / Student (Anon)</span>
              </span>
              {!user && <span className="h-2 w-2 rounded-full bg-butter" />}
            </button>

            {/* Student */}
            <button
              onClick={() => handleRoleChange("student")}
              className={`flex items-center justify-between rounded-card px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                user?.role === "student"
                  ? "bg-blush text-sage-dark font-bold"
                  : "bg-blush-light/35 text-sage-dark hover:bg-blush-light/60"
              }`}
            >
              <span className="flex items-center gap-2">
                <Award size={15} />
                <span>Student (Logged In)</span>
              </span>
              {user?.role === "student" && <span className="h-2 w-2 rounded-full bg-sage-dark" />}
            </button>

            {/* Volunteer */}
            <button
              onClick={() => handleRoleChange("volunteer")}
              className={`flex items-center justify-between rounded-card px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                user?.role === "volunteer"
                  ? "bg-leaf text-sage-dark font-bold"
                  : "bg-leaf-light/35 text-sage-dark hover:bg-leaf-light/60"
              }`}
            >
              <span className="flex items-center gap-2">
                <LayoutDashboard size={15} />
                <span>Volunteer</span>
              </span>
              {user?.role === "volunteer" && <span className="h-2 w-2 rounded-full bg-sage-dark" />}
            </button>

            {/* Admin */}
            <button
              onClick={() => handleRoleChange("admin")}
              className={`flex items-center justify-between rounded-card px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                user?.role === "admin"
                  ? "bg-butter text-sage-dark font-bold"
                  : "bg-butter-light/35 text-sage-dark hover:bg-butter-light/60"
              }`}
            >
              <span className="flex items-center gap-2">
                <Shield size={15} />
                <span>Administrator</span>
              </span>
              {user?.role === "admin" && <span className="h-2 w-2 rounded-full bg-sage-dark" />}
            </button>
          </div>

          <div className="mt-4 border-t border-sage-dark/10 pt-3 flex items-center justify-between">
            <span className="text-[10px] text-ink/40 font-mono">
              {user ? `Logged in as ${user.name}` : "Not logged in"}
            </span>
            <button
              onClick={resetLocalStorage}
              className="flex items-center gap-1 rounded px-2 py-1 text-[10px] font-bold text-rose-600 transition-colors hover:bg-rose-50"
              title="Clear LocalStorage and reload page"
            >
              <RefreshCw size={10} />
              <span>Reset State</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

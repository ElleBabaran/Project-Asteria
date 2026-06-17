"use client";

import { useState } from "react";
import { BookOpen, Menu, X, LogOut, User as UserIcon, Home } from "lucide-react";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import NotificationBell from "@/components/NotificationBell";

const navLinks = [
  { label: "Explore", href: "/explore" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Volunteer", href: "/volunteer-apply" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  // Show Home link for guests when they are NOT on the homepage
  const isGuest = !user;
  const showHomeLink = isGuest && pathname !== "/";

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const getDashboardHref = () => {
    if (!user) return "/login";
    return `/dashboard/${user.role}`;
  };

  return (
    <header className="sticky top-0 z-50 border-b border-sage-dark/10 bg-cream/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-card bg-sage text-paper transition-transform duration-300 group-hover:rotate-6">
            <BookOpen size={18} strokeWidth={2.25} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-sage-dark">
            Project Astera
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-8 md:flex">
          {/* Home link for guests navigating away from homepage */}
          {showHomeLink && (
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm font-medium text-ink/70 transition-colors hover:text-sage-dark"
            >
              <Home size={14} />
              Home
            </Link>
          )}
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="link-sweep text-sm font-medium text-ink/70 transition-colors hover:text-sage-dark"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <div className="flex items-center gap-4">
              <NotificationBell userId={user.email} />
              <Link
                href={getDashboardHref()}
                className="flex items-center gap-1.5 text-sm font-semibold text-sage-dark transition-colors hover:text-sage"
              >
                <UserIcon size={15} />
                <span>Dashboard ({user.name})</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm font-medium text-rose-600 transition-colors hover:text-rose-800"
                title="Log out"
              >
                <LogOut size={15} />
                <span>Log out</span>
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-sage-dark transition-colors hover:text-sage"
              >
                Log in
              </Link>
              <Link
                href="/explore"
                className="rounded-card bg-sage-dark px-4 py-2.5 text-sm font-semibold text-paper shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95"
              >
                Explore resources
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="flex h-10 w-10 items-center justify-center rounded-card text-sage-dark transition-all duration-200 hover:bg-sage-dark/5 md:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <span className={`flex transition-transform duration-300 ${open ? "rotate-90" : "rotate-0"}`}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </span>
        </button>
      </nav>

      {/* Mobile Drawer — animated slide-down */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out md:hidden ${
          open ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!open}
      >
        <div className="border-t border-sage-dark/10 bg-paper px-6 py-5">
          <div className="flex flex-col gap-4">
            {/* Home link for guests */}
            {showHomeLink && (
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-sm font-semibold text-sage-dark transition-colors hover:text-sage"
              >
                <Home size={14} />
                Home
              </Link>
            )}
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="link-sweep text-sm font-medium text-ink/80 transition-colors hover:text-sage-dark"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-3 border-t border-sage-dark/10 pt-4">
              {user ? (
                <>
                  <div className="flex items-center gap-2">
                    <NotificationBell userId={user.email} />
                    <span className="text-xs text-ink/40">Notifications</span>
                  </div>
                  <Link
                    href={getDashboardHref()}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-1.5 text-sm font-semibold text-sage-dark"
                  >
                    <UserIcon size={15} />
                    <span>My Dashboard ({user.name})</span>
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      handleLogout();
                    }}
                    className="flex items-center gap-1 text-left text-sm font-medium text-rose-600"
                  >
                    <LogOut size={15} />
                    <span>Log out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="text-sm font-semibold text-sage-dark"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/explore"
                    onClick={() => setOpen(false)}
                    className="rounded-card bg-sage-dark px-4 py-2.5 text-center text-sm font-semibold text-paper"
                  >
                    Explore resources
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

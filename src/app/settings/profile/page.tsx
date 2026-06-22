"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp } from "@/context/AppContext";
import { User, Image as ImageIcon, CheckCircle, Upload, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfileSettingsPage() {
  const { user, updateUser } = useApp();
  const router = useRouter();

  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [image, setImage] = useState(user?.image ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      setName(user.name ?? "");
      setBio(user.bio ?? "");
      setImage(user.image ?? "");
    }
  }, [user, router]);

  if (!user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      updateUser({ name, bio, image });
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  return (
    <main className="bg-cream min-h-screen flex flex-col font-body">
      <Navbar />

      <section className="flex-1 py-12 px-6">
        <div className="max-w-2xl mx-auto space-y-6">
          
          <div className="flex items-center justify-between border-b border-sage-dark/10 pb-4">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-sage hover:text-sage-dark transition-colors"
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <h1 className="font-display text-2xl font-bold text-sage-dark">Profile Settings</h1>
            <div className="w-16" />{/* spacer */}
          </div>

          <div className="bg-paper rounded-card border border-sage-dark/10 p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Avatar section */}
              <div className="flex items-start gap-6 pb-6 border-b border-sage-dark/5">
                <div className="h-20 w-20 rounded-full bg-sage-dark/10 overflow-hidden flex items-center justify-center border-2 border-sage-dark/20 shrink-0">
                  {image ? (
                    <img src={image} alt={name} className="h-full w-full object-cover" />
                  ) : (
                    <User size={32} className="text-sage" />
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-xs font-semibold text-sage-dark block">Profile Picture URL</label>
                  <div className="flex items-center gap-2 rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2">
                    <ImageIcon size={14} className="text-sage" />
                    <input
                      type="url"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full bg-transparent text-xs text-ink placeholder:text-ink/40 focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-ink/50 leading-relaxed">
                    Provide a link to an image (e.g. Imgur, GitHub avatar) to use as your profile picture.
                  </p>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-sage-dark block">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2.5 text-xs text-ink outline-none focus:border-sage"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-sage-dark block">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    placeholder="Tell us a little about yourself, your subjects, or your background..."
                    className="w-full rounded-card border border-sage-dark/10 bg-cream/35 p-3 text-xs text-ink outline-none focus:border-sage"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-sage-dark block opacity-50">Email Address (Read-only)</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="w-full rounded-card border border-sage-dark/10 bg-cream/20 px-3 py-2.5 text-xs text-ink/50 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <span className="text-sm font-medium text-leaf flex items-center gap-1 transition-opacity duration-300" style={{ opacity: showSuccess ? 1 : 0 }}>
                  <CheckCircle size={16} />
                  Changes saved!
                </span>
                
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 rounded-card bg-sage-dark text-paper px-6 py-2.5 text-sm font-semibold shadow hover:bg-sage disabled:opacity-70 transition-all"
                >
                  <Upload size={14} />
                  {isSaving ? "Saving..." : "Save Profile"}
                </button>
              </div>

            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

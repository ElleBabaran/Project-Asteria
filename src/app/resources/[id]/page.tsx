"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp, Resource } from "@/context/AppContext";
import { ArrowLeft, Download, Heart, Star, Calendar, User, FileText, AlertTriangle, Send, CheckCircle, LogIn } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResourceDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { user, resources, savedResources, toggleFavorite, recordDownload, recordView, addComment, reportBrokenLink } = useApp();
  const router = useRouter();

  // Find target resource
  const resource = resources.find((res) => res.id === id);

  // Form states
  const [commentText, setCommentText] = useState("");
  const [rating, setRating] = useState(5);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportText, setReportText] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  // Guest login prompt
  const [guestPrompt, setGuestPrompt] = useState<string | null>(null);

  // Record view on mount
  useEffect(() => {
    if (resource) {
      recordView(resource.id);
    }
  }, [resource, recordView]);

  if (!resource) {
    return (
      <main className="bg-cream min-h-screen flex flex-col font-body">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <AlertTriangle size={48} className="text-rose-500 mb-4" />
          <h2 className="font-display text-2xl font-semibold text-sage-dark">Resource not found</h2>
          <p className="mt-2 text-sm text-ink/65 max-w-sm">
            The study material you are looking for might have been removed, renamed, or is currently pending approval.
          </p>
          <Link href="/explore" className="mt-6 rounded-card bg-sage-dark px-4 py-2 text-xs font-semibold text-paper">
            Back to Library
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const isFavorited = savedResources.includes(resource.id);

const handleDownload = () => {
  recordDownload(resource.id);

  if (resource.fileUrl) {
    const a = document.createElement("a");
    a.href = resource.fileUrl;
    a.download = resource.fileUrl.split("/").pop() || "resource";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    alert(`Starting download of ${resource.title} (${resource.fileSize})...`);
    return;
  }

  // Simulate file download
  const filename = `${resource.title.toLowerCase().replace(/\s+/g, "_")}.${
    resource.fileType === "PPT" ? "pptx" : resource.fileType === "DOC" ? "docx" : "pdf"
  }`;
  const blob = new Blob([`Simulated content for ${resource.title}`], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  alert(`Starting download of ${resource.title} (${resource.fileSize})...`);
};

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setGuestPrompt("leave a review"); return; }
    if (!commentText.trim()) return;
    addComment(resource.id, commentText.trim(), rating);
    setCommentText("");
    setRating(5);
    alert("Thank you for your feedback!");
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim()) return;
    setReportLoading(true);
    try {
      // Try to save to real DB if resource has a real UUID id
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId: resource.id,
          description: reportText.trim(),
          reporterEmail: user?.email ?? null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Failed to submit report." }));
        alert(data.error || "Failed to submit report. Please try again.");
        setReportLoading(false);
        return;
      }
    } catch (_) {
      // fallback: save locally via context
      reportBrokenLink(resource.id, reportText.trim());
    }
    setReportSubmitted(true);
    setReportText("");
    setTimeout(() => {
      setIsReportModalOpen(false);
      setReportSubmitted(false);
    }, 2000);
    setReportLoading(false);
  };

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/explore");
    }
  };

  // Compute rating average
  const getAverageRating = () => {
    if (resource.comments.length === 0) return 5.0;
    const rated = resource.comments.filter((c) => c.rating !== undefined);
    if (rated.length === 0) return 5.0;
    const sum = rated.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    return (sum / rated.length).toFixed(1);
  };

  return (
    <main className="bg-cream min-h-screen flex flex-col font-body">
      <Navbar />

      <section className="flex-1 mx-auto max-w-6xl w-full px-6 py-8 lg:px-10">
        {/* Back button */}
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-sage hover:text-sage-dark mb-6 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to library</span>
        </button>

        {/* Layout Grid */}
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          
          {/* Left Column: Resource Preview & Details */}
          <div className="space-y-6">
            
            {/* Main Info Card */}
            <div className="rounded-card border-2 border-sage-dark/8 bg-paper p-6 sm:p-8 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <span className="inline-flex items-center gap-1.5 rounded-[0.4rem] bg-leaf-light px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sage-dark">
                  {resource.fileType} · {resource.fileSize}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (!user) { setGuestPrompt("save this resource to your favorites"); return; }
                      toggleFavorite(resource.id);
                    }}
                    className="flex items-center gap-1.5 rounded-card border border-sage-dark/15 px-3 py-1.5 text-xs font-semibold text-sage-dark transition-colors hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600"
                  >
                    <Heart size={14} className={isFavorited ? "fill-rose-500 text-rose-500" : ""} />
                    <span>{isFavorited ? "Saved" : "Save Favorite"}</span>
                  </button>
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-card border border-sage-dark/15 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <AlertTriangle size={14} />
                    <span>Report Error</span>
                  </button>
                </div>
              </div>

              <h1 className="mt-4 font-display text-3xl font-semibold text-sage-dark sm:text-4xl leading-tight">
                {resource.title}
              </h1>

              {/* Path metadata badge row */}
              <div className="mt-4 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-ink/50">
                <span className="bg-sage-dark/5 px-2 py-1 rounded">{resource.country}</span>
                <span>/</span>
                <span className="bg-sage-dark/5 px-2 py-1 rounded">{resource.curriculum}</span>
                <span>/</span>
                <span className="bg-sage-dark/5 px-2 py-1 rounded">{resource.grade}</span>
                <span>/</span>
                <span className="bg-sage-dark/5 px-2 py-1 rounded">{resource.subject}</span>
              </div>

              <div className="mt-6 border-t border-sage-dark/8 pt-6">
                <h3 className="font-display font-semibold text-sage-dark">Description</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/75">
                  {resource.description}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-ink/50 border-t border-sage-dark/8 pt-6">
                <span className="flex items-center gap-1.5">
                  <User size={14} className="text-sage" />
                  <span>Uploaded by: <strong className="font-medium text-ink">{resource.contributorName}</strong></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-sage" />
                  <span>Added on: <strong className="font-medium text-ink">{resource.uploadDate}</strong></span>
                </span>
              </div>
            </div>

            {/* Document Mockup Preview Panel */}
            <div className="rounded-card border-2 border-sage-dark/8 bg-paper p-6 shadow-card overflow-hidden">
              <div className="flex items-center justify-between border-b border-sage-dark/10 pb-4 mb-4">
                <span className="font-display font-semibold text-sage-dark">Document Preview</span>
                <span className="text-xs text-ink/40 font-mono">Page 1 of 3 (Preview Mode)</span>
              </div>

              {/* Structured mock content of document */}
              <div className="bg-cream/40 rounded-card p-6 border border-sage-dark/5 relative h-96 overflow-y-auto">
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-paper to-transparent pointer-events-none flex items-end justify-center pb-4">
                  <span className="bg-sage-dark text-paper px-3 py-1.5 rounded-full text-xs font-semibold shadow">
                    Download file to view all pages
                  </span>
                </div>

                <div className="space-y-6 max-w-prose mx-auto">
                  <div className="border-b border-sage-dark/10 pb-3 text-center">
                    <h2 className="font-display text-xl font-bold text-sage-dark uppercase tracking-tight">{resource.title}</h2>
                    <p className="font-mono text-[9px] text-ink/50 uppercase tracking-widest mt-1">
                      {resource.subject} &middot; {resource.grade} &middot; {resource.curriculum}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-sage-dark">1. Introduction to {resource.topic}</h3>
                    <p className="text-xs text-ink/80 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sodales nunc ac nibh imperdiet eleifend.
                      Integer tempor, ex vel condimentum pharetra, lectus velit egestas augue, in semper risus metus non felis.
                      Proin ut lacinia lacus. Etiam at tortor luctus, volutpat mi sed, tristique eros.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-sm text-sage-dark">2. Core Concepts</h3>
                    <p className="text-xs text-ink/80 leading-relaxed">
                      Sed pretium mi eu purus fermentum, ut eleifend elit dictum. Quisque cursus ipsum in magna interdum elementum.
                      Donec gravida lorem ut felis scelerisque rhoncus. Cras non metus sodales, pellentesque massa convallis, varius sapien:
                    </p>
                    <ul className="list-disc pl-5 text-xs text-ink/85 space-y-1">
                      <li>Key Definition A: Basic fundamental logic rules.</li>
                      <li>Key Definition B: Practical application cases.</li>
                      <li>Diagram breakdown: Illustrative system mapping.</li>
                    </ul>
                  </div>

                  <div className="bg-sage-light/20 p-4 rounded-card border border-sage/10 text-center">
                    <h4 className="font-display text-xs font-bold text-sage-dark">SIMULATED CLASSROOM PREVIEW</h4>
                    <p className="text-[10px] text-sage-dark/70 mt-1">
                      This represents a structural preview of the worksheets or classroom notes provided by {resource.contributorName}.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Downloads, Ratings, Comments Form */}
          <div className="space-y-6">
            
            {/* Quick Action Box */}
            <div className="rounded-card border-2 border-sage-dark/10 bg-sage-dark text-paper p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold tracking-tight">Need this resource?</h3>
              <p className="mt-2 text-xs text-paper/70 leading-relaxed">
                Project Astera study materials are free to download and print for self-study, study groups, or school classrooms.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  onClick={handleDownload}
                  className="flex w-full items-center justify-center gap-2 rounded-card bg-butter py-3.5 text-sm font-semibold text-sage-dark shadow-card transition-all hover:bg-butter-light hover:-translate-y-0.5"
                >
                  <Download size={16} />
                  <span>Download file ({resource.fileType})</span>
                </button>
                <div className="flex justify-between items-center text-[10px] text-paper/50 font-mono mt-1 px-1">
                  <span>File size: {resource.fileSize}</span>
                  <span>{resource.downloadsCount} downloads</span>
                </div>
              </div>
            </div>

            {/* Ratings Summary Card */}
            <div className="rounded-card border-2 border-sage-dark/8 bg-paper p-6 shadow-card">
              <h3 className="font-display font-semibold text-sage-dark">User Reviews</h3>
              <div className="mt-4 flex items-center gap-3">
                <span className="font-display text-4xl font-bold text-sage-dark">{getAverageRating()}</span>
                <div>
                  <div className="flex items-center text-butter">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={15}
                        className={s <= Math.round(Number(getAverageRating())) ? "fill-butter" : "text-sage-dark/10"}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-ink/50 block mt-1">Based on {resource.comments.length} ratings</span>
                </div>
              </div>

              {/* Review submit form */}
              <form onSubmit={handleCommentSubmit} className="mt-6 border-t border-sage-dark/8 pt-5 space-y-4">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-sage block">
                  Leave a Review
                </span>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-ink/60 mr-1">Your rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-butter transition-transform hover:scale-110"
                        aria-label={`Rate ${star} star${star === 1 ? "" : "s"}`}
                        title={`Rate ${star} star${star === 1 ? "" : "s"}`}
                      >
                        <Star size={18} className={star <= rating ? "fill-butter" : "text-sage-dark/15"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-card border border-sage-dark/10 bg-cream/40 p-2 shimmer-focus">
                  <input
                    type="text"
                    name="commentText"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write your feedback..."
                    className="w-full bg-transparent text-xs text-ink placeholder:text-ink/40 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="rounded-card bg-sage-dark p-2 text-paper transition-transform hover:scale-105"
                    aria-label="Submit review"
                    title="Submit review"
                  >
                    <Send size={12} />
                  </button>
                </div>
              </form>

              {/* Reviews List */}
              <div className="mt-6 border-t border-sage-dark/8 pt-5 space-y-4 max-h-60 overflow-y-auto pr-1">
                {resource.comments.length === 0 ? (
                  <p className="text-xs text-ink/50 italic text-center py-2">No reviews yet. Be the first to leave feedback!</p>
                ) : (
                  resource.comments.map((comment) => (
                    <div key={comment.id} className="text-xs border-b border-sage-dark/5 pb-3 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <strong className="font-semibold text-sage-dark capitalize">{comment.user}</strong>
                        <span className="text-[10px] text-ink/40 font-mono">{comment.date}</span>
                      </div>
                      {comment.rating !== undefined && (
                        <div className="flex items-center text-butter mt-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={10}
                              className={s <= (comment.rating || 0) ? "fill-butter text-butter" : "text-sage-dark/10"}
                            />
                          ))}
                        </div>
                      )}
                      <p className="mt-1.5 text-ink/75 leading-relaxed bg-cream/25 rounded p-2">
                        {comment.text}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Guest Login Prompt Modal */}
      {guestPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-paper rounded-card border-2 border-sage-dark/15 p-6 shadow-2xl text-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-dark/8 mx-auto">
              <LogIn size={22} className="text-sage-dark" />
            </div>
            <h3 className="font-display text-lg font-semibold text-sage-dark">Sign in required</h3>
            <p className="text-xs text-ink/65 leading-relaxed">
              You need to be logged in to {guestPrompt}. It&apos;s free and takes just a moment!
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/login"
                className="w-full flex items-center justify-center gap-2 rounded-card bg-sage-dark text-paper py-3 text-xs font-semibold shadow hover:bg-sage transition-colors"
              >
                <LogIn size={13} />
                Sign In or Register
              </Link>
              <button
                onClick={() => setGuestPrompt(null)}
                className="text-xs text-ink/50 font-semibold py-1.5 hover:text-ink"
              >
                Continue as Guest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}

      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-paper rounded-card border-2 border-sage-dark/15 p-6 shadow-2xl">
            <h3 className="font-display text-xl font-semibold text-sage-dark flex items-center gap-2">
              <AlertTriangle className="text-rose-500" size={20} />
              Report Resource Error
            </h3>
            
            {reportSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle size={44} className="mx-auto text-leaf" />
                <h4 className="font-display font-semibold text-sage-dark">Report Submitted</h4>
                <p className="text-xs text-ink/60">
                  Thank you. Our volunteer administrators will investigate the link or content error.
                </p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="mt-4 space-y-4">
                <p className="text-xs text-ink/65 leading-relaxed">
                  Is the download link broken? Are there content inaccuracies or licensing issues? Please describe the issue below:
                </p>
                <textarea
                  name="reportText"
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Describe the problem in detail..."
                  rows={4}
                  className="w-full rounded-card border border-sage-dark/15 bg-cream/30 p-3 text-xs text-ink outline-none focus:border-sage"
                  required
                />
                <div className="flex justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setIsReportModalOpen(false)}
                    className="rounded-card border border-sage-dark/15 px-4 py-2 text-xs font-semibold text-sage-dark hover:bg-cream"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={reportLoading}
                    className="rounded-card bg-rose-600 text-paper px-4 py-2 text-xs font-semibold shadow hover:bg-rose-700 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {reportLoading ? "Submitting…" : "Submit Report"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

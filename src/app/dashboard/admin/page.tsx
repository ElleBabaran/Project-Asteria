"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp, Resource, BrokenLinkReport, Announcement, PartnerRequest, SupportTicket } from "@/context/AppContext";
import {
  Shield, CheckCircle, XCircle, AlertTriangle, BarChart3, Globe, Users, Megaphone,
  Plus, Trash2, FolderMinus, FolderPlus, Info, FileSignature, Building, Headphones,
  UserCheck, Star, Clock, Wrench, Upload, PlusCircle
} from "lucide-react";
import Link from "next/link";
import { ToastContainer, useToast } from "@/components/Toast";
import NotificationBell from "@/components/NotificationBell";


type AdminTab = "moderation" | "analytics" | "categories" | "reports" | "announcements" | "volunteers" | "partners" | "tickets" | "upload";

// Tabs available per admin sub-role
const ROLE_TABS: Record<string, AdminTab[]> = {
  general: ["moderation", "announcements", "reports", "volunteers", "partners", "analytics", "categories", "upload"],
  tech: ["tickets", "reports", "upload"],
  staff: ["volunteers", "upload"],
};

const ROLE_LABELS: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  general: { label: "General Admin", color: "bg-butter-light text-sage-dark", icon: <Shield size={16} /> },
  tech: { label: "Tech Admin", color: "bg-blush-light text-sage-dark", icon: <Wrench size={16} /> },
  staff: { label: "Staff Admin", color: "bg-leaf-light text-sage-dark", icon: <UserCheck size={16} /> },
};

export default function AdminDashboard() {
  const {
    user,
    login,
    resources,
    heroResourceIds,
    updateHeroResourceIds,
    updateResourceStatus,
    deleteResource,
    brokenReports,
    resolveReport,
    announcements,
    addAnnouncement,
    deleteAnnouncement,
    categories,
    addCategory,
    addResource,
    analytics,
    volunteerApplications,
    approveVolunteerApplication,
    rejectVolunteerApplication,
    partnerRequests,
    updatePartnerRequestStatus,
    supportTickets,
  } = useApp();

  const { toasts, addToast, removeToast } = useToast();

  const adminRole = user?.adminRole ?? "general";
  const allowedTabs = ROLE_TABS[adminRole] ?? ROLE_TABS.general;

  const [activeTab, setActiveTab] = useState<AdminTab>(allowedTabs[0]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab") as AdminTab | null;
      if (tabParam && allowedTabs.includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, [allowedTabs]);

  // Rejection state modal
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  // Categories form states
  const [catType, setCatType] = useState<"country" | "curriculum" | "grade" | "subject">("country");
  const [catValue, setCatValue] = useState("");
  const [catCountryKey, setCatCountryKey] = useState("");

  // Announcement form states
  const [annTitle, setAnnTitle] = useState("");
  const [annContent, setAnnContent] = useState("");
  const [annType, setAnnType] = useState<"info" | "warning" | "success">("info");

  // Upload Resource states
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [customSubject, setCustomSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [fileType, setFileType] = useState<"PDF" | "PPT" | "DOC" | "Image" | "Worksheet">("PDF");
  const [file, setFile] = useState<File | null>(null);
  const [fileSize, setFileSize] = useState("2.5 MB");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const effectiveSubject = subject === "Others" ? customSubject : subject;

  const resetUploadForm = () => {
    setTitle("");
    setCountry("");
    setGrade("");
    setSubject("");
    setCustomSubject("");
    setTopic("");
    setDescription("");
    setFileType("PDF");
    setFile(null);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!title || !country || !grade || !effectiveSubject || !topic || !description || !file) {
      addToast("Please fill in all required fields and select a file.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("description", description);
      formData.append("type", fileType);
      formData.append("country", country);
      formData.append("curriculum", "");
      formData.append("grade", grade);
      formData.append("subject", effectiveSubject);
      formData.append("submitterEmail", user.email);
      formData.append("submitterRole", user.role);

      const res = await fetch("/api/resources", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        addToast("Resource uploaded and approved successfully!", "check");
        resetUploadForm();
        
        // Add directly to context as approved since admin uploaded it
          addResource({
            id: data.resource?.id,
            title, country, curriculum: "", grade, subject: effectiveSubject, topic, description, fileType,
            uploadDate: data.resource?.createdAt
              ? new Date(data.resource.createdAt).toISOString().split("T")[0]
              : undefined,
            fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
            contributorName: user.name,
            fileUrl: data.fileUrl,
            status: data.resource?.status === "PENDING" ? "pending" : data.resource?.status === "REJECTED" ? "rejected" : "approved",
          });
      } else {
        const data = await res.json();
        addToast(`Upload error: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      const objectUrl = URL.createObjectURL(file);
      addResource({
        title, country, curriculum: "", grade, subject: effectiveSubject, topic, description, fileType,
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        contributorName: user.name,
        fileUrl: objectUrl,
      });
      addToast("Saved locally as approved! (Database unavailable.)", "check");
      resetUploadForm();
    } finally {
      setIsSubmitting(false);
    }
  };


  // Fallback if not logged in as Admin
  if (!user || user.role !== "admin") {
    return (
      <main className="bg-cream min-h-screen flex flex-col font-body">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Shield size={48} className="text-sage-dark/30 mb-4" />
          <h2 className="font-display text-2xl font-semibold text-sage-dark">Administrator Dashboard</h2>
          <p className="mt-2 text-sm text-ink/65 max-w-sm">
            This area is restricted to administrators. Please sign in with an admin account or use a simulation below.
          </p>

          {/* 3 Admin Role Simulation Buttons */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3 w-full max-w-xl">
            {[
              {
                role: "general" as const,
                id: "admin-general",
                name: "General Admin",
                email: "general@astera.org",
                label: "General Admin",
                desc: "Moderation, Announcements, Volunteers, Partners",
                icon: <Shield size={20} />,
                color: "bg-butter-light border-butter text-sage-dark",
              },
              {
                role: "tech" as const,
                id: "admin-tech",
                name: "Tech Admin",
                email: "tech@astera.org",
                label: "Tech Admin",
                desc: "Support Tickets, Reported Content",
                icon: <Wrench size={20} />,
                color: "bg-blush-light border-blush text-sage-dark",
              },
              {
                role: "staff" as const,
                id: "admin-staff",
                name: "Staff Admin",
                email: "staff@astera.org",
                label: "Staff Admin",
                desc: "Review & Accept Participants",
                icon: <UserCheck size={20} />,
                color: "bg-leaf-light border-leaf text-sage-dark",
              },
            ].map((item) => (
              <button
                key={item.role}
                onClick={() => {
                  login(item.id, item.name, item.email, "admin", item.role);
                }}
                className={`flex flex-col items-center gap-2 rounded-card border-2 p-5 text-center transition-all hover:-translate-y-1 hover:shadow-lg ${item.color}`}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/60 shadow-sm">
                  {item.icon}
                </span>
                <span className="font-display font-bold text-sm">{item.label}</span>
                <span className="text-[10px] text-ink/65 leading-tight">{item.desc}</span>
              </button>
            ))}
          </div>

          <div className="mt-6">
            <Link href="/login" className="rounded-card border-2 border-sage-dark/15 text-sage-dark px-6 py-2.5 text-xs font-semibold">
              Sign In with Admin Account
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // Moderation filter
  const pendingResources = resources.filter((res) => res.status === "pending");
  const approvedResources = resources.filter((res) => res.status === "approved");

  // Approve handler
  const handleApprove = async (id: string) => {
    try {
      const res = await fetch("/api/resources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "approved" }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Failed to approve resource." }));
        addToast(data.error || "Failed to approve resource.");
        return;
      }

      updateResourceStatus(id, "approved");
      addToast("Resource approved successfully! It is now live.", "check");
    } catch (error) {
      console.error(error);
      addToast("Failed to approve resource in database.");
    }
  };

  // Reject trigger
  const triggerReject = (id: string) => {
    setRejectId(id);
    setRejectReason("");
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectId || !rejectReason.trim()) return;

    try {
      const res = await fetch("/api/resources", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rejectId, status: "rejected" }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: "Failed to reject resource." }));
        addToast(data.error || "Failed to reject resource.");
        return;
      }

      updateResourceStatus(rejectId, "rejected", rejectReason.trim());
      setRejectId(null);
      setRejectReason("");
      addToast("Resource rejected. Feedback sent to contributor.");
    } catch (error) {
      console.error(error);
      addToast("Failed to reject resource in database.");
    }
  };

  const handleHeroSlotChange = (slotIndex: number, resourceId: string) => {
    const nextHeroIds = [heroResourceIds[0] ?? "", heroResourceIds[1] ?? "", heroResourceIds[2] ?? ""];
    nextHeroIds[slotIndex] = resourceId;

    if (resourceId) {
      nextHeroIds.forEach((id, index) => {
        if (index !== slotIndex && id === resourceId) {
          nextHeroIds[index] = "";
        }
      });
    }

    updateHeroResourceIds(nextHeroIds);
    addToast(resourceId ? "Homepage hero cards updated." : "Hero card slot cleared.", "check");
  };

  // Add Category Handler
  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catValue.trim()) return;
    addCategory(catType, catValue.trim(), catType === "curriculum" ? catCountryKey : undefined);
    setCatValue("");
    addToast("Category added successfully!", "check");
  };

  // Post Announcement Handler
  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;
    addAnnouncement(annTitle.trim(), annContent.trim(), annType);
    setAnnTitle("");
    setAnnContent("");
    addToast("Announcement published!", "check");
  };

  // Sort resources for Analytics
  const popularResources = [...approvedResources]
    .sort((a, b) => b.downloadsCount - a.downloadsCount)
    .slice(0, 5);

  const roleInfo = ROLE_LABELS[adminRole];

  // All tab definitions (filtered per role)
  const allTabs = [
    { id: "moderation" as AdminTab, label: "Moderation Queue", count: pendingResources.length },
    { id: "analytics" as AdminTab, label: "Site Analytics", count: null },
    { id: "categories" as AdminTab, label: "Category Manager", count: null },
    { id: "reports" as AdminTab, label: "Error Reports", count: brokenReports.filter((r) => r.status === "open").length },
    { id: "announcements" as AdminTab, label: "Announcements", count: announcements.length },
    { id: "volunteers" as AdminTab, label: "Volunteer Apps", count: volunteerApplications.filter((a) => a.status === "pending").length },
    { id: "partners" as AdminTab, label: "Partner Requests", count: partnerRequests.filter((r) => r.status === "pending").length },
    { id: "tickets" as AdminTab, label: "Support Tickets", count: supportTickets.filter((t) => t.status === "open").length },
    { id: "upload" as AdminTab, label: "Upload Resource", count: null },
  ].filter((tab) => allowedTabs.includes(tab.id));

  return (
    <main className="bg-cream min-h-screen flex flex-col font-body">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Navbar />

      {/* Admin Title Banner */}
      <section className="bg-paper border-b border-sage-dark/10 py-10 px-6 lg:px-10">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-butter-light text-sage-dark">
              <Shield size={28} />
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold text-sage-dark sm:text-3xl">
                Administrator Panel
              </h1>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <p className="text-xs font-mono uppercase tracking-wider text-ink/50">
                  Logged in: {user.name}
                </p>
                <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${roleInfo?.color}`}>
                  {roleInfo?.icon}
                  {roleInfo?.label}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Notification Bell for Admin */}
            <NotificationBell userId={user.id} />

            {/* Quick numbers */}
            <div className="flex flex-wrap gap-4 text-xs font-mono">
              {allowedTabs.includes("moderation") && (
                <span className="bg-sage-dark/5 px-3 py-1.5 rounded border border-sage-dark/10 text-sage-dark font-semibold">
                  Pending Queue: {pendingResources.length}
                </span>
              )}
              {allowedTabs.includes("reports") && (
                <span className="bg-rose-50 px-3 py-1.5 rounded border border-rose-100 text-rose-700 font-semibold">
                  Open Reports: {brokenReports.filter((r) => r.status === "open").length}
                </span>
              )}
              {allowedTabs.includes("tickets") && (
                <span className="bg-blush-light px-3 py-1.5 rounded border border-blush/30 text-sage-dark font-semibold">
                  Open Tickets: {supportTickets.filter((t) => t.status === "open").length}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Admin Tabs */}
      <section className="flex-1 mx-auto max-w-7xl w-full px-6 py-10 lg:px-10">
        <div className="border-b border-sage-dark/10 pb-px mb-8 flex flex-wrap gap-1">
          {allTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "border-sage-dark text-sage-dark bg-paper rounded-t-card"
                  : "border-transparent text-ink/50 hover:text-sage hover:border-sage/40"
              }`}
            >
              {tab.label}
              {tab.count !== null && (
                <span className={`ml-1.5 rounded-full px-2 py-0.5 text-[10px] font-mono ${
                  (tab.id === "reports" || tab.id === "tickets") && tab.count > 0
                    ? "bg-rose-100 text-rose-700 font-bold animate-pulse"
                    : "bg-sage-dark/5 text-ink/60"
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Panel Render */}
        <div className="grid gap-8">

          {/* Moderation Queue */}
          {activeTab === "moderation" && (
            <div className="space-y-6">
              {pendingResources.length === 0 ? (
                <div className="text-center py-16 bg-paper rounded-card border-2 border-dashed border-sage-dark/10 p-6">
                  <CheckCircle size={40} className="mx-auto text-leaf" />
                  <h3 className="mt-4 font-display text-lg font-semibold text-sage-dark">Queue is empty!</h3>
                  <p className="mt-2 text-xs text-ink/60 max-w-xs mx-auto">
                    All volunteer submissions are reviewed. Newly uploaded files will queue up here for moderation.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingResources.map((res) => (
                    <div key={res.id} className="p-6 bg-paper rounded-card border-2 border-sage-dark/8 shadow-card flex flex-col justify-between md:flex-row gap-6">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-sage-dark/5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-sage font-mono">
                            {res.fileType}
                          </span>
                          <span className="text-xs text-ink/40 font-mono">Size: {res.fileSize}</span>
                        </div>

                        <h3 className="font-display text-lg font-bold text-sage-dark leading-snug">{res.title}</h3>
                        <p className="text-xs text-ink/75 leading-relaxed">{res.description}</p>

                        <div className="flex flex-wrap items-center gap-2 font-mono text-[9px] uppercase tracking-wider text-ink/50 bg-cream/30 p-2 rounded w-fit">
                          <strong className="text-sage-dark">Path:</strong>
                          <span>{res.country}</span> &bull;
                          <span>{res.grade}</span> &bull;
                          <span>{res.subject}</span> &bull;
                          <span>{res.topic}</span>
                        </div>

                        <div className="text-xs text-ink/50 pt-2 border-t border-sage-dark/5">
                          Uploaded by: <strong className="font-medium text-ink capitalize">{res.contributorName}</strong> &bull; Date: {res.uploadDate}
                        </div>
                      </div>

                      {/* Moderation Controls */}
                      <div className="flex flex-col gap-2 justify-center shrink-0 min-w-[140px]">
                        <button
                          onClick={() => handleApprove(res.id)}
                          className="flex items-center justify-center gap-1.5 rounded-card bg-leaf-light px-4 py-2 text-xs font-semibold text-sage-dark transition-colors hover:bg-leaf"
                        >
                          <CheckCircle size={13} />
                          <span>Approve &amp; Publish</span>
                        </button>
                        <button
                          onClick={() => triggerReject(res.id)}
                          className="flex items-center justify-center gap-1.5 rounded-card border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                        >
                          <XCircle size={13} />
                          <span>Reject / Feedback</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Rejection Form Modal */}
              {rejectId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 backdrop-blur-sm p-4">
                  <div className="w-full max-w-md bg-paper rounded-card border-2 border-sage-dark/15 p-6 shadow-2xl">
                    <h3 className="font-display text-lg font-semibold text-sage-dark flex items-center gap-2 mb-2">
                      <AlertTriangle className="text-rose-500" size={18} />
                      Send Rejection Feedback
                    </h3>
                    <form onSubmit={handleRejectSubmit} className="space-y-4">
                      <p className="text-xs text-ink/65 leading-relaxed">
                        Provide instructions on what the volunteer needs to fix in order to get their notes approved.
                      </p>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Explain changes requested (e.g. Title is too short, please specify class details)..."
                        rows={4}
                        className="w-full rounded-card border border-sage-dark/15 bg-cream/30 p-3 text-xs text-ink outline-none focus:border-sage"
                        required
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setRejectId(null)}
                          className="rounded-card border border-sage-dark/15 px-4 py-2 text-xs font-semibold text-sage-dark hover:bg-cream"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="rounded-card bg-rose-600 text-paper px-4 py-2 text-xs font-semibold shadow hover:bg-rose-700"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Analytics Sub-Dashboard */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="bg-paper p-5 rounded-card border border-sage-dark/8 shadow-card flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-card bg-leaf-light text-sage-dark shrink-0">
                    <Users size={22} />
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-ink/50 block">Active Students Helped</span>
                    <strong className="text-2xl font-bold text-sage-dark">{analytics.activeStudents + 122}</strong>
                  </div>
                </div>

                <div className="bg-paper p-5 rounded-card border border-sage-dark/8 shadow-card flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-card bg-butter-light text-sage-dark shrink-0">
                    <Globe size={22} />
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-ink/50 block">Live Visitors Today</span>
                    <strong className="text-2xl font-bold text-sage-dark">{analytics.visitorsCount}</strong>
                  </div>
                </div>

                <div className="bg-paper p-5 rounded-card border border-sage-dark/8 shadow-card flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-card bg-blush-light text-sage-dark shrink-0">
                    <Shield size={22} />
                  </span>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-ink/50 block">Registered Volunteers</span>
                    <strong className="text-2xl font-bold text-sage-dark">{analytics.activeVolunteers}</strong>
                  </div>
                </div>
              </div>

              <div className="bg-paper p-6 rounded-card border border-sage-dark/10 shadow-card">
                <div className="flex flex-col gap-1 border-b border-sage-dark/8 pb-3 mb-4">
                  <h3 className="font-display font-semibold text-sage-dark flex items-center gap-2">
                    <Star size={16} />
                    Homepage Hero Cards
                  </h3>
                  <p className="text-xs text-ink/55">
                    Choose exactly which approved resources appear in the three homepage card slots.
                  </p>
                </div>

                {approvedResources.length === 0 ? (
                  <p className="text-xs text-ink/50 italic">
                    No approved resources are available yet. Approve a resource first, then return here to feature it.
                  </p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-3">
                    {[0, 1, 2].map((slot) => {
                      const selectedId = heroResourceIds[slot] ?? "";
                      const selectedResource = approvedResources.find((res) => res.id === selectedId);

                      return (
                        <div key={slot} className="rounded-card border border-sage-dark/10 bg-cream/25 p-4">
                          <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-sage">
                            Hero Slot {slot + 1}
                          </label>
                          <select
                            value={selectedId}
                            onChange={(e) => handleHeroSlotChange(slot, e.target.value)}
                            className="mt-2 w-full rounded-card border border-sage-dark/10 bg-paper px-3 py-2 text-xs text-ink outline-none focus:border-sage"
                          >
                            <option value="">Auto-fill from approved resources</option>
                            {approvedResources.map((res) => (
                              <option
                                key={res.id}
                                value={res.id}
                                disabled={heroResourceIds.includes(res.id) && selectedId !== res.id}
                              >
                                {res.title} - {res.subject} / {res.grade}
                              </option>
                            ))}
                          </select>

                          <div className="mt-3 min-h-[52px] rounded-card bg-paper/70 p-3 text-xs">
                            {selectedResource ? (
                              <>
                                <p className="font-semibold text-sage-dark line-clamp-1">{selectedResource.title}</p>
                                <p className="mt-1 font-mono text-[10px] text-ink/45">
                                  {selectedResource.country} &bull; {selectedResource.fileType}
                                </p>
                              </>
                            ) : (
                              <p className="text-ink/45 italic">This slot will use the next approved resource automatically.</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="bg-paper p-6 rounded-card border border-sage-dark/10 shadow-card">
                  <h3 className="font-display font-semibold text-sage-dark border-b border-sage-dark/8 pb-3 mb-4 flex items-center gap-2">
                    <BarChart3 size={16} />
                    Most Downloaded Resources
                  </h3>
                  <div className="divide-y divide-sage-dark/5">
                    {popularResources.map((res, i) => (
                      <div key={res.id} className="py-2.5 flex items-center justify-between text-xs">
                        <span className="font-semibold text-ink/40 w-5">{i + 1}</span>
                        <div className="flex-1 truncate">
                          <Link href={`/resources/${res.id}`} className="font-semibold text-sage-dark hover:text-sage truncate block">
                            {res.title}
                          </Link>
                          <span className="text-[10px] text-ink/40 font-mono mt-0.5 block">{res.subject} &middot; {res.grade} &middot; {res.country}</span>
                        </div>
                        <span className="font-mono font-bold text-sage-dark shrink-0 pl-4">{res.downloadsCount} dl</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-paper p-6 rounded-card border border-sage-dark/10 shadow-card">
                  <h3 className="font-display font-semibold text-sage-dark border-b border-sage-dark/8 pb-3 mb-4 flex items-center gap-2">
                    <Globe size={16} />
                    Active Countries Distribution
                  </h3>
                  <div className="space-y-4">
                    {[
                      { country: "India", percentage: 48, students: "43k+", color: "bg-leaf" },
                      { country: "United States", percentage: 24, students: "21k+", color: "bg-blush" },
                      { country: "United Kingdom", percentage: 14, students: "12k+", color: "bg-butter" },
                      { country: "Philippines", percentage: 8, students: "7.2k", color: "bg-sage" },
                      { country: "Australia", percentage: 4, students: "3.6k", color: "bg-leaf-light" },
                      { country: "Canada", percentage: 2, students: "1.8k", color: "bg-blush-light" }
                    ].map((dem) => (
                      <div key={dem.country} className="text-xs space-y-1">
                        <div className="flex justify-between items-center text-[11px]">
                          <strong className="text-sage-dark">{dem.country}</strong>
                          <span className="font-mono text-ink/50">{dem.students} students ({dem.percentage}%)</span>
                        </div>
                        <div className="w-full bg-cream h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${dem.color}`} style={{ width: `${dem.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Category Manager */}
          {activeTab === "categories" && (
            <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
              <div className="bg-paper p-6 rounded-card border border-sage-dark/10 shadow-card h-fit">
                <h3 className="font-display font-semibold text-sage-dark border-b border-sage-dark/8 pb-3 mb-4 flex items-center gap-1.5">
                  <FolderPlus size={16} />
                  Add New Category
                </h3>

                <form onSubmit={handleAddCategorySubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-sage-dark">Category Type</label>
                    <select
                      value={catType}
                      onChange={(e) => setCatType(e.target.value as any)}
                      className="w-full rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2 text-xs text-ink outline-none focus:border-sage"
                    >
                      <option value="country">Country</option>
                      <option value="grade">Grade / Class</option>
                      <option value="subject">Subject</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-sage-dark">Category Label / Name</label>
                    <input
                      type="text"
                      value={catValue}
                      onChange={(e) => setCatValue(e.target.value)}
                      placeholder="e.g. Biology, Singapore, Class 12..."
                      className="w-full rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2 text-xs text-ink outline-none focus:border-sage"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 rounded-card bg-sage-dark text-paper py-3.5 font-semibold text-xs shadow hover:bg-sage transition-all"
                  >
                    <Plus size={14} />
                    <span>Create Category</span>
                  </button>
                </form>
              </div>

              <div className="bg-paper p-6 rounded-card border border-sage-dark/10 shadow-card">
                <h3 className="font-display font-semibold text-sage-dark border-b border-sage-dark/8 pb-3 mb-4 flex items-center gap-1.5">
                  <FolderMinus size={16} />
                  Active Library Taxonomy
                </h3>

                <div className="space-y-6">
                  <div>
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-sage block mb-2">Available Countries</span>
                    <div className="flex flex-wrap gap-1 bg-cream/15 p-3 border border-sage-dark/5 rounded-card">
                      {categories.countries.map((country) => (
                        <span key={country} className="bg-paper px-2.5 py-1 rounded text-xs text-sage-dark font-medium border border-sage/10">{country}</span>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 border-t border-sage-dark/8 pt-4">
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-sage block mb-2">Grades / Classes</span>
                      <div className="flex flex-wrap gap-1">
                        {categories.grades.map((grade) => (
                          <span key={grade} className="bg-cream/40 px-2.5 py-1 rounded text-xs text-sage-dark font-medium border border-sage/10">{grade}</span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-sage block mb-2">Subjects</span>
                      <div className="flex flex-wrap gap-1">
                        {categories.subjects.map((subj) => (
                          <span key={subj} className="bg-cream/40 px-2.5 py-1 rounded text-xs text-sage-dark font-medium border border-sage/10">{subj}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Broken Links Error Reports */}
          {activeTab === "reports" && (
            <div className="space-y-4">
              {brokenReports.length === 0 ? (
                <div className="text-center py-16 bg-paper rounded-card border-2 border-dashed border-sage-dark/10 p-6">
                  <CheckCircle size={40} className="mx-auto text-leaf" />
                  <h3 className="mt-4 font-display text-lg font-semibold text-sage-dark">No error reports</h3>
                  <p className="mt-2 text-xs text-ink/60 max-w-xs mx-auto">
                    Students will flag link errors or content typos from file details pages. Open tickets appear here.
                  </p>
                </div>
              ) : (
                <div className="bg-paper rounded-card border border-sage-dark/10 overflow-hidden shadow-card">
                  <div className="divide-y divide-sage-dark/8">
                    {brokenReports.map((report) => {
                      const isOpen = report.status === "open";
                      return (
                        <div key={report.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                          <div className="flex items-start gap-3">
                            <span className={`mt-1 flex h-7 w-7 items-center justify-center rounded shrink-0 ${
                              isOpen ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-leaf-light/20 text-leaf"
                            }`}>
                              <AlertTriangle size={15} />
                            </span>
                            <div>
                              <div className="flex items-center gap-2">
                                <Link href={`/resources/${report.resourceId}`} className="font-semibold text-sage-dark hover:text-sage text-sm sm:text-base">
                                  {report.resourceTitle}
                                </Link>
                                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                                  isOpen ? "bg-rose-100 text-rose-700" : "bg-leaf/10 text-leaf"
                                }`}>
                                  {report.status.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-xs text-ink/75 mt-1 bg-cream/35 p-2 rounded border">
                                <strong>Issue:</strong> &ldquo;{report.description}&rdquo;
                              </p>
                              <span className="text-[10px] text-ink/40 font-mono mt-2 block">
                                Reported by: {report.userEmail} &bull; Date: {report.date}
                              </span>
                            </div>
                          </div>

                          {isOpen && (
                            <button
                              onClick={() => {
                                resolveReport(report.id);
                                addToast("Issue resolved! Status marked as resolved.", "check");
                              }}
                              className="rounded-card bg-leaf-light px-3.5 py-1.5 text-xs font-semibold text-sage-dark transition-colors hover:bg-leaf shrink-0"
                            >
                              Mark Resolved
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Announcements Manager */}
          {activeTab === "announcements" && (
            <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
              <div className="bg-paper p-6 rounded-card border border-sage-dark/10 shadow-card h-fit">
                <h3 className="font-display font-semibold text-sage-dark border-b border-sage-dark/8 pb-3 mb-4 flex items-center gap-1.5">
                  <Megaphone size={16} />
                  Publish Banner Announcement
                </h3>

                <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-sage-dark">Alert Title</label>
                    <input
                      type="text"
                      value={annTitle}
                      onChange={(e) => setAnnTitle(e.target.value)}
                      placeholder="e.g. Maintenance Notice, Math Volunteer Hunt..."
                      className="w-full rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2 text-xs text-ink outline-none focus:border-sage"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-sage-dark">Banner Type Color</label>
                    <select
                      value={annType}
                      onChange={(e) => setAnnType(e.target.value as any)}
                      className="w-full rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2 text-xs text-ink outline-none focus:border-sage"
                    >
                      <option value="info">Info (Blush / Purple)</option>
                      <option value="success">Success (Leaf / Green)</option>
                      <option value="warning">Warning (Butter / Yellow)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-sage-dark">Alert Details</label>
                    <textarea
                      value={annContent}
                      onChange={(e) => setAnnContent(e.target.value)}
                      placeholder="Write the short message description to display to library users..."
                      rows={3}
                      className="w-full rounded-card border border-sage-dark/10 bg-cream/35 p-3 text-xs text-ink outline-none focus:border-sage"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-1.5 rounded-card bg-sage-dark text-paper py-3.5 font-semibold text-xs shadow hover:bg-sage transition-all"
                  >
                    <span>Publish Announcement</span>
                  </button>
                </form>
              </div>

              <div className="bg-paper p-6 rounded-card border border-sage-dark/10 shadow-card">
                <h3 className="font-display font-semibold text-sage-dark border-b border-sage-dark/8 pb-3 mb-4">
                  Active Banners List
                </h3>

                {announcements.length === 0 ? (
                  <p className="text-xs text-ink/50 italic text-center py-6">No announcements published yet.</p>
                ) : (
                  <div className="space-y-4">
                    {announcements.map((ann) => {
                      const badgeStyles =
                        ann.type === "success"
                          ? "bg-leaf-light text-sage-dark"
                          : ann.type === "warning"
                          ? "bg-butter-light text-sage-dark"
                          : "bg-blush-light text-sage-dark";

                      return (
                        <div key={ann.id} className="p-4 rounded-card bg-cream/15 border border-sage-dark/5 flex justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sage-dark text-sm">{ann.title}</h4>
                              <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${badgeStyles} uppercase tracking-wider`}>
                                {ann.type}
                              </span>
                            </div>
                            <p className="text-xs text-ink/70">{ann.content}</p>
                            <span className="text-[10px] text-ink/40 font-mono block mt-1">Published on: {ann.date}</span>
                          </div>

                          <button
                            onClick={() => {
                              deleteAnnouncement(ann.id);
                              addToast("Announcement deleted!", "check");
                            }}
                            className="text-rose-600 hover:text-rose-800 self-center"
                            title="Remove Announcement"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Volunteer Applications */}
          {activeTab === "volunteers" && (
            <div className="space-y-6">
              {volunteerApplications.length === 0 ? (
                <div className="text-center py-16 bg-paper rounded-card border-2 border-dashed border-sage-dark/10 p-6">
                  <FileSignature size={40} className="mx-auto text-sage/40" />
                  <h3 className="mt-4 font-display text-lg font-semibold text-sage-dark">No Applications Yet</h3>
                  <p className="mt-2 text-xs text-ink/60 max-w-xs mx-auto">
                    When users apply to become volunteers, their applications will appear here for review.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {volunteerApplications.map((app) => (
                    <div key={app.id} className="p-5 bg-paper rounded-card border border-sage-dark/10 shadow-card flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-display font-bold text-sage-dark text-lg">{app.name}</h3>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            app.status === "pending" ? "bg-butter-light text-sage-dark" :
                            app.status === "approved" ? "bg-leaf-light text-sage-dark" :
                            "bg-rose-100 text-rose-700"
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="text-xs text-ink/60 font-mono">
                          {app.email} &bull; Applied: {app.date}
                        </div>
                        <div className="flex gap-2 flex-wrap text-[11px] mt-1">
                          <span className="bg-cream px-2 py-1 rounded text-sage-dark font-medium border border-sage-dark/5">
                            Background: {app.background}
                          </span>
                          <span className="bg-cream px-2 py-1 rounded text-sage-dark font-medium border border-sage-dark/5">
                            Subject: {app.subject}
                          </span>
                        </div>
                        <p className="text-xs text-ink/75 bg-cream/30 p-3 rounded-card border border-sage-dark/5 mt-2 italic">
                          &ldquo;{app.message}&rdquo;
                        </p>
                        {app.status === "rejected" && app.rejectionNote && (
                          <div className="mt-2 text-xs text-rose-700 bg-rose-50 p-2 rounded border border-rose-100 flex gap-2 items-start">
                            <Info size={14} className="shrink-0 mt-0.5" />
                            <span><strong>Rejection Note:</strong> {app.rejectionNote}</span>
                          </div>
                        )}
                      </div>

                      {app.status === "pending" && (
                        <div className="flex flex-col gap-2 shrink-0">
                          <button
                            onClick={() => {
                              approveVolunteerApplication(app.id);
                              addToast(`Approved volunteer application for ${app.name}`, "check");
                            }}
                            className="flex items-center justify-center gap-1.5 rounded-card bg-leaf-light px-4 py-2 text-xs font-semibold text-sage-dark transition-colors hover:bg-leaf"
                          >
                            <CheckCircle size={14} />
                            Approve Access
                          </button>
                          <button
                            onClick={() => {
                              const note = window.prompt("Rejection reason (sent to user):");
                              if (note !== null) {
                                rejectVolunteerApplication(app.id, note);
                                addToast(`Rejected application for ${app.name}`);
                              }
                            }}
                            className="flex items-center justify-center gap-1.5 rounded-card border border-rose-200 px-4 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Partner Requests Tab — General Admin only */}
          {activeTab === "partners" && (
            <div className="space-y-4">
              {partnerRequests.length === 0 ? (
                <div className="text-center py-16 bg-paper rounded-card border-2 border-dashed border-sage-dark/10 p-6">
                  <Building size={40} className="mx-auto text-sage/40" />
                  <h3 className="mt-4 font-display text-lg font-semibold text-sage-dark">No Partnership Requests</h3>
                  <p className="mt-2 text-xs text-ink/60 max-w-xs mx-auto">
                    When organizations submit a partnership inquiry via the Partner page, their requests appear here.
                  </p>
                  <Link
                    href="/partner"
                    className="mt-6 inline-flex items-center gap-1.5 rounded-card bg-sage-dark px-4 py-2 text-xs font-semibold text-paper"
                  >
                    View Partner Page
                  </Link>
                </div>
              ) : (
                <div className="bg-paper rounded-card border border-sage-dark/10 overflow-hidden shadow-card">
                  <div className="divide-y divide-sage-dark/8">
                    {partnerRequests.map((req) => (
                      <div key={req.id} className="p-5 flex flex-col md:flex-row gap-4 justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-display font-bold text-sage-dark">{req.orgName}</h3>
                            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              req.status === "pending" ? "bg-butter-light text-sage-dark" :
                              req.status === "accepted" ? "bg-leaf-light text-sage-dark" :
                              req.status === "reviewed" ? "bg-blush-light text-sage-dark" :
                              "bg-rose-100 text-rose-700"
                            }`}>
                              {req.status}
                            </span>
                          </div>
                          <div className="text-xs text-ink/60 font-mono">
                            Contact: {req.contactName} &bull; {req.email} &bull; Type: {req.type}
                          </div>
                          <p className="text-xs text-ink/75 bg-cream/30 p-3 rounded-card border border-sage-dark/5 italic">
                            &ldquo;{req.details}&rdquo;
                          </p>
                          <span className="text-[10px] text-ink/40 font-mono">Submitted: {req.date}</span>
                        </div>

                        {req.status === "pending" && (
                          <div className="flex flex-col gap-2 shrink-0">
                            <button
                              onClick={() => {
                                updatePartnerRequestStatus(req.id, "accepted");
                                addToast(`Accepted partnership request from ${req.orgName}`, "check");
                              }}
                              className="flex items-center justify-center gap-1.5 rounded-card bg-leaf-light px-4 py-2 text-xs font-semibold text-sage-dark transition-colors hover:bg-leaf"
                            >
                              <CheckCircle size={14} />
                              Accept
                            </button>
                            <button
                              onClick={() => {
                                updatePartnerRequestStatus(req.id, "reviewed");
                                addToast(`Marked as reviewed: ${req.orgName}`);
                              }}
                              className="flex items-center justify-center gap-1.5 rounded-card border border-sage-dark/15 px-4 py-2 text-xs font-semibold text-sage-dark transition-colors hover:bg-cream"
                            >
                              Mark Reviewed
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Support Tickets Tab — Tech Admin only */}
          {activeTab === "tickets" && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3 mb-6">
                {[
                  { label: "Open Tickets", count: supportTickets.filter(t => t.status === "open").length, color: "bg-rose-50 border-rose-100 text-rose-700" },
                  { label: "In Progress", count: supportTickets.filter(t => t.status === "in_progress").length, color: "bg-butter-light border-butter/30 text-sage-dark" },
                  { label: "Resolved", count: supportTickets.filter(t => t.status === "resolved").length, color: "bg-leaf-light border-leaf/30 text-sage-dark" },
                ].map(stat => (
                  <div key={stat.label} className={`p-4 rounded-card border ${stat.color} text-center`}>
                    <span className="text-2xl font-bold font-display block">{stat.count}</span>
                    <span className="text-xs font-mono uppercase tracking-wider">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="bg-paper rounded-card border border-sage-dark/10 overflow-hidden shadow-card">
                <div className="divide-y divide-sage-dark/8">
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className="p-5 flex flex-col sm:flex-row gap-4 justify-between items-start">
                      <div className="flex items-start gap-3 flex-1">
                        <span className={`mt-1 flex h-7 w-7 items-center justify-center rounded shrink-0 ${
                          ticket.status === "open" ? "bg-rose-50 text-rose-600 border border-rose-100" :
                          ticket.status === "in_progress" ? "bg-butter-light text-sage-dark" :
                          "bg-leaf-light/20 text-leaf"
                        }`}>
                          <Headphones size={14} />
                        </span>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-sage-dark text-sm">{ticket.subject}</h4>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                              ticket.priority === "high" ? "bg-rose-100 text-rose-700" :
                              ticket.priority === "medium" ? "bg-butter-light text-sage-dark" :
                              "bg-sage-dark/5 text-ink/50"
                            }`}>
                              {ticket.priority.toUpperCase()} PRIORITY
                            </span>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                              ticket.status === "open" ? "bg-rose-100 text-rose-700" :
                              ticket.status === "in_progress" ? "bg-butter-light text-sage-dark" :
                              "bg-leaf/10 text-leaf"
                            }`}>
                              {ticket.status.replace("_", " ").toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-ink/75 bg-cream/35 p-2 rounded border">
                            {ticket.description}
                          </p>
                          <span className="text-[10px] text-ink/40 font-mono block">
                            From: {ticket.userEmail} &bull; {ticket.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Upload Resource Tab */}
          {activeTab === "upload" && (
            <div className="space-y-6">
              <div className="bg-paper rounded-card border-2 border-sage-dark/8 p-6 sm:p-8 shadow-card max-w-2xl mx-auto">
                <div className="flex items-center gap-2 border-b border-sage-dark/10 pb-4 mb-6">
                  <PlusCircle className="text-sage" size={20} />
                  <h3 className="font-display font-semibold text-sage-dark">Upload & Approve New Resource</h3>
                </div>

                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-sage-dark">Resource Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Cell Division & Mitosis Guide"
                      className="w-full rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2 text-xs text-ink outline-none focus:border-sage"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-sage-dark">Country *</label>
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2 text-xs text-ink outline-none focus:border-sage"
                        required
                      >
                        <option value="">Select Country</option>
                        {categories.countries.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-sage-dark">Grade / Class *</label>
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2 text-xs text-ink outline-none focus:border-sage"
                        required
                      >
                        <option value="">Select Grade</option>
                        {categories.grades.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-sage-dark">Subject *</label>
                      <select
                        value={subject}
                        onChange={(e) => { setSubject(e.target.value); if (e.target.value !== "Others") setCustomSubject(""); }}
                        className="w-full rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2 text-xs text-ink outline-none focus:border-sage"
                        required
                      >
                        <option value="">Select Subject</option>
                        {categories.subjects.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {subject === "Others" && (
                        <input
                          type="text"
                          value={customSubject}
                          onChange={(e) => setCustomSubject(e.target.value)}
                          placeholder="Type your subject here..."
                          className="mt-2 w-full rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2 text-xs text-ink outline-none focus:border-sage"
                          required
                        />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-sage-dark">Chapter / Topic *</label>
                      <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. Mitosis"
                        className="w-full rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2 text-xs text-ink outline-none focus:border-sage"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-sage-dark">File Type *</label>
                      <select
                        value={fileType}
                        onChange={(e) => setFileType(e.target.value as any)}
                        className="w-full rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2 text-xs text-ink outline-none focus:border-sage"
                        required
                      >
                        <option value="PDF">PDF Document</option>
                        <option value="PPT">Presentation Slides</option>
                        <option value="DOC">Word Document</option>
                        <option value="Image">Diagram / Image Pack</option>
                        <option value="Worksheet">Worksheet Form</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-sage-dark">Material Description *</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Detail the contents of the study guides or notes..."
                      rows={4}
                      className="w-full rounded-card border border-sage-dark/10 bg-cream/35 p-3 text-xs text-ink outline-none focus:border-sage"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-sage-dark">Resource File *</label>
                    <div className="mt-1 flex justify-center rounded-card border-2 border-dashed border-sage-dark/25 px-6 py-6 transition-all hover:bg-sage-dark/5 bg-cream/20">
                      <div className="space-y-1.5 text-center">
                        {file ? (
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-sage-dark block">{file.name}</span>
                            <span className="text-[10px] text-ink/50 block font-mono">
                              {(file.size / (1024 * 1024)).toFixed(2)} MB &bull; {file.type || "Unknown type"}
                            </span>
                            <span className="text-[10px] text-leaf font-semibold">✓ File ready to upload</span>
                            <button
                              type="button"
                              onClick={() => setFile(null)}
                              className="text-[10px] text-rose-500 font-semibold hover:underline block mx-auto mt-2"
                            >
                              Remove file
                            </button>
                          </div>
                        ) : (
                          <>
                            <Upload size={24} className="mx-auto text-sage" />
                            <div className="flex text-xs text-ink/70 justify-center">
                              <label className="relative cursor-pointer rounded bg-transparent font-semibold text-sage-dark hover:text-sage focus-within:outline-none">
                                <span>Choose a file</span>
                                <input
                                  type="file"
                                  className="sr-only"
                                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                                  required
                                />
                              </label>
                              <p className="pl-1">to upload</p>
                            </div>
                            <p className="text-[10px] text-ink/40">PDF, PPT, DOC, PNG, JPG up to 10MB</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-1.5 rounded-card bg-sage-dark text-paper py-3 font-semibold text-xs shadow hover:bg-sage transition-all mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Uploading & Approving..." : "Upload & Approve Material"}
                  </button>
                </form>
              </div>
            </div>
          )}

        </div>
      </section>

      <Footer />
    </main>
  );
}

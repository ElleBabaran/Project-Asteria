"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp, Resource } from "@/context/AppContext";
import { Upload, LayoutDashboard, Clock, FileText, CheckCircle, AlertCircle, Edit, Trash, PlusCircle, Star, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function VolunteerDashboard() {
  const { user, resources, addResource, editResource, deleteResource, categories, login } = useApp();

  // Selected resource for editing
  const [editingResId, setEditingResId] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [country, setCountry] = useState("");
  const [curriculum, setCurriculum] = useState("");
  const [grade, setGrade] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [fileType, setFileType] = useState<"PDF" | "PPT" | "DOC" | "Image" | "Worksheet">("PDF");
  const [fileSize, setFileSize] = useState("2.5 MB");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fallback if not logged in as Volunteer
  if (!user || user.role !== "volunteer") {
    return (
      <main className="bg-cream min-h-screen flex flex-col font-body">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <LayoutDashboard size={48} className="text-sage-dark/60 mb-4 animate-bounce" />
          <h2 className="font-display text-2xl font-semibold text-sage-dark">Volunteer Dashboard</h2>
          <p className="mt-2 text-sm text-ink/65 max-w-sm">
            To access this dashboard, please log in as a Volunteer or switch to the volunteer role using the Sandbox controller below.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => login("chloe@astera.org", "volunteer")}
              className="rounded-card bg-sage-dark text-paper px-6 py-2.5 text-xs font-semibold shadow"
            >
              Simulate Volunteer Login
            </button>
            <Link href="/login" className="rounded-card border-2 border-sage-dark/15 px-6 py-2.5 text-xs font-semibold text-sage-dark">
              Go to Login Page
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  // Filter resources uploaded by this volunteer
  const myUploads = resources.filter(
    (res) => res.contributorName.toLowerCase() === user.name.toLowerCase()
  );

  // Stats calculation
  const totalDownloads = myUploads.reduce((sum, res) => sum + res.downloadsCount, 0);
  const totalLikes = myUploads.reduce((sum, res) => sum + res.likes, 0);
  const totalApproved = myUploads.filter((res) => res.status === "approved").length;

  // Gather comments left on my resources
  const myFeedback: { resourceTitle: string; user: string; text: string; rating?: number; date: string }[] = [];
  myUploads.forEach((res) => {
    res.comments.forEach((c) => {
      myFeedback.push({
        resourceTitle: res.title,
        user: c.user,
        text: c.text,
        rating: c.rating,
        date: c.date,
      });
    });
  });

  const resetForm = () => {
    setTitle("");
    setCountry("");
    setCurriculum("");
    setGrade("");
    setSubject("");
    setTopic("");
    setDescription("");
    setFileType("PDF");
    setFile(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !country || !curriculum || !grade || !subject || !topic || !description || (!file && !editingResId)) {
      alert("Please fill in all required fields and select a file.");
      return;
    }

    setIsSubmitting(true);

    if (editingResId) {
      // Edit resource (Local state fallback since editing DB isn't built yet)
      editResource(editingResId, {
        title,
        country,
        curriculum,
        grade,
        subject,
        topic,
        description,
        fileType,
        fileSize: file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : fileSize,
      });
      alert("Resource updated successfully! Resubmitted for Admin review.");
      setEditingResId(null);
      resetForm();
      setIsSubmitting(false);
    } else {
      // REAL DB SUBMISSION
      try {
        const formData = new FormData();
        if (file) formData.append("file", file);
        formData.append("title", title);
        formData.append("description", description);
        formData.append("type", fileType);
        formData.append("country", country);
        formData.append("curriculum", curriculum);
        formData.append("grade", grade);
        formData.append("subject", subject);
        formData.append("submitterEmail", user.email);

        const res = await fetch("/api/resources", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          alert("Resource uploaded successfully! Saved to Database.");
          resetForm();
          
          // Also add to local UI state so it shows up instantly without full page refresh
          addResource({
            title, country, curriculum, grade, subject, topic, description, fileType,
            fileSize: file ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : fileSize,
            contributorName: user.name,
          });
        } else {
          const data = await res.json();
          alert(`Error: ${data.error}`);
        }
      } catch (error) {
        console.error(error);
        alert("Failed to upload resource.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleEditClick = (res: Resource) => {
    setEditingResId(res.id);
    setTitle(res.title);
    setCountry(res.country);
    setCurriculum(res.curriculum);
    setGrade(res.grade);
    setSubject(res.subject);
    setTopic(res.topic);
    setDescription(res.description);
    setFileType(res.fileType);
    setFileSize(res.fileSize);
  };

  const handleDeleteClick = (id: string) => {
    if (confirm("Are you sure you want to delete this resource?")) {
      deleteResource(id);
      alert("Resource deleted successfully.");
    }
  };

  const cancelEdit = () => {
    setEditingResId(null);
    resetForm();
  };

  const availableCurricula = country ? categories.curricula[country] || [] : [];

  return (
    <main className="bg-cream min-h-screen flex flex-col font-body">
      <Navbar />

      {/* Hero Banner */}
      <section className="bg-paper border-b border-sage-dark/10 py-10 px-6 lg:px-10">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-leaf-light text-sage-dark">
              <Upload size={28} />
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold text-sage-dark sm:text-3xl">
                Volunteer Dashboard
              </h1>
              <p className="mt-1 text-xs font-mono uppercase tracking-wider text-ink/50">
                Welcome back, contributor {user.name}!
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-6 bg-cream/50 p-4 rounded-card border border-sage-dark/10 text-center">
            <div>
              <span className="block text-xl font-bold text-sage-dark">{myUploads.length}</span>
              <span className="text-[10px] text-ink/50 uppercase font-mono">Uploads</span>
            </div>
            <div className="border-x border-sage-dark/10 px-6">
              <span className="block text-xl font-bold text-sage-dark">{totalDownloads}</span>
              <span className="text-[10px] text-ink/50 uppercase font-mono">Downloads</span>
            </div>
            <div>
              <span className="block text-xl font-bold text-sage-dark">{totalLikes}</span>
              <span className="text-[10px] text-ink/50 uppercase font-mono">Likes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="flex-1 mx-auto max-w-7xl w-full px-6 py-10 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1.8fr]">
          
          {/* Left: Submission Form */}
          <div className="bg-paper rounded-card border-2 border-sage-dark/8 p-6 shadow-card h-fit">
            <div className="flex items-center gap-2 border-b border-sage-dark/10 pb-4 mb-6">
              {editingResId ? (
                <>
                  <Edit className="text-sage" size={20} />
                  <h3 className="font-display font-semibold text-sage-dark">Edit Resource Submission</h3>
                </>
              ) : (
                <>
                  <PlusCircle className="text-sage" size={20} />
                  <h3 className="font-display font-semibold text-sage-dark">Submit New Resource</h3>
                </>
              )}
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
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
                  <label className="text-xs font-semibold text-sage-dark">Curriculum *</label>
                  <select
                    value={curriculum}
                    onChange={(e) => setCurriculum(e.target.value)}
                    disabled={!country}
                    className="w-full rounded-card border border-sage-dark/10 bg-cream/35 px-3 py-2 text-xs text-ink outline-none focus:border-sage disabled:opacity-50"
                    required
                  >
                    <option value="">Select Curriculum</option>
                    {availableCurricula.map((curr) => (
                      <option key={curr} value={curr}>
                        {curr}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-sage-dark">Subject *</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
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
                <div className="border border-dashed border-sage-dark/25 rounded-card p-4 bg-cream/10 text-center relative hover:bg-cream/30 transition-colors">
                  <input 
                    type="file" 
                    onChange={(e) => e.target.files && setFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required={!editingResId}
                  />
                  <Upload size={24} className="mx-auto text-sage mb-2" />
                  {file ? (
                    <span className="text-[11px] text-sage-dark font-medium block">
                      Selected: <strong>{file.name}</strong> ({(file.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  ) : (
                    <span className="text-[11px] text-ink/60 font-mono block">
                      Click or drag and drop to upload your file
                    </span>
                  )}
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 rounded-card bg-sage-dark text-paper py-3 font-semibold text-xs shadow hover:bg-sage transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Uploading to Database..." : (editingResId ? "Save Changes & Submit" : "Submit Material for Approval")}
                </button>
                {editingResId && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="rounded-card border border-sage-dark/15 px-4 text-xs font-semibold text-sage-dark hover:bg-cream"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right: Submissions Log & Feedback Feed */}
          <div className="space-y-6">
            
            {/* My Submissions */}
            <div className="bg-paper rounded-card border border-sage-dark/10 p-5 shadow-card">
              <h3 className="font-display font-semibold text-sage-dark border-b border-sage-dark/8 pb-3 mb-4 flex items-center gap-2">
                <FileText size={18} />
                My Submissions log
              </h3>

              {myUploads.length === 0 ? (
                <p className="text-xs text-ink/50 italic text-center py-6">You haven&apos;t uploaded any resources yet.</p>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {myUploads.map((res) => {
                    const isPending = res.status === "pending";
                    const isApproved = res.status === "approved";
                    const isRejected = res.status === "rejected";

                    return (
                      <div key={res.id} className="p-4 rounded-card bg-cream/15 border border-sage-dark/10 flex flex-col justify-between gap-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <Link href={`/resources/${res.id}`} className="font-semibold text-sage-dark hover:text-sage text-sm transition-colors">
                              {res.title}
                            </Link>
                            <p className="text-[10px] text-ink/40 font-mono mt-0.5">
                              {res.subject} &middot; {res.grade} &middot; {res.fileType}
                            </p>
                          </div>
                          
                          {/* Status Badge */}
                          {isApproved && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-leaf font-mono bg-leaf-light/20 px-2 py-0.5 rounded-full">
                              <CheckCircle size={10} />
                              APPROVED
                            </span>
                          )}
                          {isPending && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-butter-dark font-mono bg-butter-light/40 px-2 py-0.5 rounded-full text-amber-700">
                              <Clock size={10} />
                              PENDING
                            </span>
                          )}
                          {isRejected && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 font-mono bg-rose-50 px-2 py-0.5 rounded-full">
                              <AlertCircle size={10} />
                              REJECTED
                            </span>
                          )}
                        </div>

                        {isRejected && res.rejectionReason && (
                          <div className="bg-rose-50 border border-rose-100 p-2.5 rounded-card text-xs text-rose-700">
                            <strong>Feedback:</strong> {res.rejectionReason}
                          </div>
                        )}

                        <div className="flex items-center justify-between border-t border-sage-dark/5 pt-3">
                          <span className="text-[10px] text-ink/45 font-mono">
                            {res.downloadsCount} downloads &bull; {res.likes} likes
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditClick(res)}
                              className="text-sage hover:text-sage-dark flex items-center gap-0.5 text-xs font-semibold"
                              title="Edit material metadata"
                            >
                              <Edit size={11} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteClick(res.id)}
                              className="text-rose-600 hover:text-rose-800 flex items-center gap-0.5 text-xs font-semibold"
                              title="Delete resource"
                            >
                              <Trash size={11} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Student Feedback Feed */}
            <div className="bg-paper rounded-card border border-sage-dark/10 p-5 shadow-card">
              <h3 className="font-display font-semibold text-sage-dark border-b border-sage-dark/8 pb-3 mb-4 flex items-center gap-2">
                <MessageSquare size={18} />
                Student Review Feed
              </h3>

              {myFeedback.length === 0 ? (
                <p className="text-xs text-ink/50 italic text-center py-6">No reviews left on your study guides yet.</p>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {myFeedback.map((fb, idx) => (
                    <div key={idx} className="p-3 bg-cream/10 border border-sage-dark/5 rounded-card text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <strong className="text-sage-dark capitalize">{fb.user}</strong>
                        <span className="text-[9px] text-ink/40 font-mono">{fb.date}</span>
                      </div>
                      
                      {fb.rating !== undefined && (
                        <div className="flex items-center text-butter mb-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={10}
                              className={s <= (fb.rating || 0) ? "fill-butter text-butter" : "text-sage-dark/10"}
                            />
                          ))}
                        </div>
                      )}

                      <p className="text-ink/75 italic">&ldquo;{fb.text}&rdquo;</p>
                      
                      <div className="mt-2 text-[9px] text-ink/40 text-right">
                        On resource: <strong className="text-sage">{fb.resourceTitle}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

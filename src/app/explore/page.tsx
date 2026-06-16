"use client";

import { useState, useEffect, Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp, Resource } from "@/context/AppContext";
import { Search, Filter, X, Heart, BookOpen, Star } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ToastContainer, useToast } from "@/components/Toast";
import NotebookCard from "@/components/NotebookCard";






function ExploreContent() {
  const { resources, savedResources, toggleFavorite, recordDownload, categories } = useApp();
  const searchParams = useSearchParams();
  const { toasts, addToast, removeToast } = useToast();


  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  // Filters
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCurriculum, setSelectedCurriculum] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Mobile filters drawer open
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync with search params
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setSearchQuery(q);

    const focus = searchParams.get("focus");
    if (focus === "country") {
      // Focus on country filter
    }
  }, [searchParams]);

  // Handle cascading curriculum resets when country changes
  useEffect(() => {
    setSelectedCurriculum("");
  }, [selectedCountry]);

  // Clear all filters
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCountry("");
    setSelectedCurriculum("");
    setSelectedGrade("");
    setSelectedSubject("");
    setSelectedTypes([]);
  };

  // Filter resource database
  const approvedResources = resources.filter(res => res.status === "approved");

  const filteredResources = approvedResources.filter((res) => {
    // Keyword match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchDesc = res.description.toLowerCase().includes(q);
      const matchSubject = res.subject.toLowerCase().includes(q);
      const matchCountry = res.country.toLowerCase().includes(q);
      const matchCurriculum = res.curriculum.toLowerCase().includes(q);
      const matchGrade = res.grade.toLowerCase().includes(q);
      const matchTopic = res.topic.toLowerCase().includes(q);

      if (!matchTitle && !matchDesc && !matchSubject && !matchCountry && !matchCurriculum && !matchGrade && !matchTopic) {
        return false;
      }
    }

    // Country match
    if (selectedCountry && res.country !== selectedCountry) return false;

    // Curriculum match
    if (selectedCurriculum && res.curriculum !== selectedCurriculum) return false;

    // Grade match
    if (selectedGrade && res.grade !== selectedGrade) return false;

    // Subject match
    if (selectedSubject && res.subject !== selectedSubject) return false;

    // Type match
    if (selectedTypes.length > 0 && !selectedTypes.includes(res.fileType)) return false;

    return true;
  });
const handleDownload = (e: React.MouseEvent, res: Resource) => {
  e.stopPropagation();
  e.preventDefault();
  recordDownload(res.id);

  if (res.fileUrl) {
    const a = document.createElement("a");
    a.href = res.fileUrl;
    a.download = res.fileUrl.split("/").pop() || "resource";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    addToast(`Downloading "${res.title}" (${res.fileSize})`, "download");
    return;
  }

  // Simulate file download
  const filename = `${res.title.toLowerCase().replace(/\s+/g, "_")}.${
    res.fileType === "PPT" ? "pptx" : res.fileType === "DOC" ? "docx" : "pdf"
  }`;
  const blob = new Blob([`Simulated content for ${res.title}`], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  addToast(`Downloading "${res.title}" (${res.fileSize})`, "download");
};


  // Curricula available for selected country
  const availableCurricula = selectedCountry
    ? categories.curricula[selectedCountry] || []
    : [];

  // Calculation of average rating
  const getAverageRating = (res: Resource) => {
    if (res.comments.length === 0) return 5.0; // Default placeholder rating
    const ratedComments = res.comments.filter((c) => c.rating !== undefined);
    if (ratedComments.length === 0) return 5.0;
    const sum = ratedComments.reduce((acc, curr) => acc + (curr.rating || 0), 0);
    return (sum / ratedComments.length).toFixed(1);
  };

  return (
    <main className="bg-cream min-h-screen flex flex-col font-body">
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <Navbar />


      {/* Explore Hero Section */}
      <section className="bg-sage-dark text-paper py-12 px-6 lg:px-10">
        <div className="mx-auto max-w-7xl text-center">
          <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            Astera Resource Library
          </h1>
          <p className="mt-3 text-paper/70 max-w-xl mx-auto text-sm sm:text-base">
            Search from thousands of worksheets, syllabus guides, and chapter notes cataloged by our volunteers globally.
          </p>

          {/* Search Box */}
          <div className="mt-8 max-w-2xl mx-auto flex items-center gap-3 bg-paper rounded-card border-2 border-sage-light/20 p-3 shadow-lg">
            <Search className="text-sage-dark/60 shrink-0 ml-2" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keywords, topic, curriculum, grade, subject..."
              className="w-full bg-transparent text-ink text-sm sm:text-base placeholder:text-ink/40 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-ink/45 hover:text-ink">
                <X size={18} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Browse Layout */}
      <section className="flex-1 mx-auto max-w-7xl w-full px-6 py-10 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="flex items-center justify-between border-b border-sage-dark/10 pb-4">
              <span className="font-display text-xl font-semibold text-sage-dark flex items-center gap-2">
                <Filter size={18} />
                Filters
              </span>
              <button
                onClick={handleClearFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
              >
                Clear all
              </button>
            </div>

            {/* Filter Country */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-sage">
                Country
              </label>
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full rounded-card border border-sage-dark/10 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-sage transition-all"
              >
                <option value="">All Countries</option>
                {categories.countries.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Curriculum */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-sage">
                Curriculum
              </label>
              <select
                value={selectedCurriculum}
                onChange={(e) => setSelectedCurriculum(e.target.value)}
                disabled={!selectedCountry}
                className="w-full rounded-card border border-sage-dark/10 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-sage disabled:bg-sage-dark/5 disabled:opacity-60 transition-all"
              >
                <option value="">{selectedCountry ? "All Curricula" : "Select Country first"}</option>
                {availableCurricula.map((curr) => (
                  <option key={curr} value={curr}>
                    {curr}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Grade */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-sage">
                Grade / Class
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full rounded-card border border-sage-dark/10 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-sage transition-all"
              >
                <option value="">All Grades</option>
                {categories.grades.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Subject */}
            <div className="space-y-2">
              <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-sage">
                Subject
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full rounded-card border border-sage-dark/10 bg-paper px-3 py-2 text-sm text-ink outline-none focus:border-sage transition-all"
              >
                <option value="">All Subjects</option>
                {categories.subjects.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter Resource Type */}
            <div className="space-y-2.5">
              <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-sage block">
                Resource Type
              </label>
              <div className="space-y-2 bg-paper p-3 rounded-card border border-sage-dark/10">
                {["PDF", "PPT", "DOC", "Image", "Worksheet"].map((type) => (
                  <label key={type} className="flex items-center gap-2 text-xs text-ink/85 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedTypes([...selectedTypes, type]);
                        } else {
                          setSelectedTypes(selectedTypes.filter((t) => t !== type));
                        }
                      }}
                      className="rounded border-sage-dark/20 text-sage focus:ring-sage"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* Mobile Filters Drawer / Trigger */}
          <div className="lg:hidden flex justify-between items-center bg-paper p-3 rounded-card border border-sage-dark/8 shadow-sm">
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 text-sm font-semibold text-sage-dark"
            >
              <Filter size={16} />
              <span>Filter Resources ({selectedCountry || selectedSubject || selectedGrade || selectedTypes.length > 0 ? "Active" : "All"})</span>
            </button>
            <button
              onClick={handleClearFilters}
              className="text-xs font-semibold text-rose-600"
            >
              Clear all
            </button>
          </div>

          {/* Results Shelf */}
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-xs sm:text-sm text-ink/60">
                Showing <strong className="font-semibold text-sage-dark">{filteredResources.length}</strong> resources
              </p>
            </div>

            {filteredResources.length === 0 ? (
              <div className="text-center py-20 bg-paper rounded-card border-2 border-dashed border-sage-dark/10 p-6">
                <BookOpen size={48} className="mx-auto text-sage/40" />
                <h3 className="mt-4 font-display text-xl font-semibold text-sage-dark">
                  No resources found
                </h3>
                <p className="mt-2 text-sm text-ink/60 max-w-sm mx-auto">
                  We couldn&apos;t find any study guides matching your filters. Try search keywords, or broaden your search criteria.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="mt-6 rounded-card bg-sage-dark px-4 py-2 text-xs font-semibold text-paper"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {filteredResources.map((res, i) => {
                  const isFavorited = savedResources.includes(res.id);
                  return (
                    <NotebookCard
                      key={res.id}
                      resource={res}
                      index={i}
                      onDownload={handleDownload}
                      onFavorite={toggleFavorite}
                      isFavorited={isFavorited}
                      showFavorite
                      rating={getAverageRating(res)}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Filters Drawer Modal */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/50 backdrop-blur-sm">
          <div className="w-80 h-full bg-paper p-6 flex flex-col shadow-2xl overflow-y-auto">
            <div className="flex justify-between items-center border-b border-sage-dark/10 pb-4">
              <span className="font-display text-xl font-semibold text-sage-dark flex items-center gap-2">
                <Filter size={18} />
                Filters
              </span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-ink/60 hover:text-rose-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 py-6 space-y-5">
              {/* Filter Country */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-sage">
                  Country
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full rounded-card border border-sage-dark/10 bg-cream px-3 py-2 text-sm text-ink"
                >
                  <option value="">All Countries</option>
                  {categories.countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Curriculum */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-sage">
                  Curriculum
                </label>
                <select
                  value={selectedCurriculum}
                  onChange={(e) => setSelectedCurriculum(e.target.value)}
                  disabled={!selectedCountry}
                  className="w-full rounded-card border border-sage-dark/10 bg-cream px-3 py-2 text-sm text-ink disabled:opacity-60"
                >
                  <option value="">{selectedCountry ? "All Curricula" : "Select Country first"}</option>
                  {availableCurricula.map((curr) => (
                    <option key={curr} value={curr}>
                      {curr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Grade */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-sage">
                  Grade / Class
                </label>
                <select
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="w-full rounded-card border border-sage-dark/10 bg-cream px-3 py-2 text-sm text-ink"
                >
                  <option value="">All Grades</option>
                  {categories.grades.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Subject */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-sage">
                  Subject
                </label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full rounded-card border border-sage-dark/10 bg-cream px-3 py-2 text-sm text-ink"
                >
                  <option value="">All Subjects</option>
                  {categories.subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filter Resource Type */}
              <div className="space-y-2">
                <label className="font-mono text-[10px] font-bold uppercase tracking-wider text-sage block">
                  Resource Type
                </label>
                <div className="space-y-2 bg-cream p-3 rounded-card border border-sage-dark/10">
                  {["PDF", "PPT", "DOC", "Image", "Worksheet"].map((type) => (
                    <label key={type} className="flex items-center gap-2 text-xs text-ink/85 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedTypes([...selectedTypes, type]);
                          } else {
                            setSelectedTypes(selectedTypes.filter((t) => t !== type));
                          }
                        }}
                        className="rounded border-sage-dark/20 text-sage focus:ring-sage"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="w-full rounded-card bg-sage-dark text-paper py-3 font-semibold text-sm shadow-card"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      <Footer />
    </main>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<div className="bg-cream min-h-screen flex items-center justify-center font-display text-xl text-sage-dark">Loading Resource Library...</div>}>
      <ExploreContent />
    </Suspense>
  );
}

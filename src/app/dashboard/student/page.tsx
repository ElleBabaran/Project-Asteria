"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useApp, Resource } from "@/context/AppContext";
import { Heart, Download, Clock, Star, BookOpen, User, BookMarked, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function StudentDashboard() {
  const { user, resources, savedResources, downloadHistory, recentlyViewed, toggleFavorite, login } = useApp();
  const [activeTab, setActiveTab] = useState<"saved" | "history" | "recent" | "recommended">("saved");

  // Fallback if not logged in as Student
  if (!user || user.role !== "student") {
    return (
      <main className="bg-cream min-h-screen flex flex-col font-body">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <BookMarked size={48} className="text-sage-dark/60 mb-4 animate-bounce" />
          <h2 className="font-display text-2xl font-semibold text-sage-dark">Student Dashboard</h2>
          <p className="mt-2 text-sm text-ink/65 max-w-sm">
            To view this dashboard, please log in as a Student or switch to the student role using the Sandbox controller below.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => login("student-sneha", "Sneha Patel", "sneha@astera.org", "student")}
              className="rounded-card bg-sage-dark text-paper px-6 py-2.5 text-xs font-semibold shadow"
            >
              Simulate Student Login
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

  // Filter approved resources
  const approved = resources.filter(res => res.status === "approved");

  // Favorites
  const favoriteResources = approved.filter(res => savedResources.includes(res.id));

  // Recently Viewed
  const recentlyViewedResources = recentlyViewed
    .map(id => approved.find(res => res.id === id))
    .filter((res): res is Resource => !!res);

  // Download History Details
  const historyList = downloadHistory
    .map(item => {
      const target = approved.find(res => res.id === item.resourceId);
      if (!target) return null;
      return {
        resource: target,
        timestamp: item.timestamp
      };
    })
    .filter((item): item is { resource: Resource; timestamp: string } => !!item);

  // Recommendations logic: Find subjects student is interested in from downloads & favorites
  const getRecommendedResources = (): Resource[] => {
    // Collect all subjects in history/favorites
    const subjectInterests = new Set<string>();
    favoriteResources.forEach(res => subjectInterests.add(res.subject));
    historyList.forEach(item => subjectInterests.add(item.resource.subject));

    // If no interests, recommend highest downloaded items they haven't saved/downloaded yet
    const excludedIds = new Set<string>([
      ...savedResources,
      ...downloadHistory.map(h => h.resourceId)
    ]);

    let recommendations = approved.filter(res => !excludedIds.has(res.id));

    if (subjectInterests.size > 0) {
      recommendations = recommendations.filter(res => subjectInterests.has(res.subject));
    }

    // Sort by downloads and limit 4
    return recommendations.sort((a, b) => b.downloadsCount - a.downloadsCount).slice(0, 4);
  };

  const recommendedResources = getRecommendedResources();

  // Formatting dates helper
  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <main className="bg-cream min-h-screen flex flex-col font-body">
      <Navbar />

      {/* Dashboard Banner */}
      <section className="bg-paper border-b border-sage-dark/10 py-10 px-6 lg:px-10">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center gap-6 justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blush-light text-sage-dark">
              <User size={28} />
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold text-sage-dark sm:text-3xl">
                Welcome, {user.name}!
              </h1>
              <p className="mt-1 text-xs font-mono uppercase tracking-wider text-ink/50">
                Student Account &bull; {user.email}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              href="/explore"
              className="rounded-card bg-sage px-5 py-2.5 text-xs font-semibold text-paper shadow-card hover:bg-sage-dark transition-all"
            >
              Search study resources
            </Link>
          </div>
        </div>
      </section>

      {/* Dashboard Tabs & Content */}
      <section className="flex-1 mx-auto max-w-7xl w-full px-6 py-10 lg:px-10">
        <div className="border-b border-sage-dark/10 pb-px mb-8 flex flex-wrap gap-1">
          {[
            { id: "saved", label: "Saved Favorites", count: favoriteResources.length },
            { id: "recommended", label: "For You", count: recommendedResources.length },
            { id: "history", label: "Download History", count: historyList.length },
            { id: "recent", label: "Recently Viewed", count: recentlyViewedResources.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`border-b-2 px-5 py-3 text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? "border-sage-dark text-sage-dark bg-paper rounded-t-card"
                  : "border-transparent text-ink/50 hover:text-sage hover:border-sage/40"
              }`}
            >
              {tab.label}{" "}
              <span className="ml-1 rounded-full bg-sage-dark/5 px-2 py-0.5 text-[10px] font-mono text-ink/65">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Panel Content */}
        <div>
          {/* Favorites Tab */}
          {activeTab === "saved" && (
            <div>
              {favoriteResources.length === 0 ? (
                <div className="text-center py-16 bg-paper rounded-card border-2 border-dashed border-sage-dark/10 p-6">
                  <Heart size={40} className="mx-auto text-rose-300" />
                  <h3 className="mt-4 font-display text-lg font-semibold text-sage-dark">No saved resources</h3>
                  <p className="mt-2 text-xs text-ink/60 max-w-xs mx-auto">
                    Click the heart icon on any study notes or guides across the catalog to keep them bookmarked here.
                  </p>
                  <Link href="/explore" className="mt-6 inline-flex items-center gap-1.5 rounded-card bg-sage-dark px-4 py-2 text-xs font-semibold text-paper">
                    <span>Explore resource library</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {favoriteResources.map((res) => (
                    <article key={res.id} className="group relative rounded-card border-2 border-sage-dark/8 bg-paper p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-sage/30">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-sage font-mono">
                          {res.fileType}
                        </span>
                        <button
                          onClick={() => toggleFavorite(res.id)}
                          className="text-rose-500 hover:text-ink transition-colors"
                          title="Remove favorite"
                        >
                          <Heart size={15} className="fill-rose-500" />
                        </button>
                      </div>

                      <Link href={`/resources/${res.id}`} className="block mt-3">
                        <h3 className="font-display font-semibold text-sage-dark group-hover:text-sage transition-colors text-base line-clamp-1">
                          {res.title}
                        </h3>
                      </Link>
                      <p className="mt-1 text-xs text-ink/40 font-mono">
                        {res.country}
                      </p>
                      <p className="text-xs text-sage-dark/85 mt-0.5">
                        {res.grade} &bull; {res.subject}
                      </p>

                      <div className="mt-5 border-t border-sage-dark/8 pt-4 flex items-center justify-between">
                        <span className="text-[10px] text-ink/40">{res.downloadsCount} downloads</span>
                        <Link href={`/resources/${res.id}`} className="text-xs font-semibold text-sage-dark flex items-center gap-1">
                          <span>View Notes</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === "recommended" && (
            <div>
              {recommendedResources.length === 0 ? (
                <div className="text-center py-16 bg-paper rounded-card border-2 border-dashed border-sage-dark/10 p-6">
                  <BookOpen size={40} className="mx-auto text-sage/40" />
                  <h3 className="mt-4 font-display text-lg font-semibold text-sage-dark">No custom recommendations yet</h3>
                  <p className="mt-2 text-xs text-ink/60 max-w-xs mx-auto">
                    We personalize study recommendations based on your favorite subjects. Download notes or favorite materials to get suggestions!
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-ink/50 mb-4">
                    Recommended based on subjects you have recently bookmarked or downloaded:
                  </p>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {recommendedResources.map((res) => (
                      <article key={res.id} className="group rounded-card border-2 border-sage-dark/8 bg-paper p-4 shadow-card hover:border-sage/20 transition-all">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-sage font-mono">{res.fileType}</span>
                        <Link href={`/resources/${res.id}`} className="block mt-2">
                          <h4 className="font-display font-semibold text-sage-dark text-sm line-clamp-2 min-h-[2.5rem] group-hover:text-sage transition-colors">
                            {res.title}
                          </h4>
                        </Link>
                        <p className="text-[10px] text-ink/40 mt-1 truncate">{res.subject} &bull; {res.grade}</p>
                        <div className="mt-4 border-t border-sage-dark/5 pt-3 flex items-center justify-between">
                          <span className="text-[9px] text-ink/45">{res.downloadsCount} dl</span>
                          <Link href={`/resources/${res.id}`} className="text-[10px] font-bold text-sage-dark flex items-center gap-0.5">
                            <span>Open</span>
                            <ArrowRight size={10} />
                          </Link>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Download History Tab */}
          {activeTab === "history" && (
            <div>
              {historyList.length === 0 ? (
                <div className="text-center py-16 bg-paper rounded-card border-2 border-dashed border-sage-dark/10 p-6">
                  <Download size={40} className="mx-auto text-leaf/50" />
                  <h3 className="mt-4 font-display text-lg font-semibold text-sage-dark">No downloads history</h3>
                  <p className="mt-2 text-xs text-ink/60 max-w-xs mx-auto">
                    Any files you download will be logged here so you can quickly retrieve them without re-searching.
                  </p>
                </div>
              ) : (
                <div className="bg-paper rounded-card border border-sage-dark/10 overflow-hidden shadow-card">
                  <div className="divide-y divide-sage-dark/8">
                    {historyList.map((item, i) => (
                      <div key={i} className="p-4 sm:p-5 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap hover:bg-cream/10">
                        <div className="flex items-start gap-3">
                          <span className="mt-1 flex h-8 w-8 items-center justify-center rounded bg-leaf-light text-sage-dark shrink-0">
                            <Clock size={16} />
                          </span>
                          <div>
                            <Link href={`/resources/${item.resource.id}`} className="font-semibold text-sage-dark hover:text-sage transition-colors text-sm sm:text-base">
                              {item.resource.title}
                            </Link>
                            <p className="text-xs text-ink/45 mt-0.5 font-mono">
                              {item.resource.subject} &middot; {item.resource.grade} &middot; {item.resource.fileType} ({item.resource.fileSize})
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-mono text-ink/50 block">Downloaded</span>
                          <span className="text-xs font-semibold text-sage-dark mt-0.5 block">{formatDate(item.timestamp)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recently Viewed Tab */}
          {activeTab === "recent" && (
            <div>
              {recentlyViewedResources.length === 0 ? (
                <div className="text-center py-16 bg-paper rounded-card border-2 border-dashed border-sage-dark/10 p-6">
                  <Clock size={40} className="mx-auto text-sage/40" />
                  <h3 className="mt-4 font-display text-lg font-semibold text-sage-dark">No recently viewed files</h3>
                  <p className="mt-2 text-xs text-ink/60 max-w-xs mx-auto">
                    We will track files you open here so you can pick up where you left off.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {recentlyViewedResources.map((res) => (
                    <div key={res.id} className="bg-paper p-4 rounded-card border border-sage-dark/8 flex items-center justify-between gap-4">
                      <div>
                        <Link href={`/resources/${res.id}`} className="font-semibold text-sage-dark hover:text-sage text-sm line-clamp-1">
                          {res.title}
                        </Link>
                        <span className="text-[10px] text-ink/40 font-mono mt-0.5 block">{res.subject} &bull; {res.grade}</span>
                      </div>
                      <Link href={`/resources/${res.id}`} className="rounded-full bg-cream p-2 text-sage-dark hover:bg-sage hover:text-paper transition-all">
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}

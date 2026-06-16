"use client";

import { ArrowRight } from "lucide-react";
import { useApp, Resource } from "@/context/AppContext";
import Link from "next/link";
import { ToastContainer, useToast } from "@/components/Toast";
import NotebookCard from "@/components/NotebookCard";

export default function FeaturedShelf() {
  const { resources, recordDownload } = useApp();
  const { toasts, addToast, removeToast } = useToast();

  // Show only approved resources, sort by downloads count
  const approvedResources = resources
    .filter((res) => res.status === "approved")
    .sort((a, b) => b.downloadsCount - a.downloadsCount)
    .slice(0, 8);

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
  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <section id="explore" className="px-6 py-20 lg:px-10 font-body">
        <div className="mx-auto max-w-7xl">
          {/* Section header */}
          <div className="reveal flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-sage">
                From the shelves
              </p>
              <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight text-sage-dark sm:text-5xl">
                Recently added &amp; popular
              </h2>
            </div>
            <Link
              href="/explore"
              className="group flex items-center gap-2 text-sm font-semibold text-sage-dark transition-colors hover:text-sage"
            >
              Browse all resources
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Notebook grid */}
          <div className="reveal-group mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {approvedResources.map((res, i) => (
              <NotebookCard
                key={res.id}
                resource={res}
                index={i}
                onDownload={handleDownload}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

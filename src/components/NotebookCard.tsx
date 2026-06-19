"use client";

import React from "react";
import Link from "next/link";
import { Download, Heart } from "lucide-react";
import { Resource } from "@/context/AppContext";

// ──────────────────────────────────────────────
//  8 distinct composition-notebook cover designs
// ──────────────────────────────────────────────
const COVER_DESIGNS = [
  {
    // 0 — rosy hearts (pink on blush)
    bg: "#F2D6E2",
    patternType: "hearts",
    patternColor: "#d4688a",
    labelBg: "#fff",
    labelBorder: "#E0A6BE",
    spineBg: "#E0A6BE",
    textDark: true,
  },
  {
    // 1 — midnight stripes (dark navy)
    bg: "#1E2D40",
    patternType: "diagonal",
    patternColor: "rgba(255,255,255,0.07)",
    labelBg: "#F5F0E8",
    labelBorder: "#9FC2B5",
    spineBg: "#14202E",
    textDark: false,
  },
  {
    // 2 — garden dots (sage green)
    bg: "#CFE6CA",
    patternType: "dots",
    patternColor: "rgba(70,130,70,0.28)",
    labelBg: "#fff",
    labelBorder: "#92C58A",
    spineBg: "#92C58A",
    textDark: true,
  },
  {
    // 3 — golden grid (butter yellow)
    bg: "#FAEFC9",
    patternType: "grid",
    patternColor: "rgba(180,140,30,0.22)",
    labelBg: "#fff",
    labelBorder: "#F0D27D",
    spineBg: "#F0D27D",
    textDark: true,
  },
  {
    // 4 — ocean waves (dusty blue)
    bg: "#C8DDE8",
    patternType: "waves",
    patternColor: "rgba(50,100,150,0.22)",
    labelBg: "#fff",
    labelBorder: "#5B8A7A",
    spineBg: "#9FC2B5",
    textDark: true,
  },
  {
    // 5 — antique diagonal (warm sand)
    bg: "#EDE0D0",
    patternType: "diagonal-rev",
    patternColor: "rgba(140,80,30,0.18)",
    labelBg: "#FCFBF7",
    labelBorder: "#C9956A",
    spineBg: "#C9956A",
    textDark: true,
  },
  {
    // 6 — forest grid (dark sage)
    bg: "#2E3B36",
    patternType: "grid",
    patternColor: "rgba(255,255,255,0.06)",
    labelBg: "#F7F4ED",
    labelBorder: "#5B8A7A",
    spineBg: "#1E2A25",
    textDark: false,
  },
  {
    // 7 — blossom circles (soft lavender-rose)
    bg: "#EDD8EE",
    patternType: "dots-lg",
    patternColor: "rgba(155,60,160,0.18)",
    labelBg: "#fff",
    labelBorder: "#C9A0DC",
    spineBg: "#C9A0DC",
    textDark: true,
  },
];

// Build a CSS backgroundImage string for each pattern type
function patternStyle(type: string, color: string): React.CSSProperties {
  switch (type) {
    case "hearts":
      // Encode hex color for SVG data URI (no special chars in hex)
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22'%3E%3Ctext x='3' y='16' font-size='13' fill='${encodeURIComponent(color)}' opacity='0.55'%3E%E2%99%A5%3C/text%3E%3C/svg%3E")`,
        backgroundSize: "22px 22px",
      };
    case "diagonal":
      return {
        backgroundImage: `repeating-linear-gradient(45deg, ${color} 0px, ${color} 1px, transparent 1px, transparent 12px)`,
      };
    case "diagonal-rev":
      return {
        backgroundImage: `repeating-linear-gradient(-45deg, ${color} 0px, ${color} 1px, transparent 1px, transparent 12px)`,
      };
    case "dots":
      return {
        backgroundImage: `radial-gradient(circle, ${color} 1.5px, transparent 1.5px)`,
        backgroundSize: "14px 14px",
      };
    case "dots-lg":
      return {
        backgroundImage: `radial-gradient(circle, ${color} 3px, transparent 3px)`,
        backgroundSize: "22px 22px",
      };
    case "grid":
      return {
        backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
        backgroundSize: "16px 16px",
      };
    case "waves":
      return {
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='24'%3E%3Cpath d='M0 12 Q12 2 24 12 Q36 22 48 12' fill='none' stroke='rgba(50%2C100%2C150%2C0.28)' stroke-width='1.5'/%3E%3C/svg%3E")`,
        backgroundSize: "48px 24px",
      };
    default:
      return {};
  }
}

interface NotebookCardProps {
  resource: Resource;
  index: number;
  onDownload?: (e: React.MouseEvent, resource: Resource) => void;
  onFavorite?: (id: string) => void;
  isFavorited?: boolean;
  showFavorite?: boolean;
  rating?: string | number;
}

export default function NotebookCard({
  resource,
  index,
  onDownload,
  onFavorite,
  isFavorited = false,
  showFavorite = false,
  rating,
}: NotebookCardProps) {
  const design = COVER_DESIGNS[index % COVER_DESIGNS.length];
  const pat = patternStyle(design.patternType, design.patternColor);

  return (
    <div className="group flex flex-col gap-3">
      {/* ── Notebook Cover ── */}
      <div className="relative">
        <Link
          href={`/resources/${resource.id}`}
          className="relative block overflow-hidden rounded-[0.65rem] shadow-[0_4px_0_0_rgba(0,0,0,0.12),0_8px_32px_-8px_rgba(0,0,0,0.22)] transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_8px_0_0_rgba(0,0,0,0.10),0_20px_40px_-8px_rgba(0,0,0,0.28)]"
          style={{ aspectRatio: "3/4" }}
          aria-label={`View ${resource.title}`}
        >
          {/* Cover background */}
          <div
            className="absolute inset-0"
            style={{ backgroundColor: design.bg, ...pat }}
          />

          {/* Spine strip on the left */}
          <div
            className="absolute left-0 top-0 bottom-0 w-4"
            style={{ backgroundColor: design.spineBg }}
          />
          {/* Spine highlight */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/20" />

          {/* Composition label */}
          <div className="absolute inset-0 flex items-center justify-center px-7">
            <div
              className="w-full rounded-[0.35rem] px-4 py-3.5 shadow-sm"
              style={{
                backgroundColor: design.labelBg,
                border: `1.5px solid ${design.labelBorder}`,
              }}
            >
              {/* Header row */}
              <p
                className="text-center font-mono text-[7px] font-bold uppercase tracking-[0.22em] opacity-50"
                style={{ color: design.textDark ? "#2E3B36" : "#2E3B36" }}
              >
                Composition Notebook
              </p>
              {/* Rule */}
              <div
                className="my-2 h-px opacity-25"
                style={{ backgroundColor: design.labelBorder }}
              />
              {/* Subject info */}
              <p
                className="text-center font-mono text-[8px] uppercase tracking-[0.16em] opacity-60"
                style={{ color: "#2E3B36" }}
              >
                {resource.country}
              </p>
              <p
                className="mt-1 text-center font-display text-xs font-semibold leading-tight"
                style={{ color: "#2E3B36" }}
              >
                {resource.grade}
              </p>
              <p
                className="mt-0.5 text-center font-mono text-[8px] opacity-50"
                style={{ color: "#2E3B36" }}
              >
                {resource.curriculum} · {resource.subject}
              </p>
              {/* Bottom rule */}
              <div
                className="mt-2 h-px opacity-25"
                style={{ backgroundColor: design.labelBorder }}
              />
            </div>
          </div>

          {/* File type badge — bottom right of cover */}
          <div className="absolute bottom-3 right-3">
            <span
              className="rounded px-1.5 py-0.5 font-mono text-[7px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${design.spineBg}cc`,
                color: design.textDark ? "#2E3B36" : "#F7F4ED",
              }}
            >
              {resource.fileType}
            </span>
          </div>
        </Link>

        {showFavorite && onFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onFavorite(resource.id);
            }}
            className="absolute right-2.5 top-2.5 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow transition-all hover:scale-110 active:scale-90"
            title={isFavorited ? "Remove from favorites" : "Save"}
            aria-label={isFavorited ? "Remove from favorites" : "Save to favorites"}
          >
            <Heart
              size={13}
              className={isFavorited ? "fill-rose-500 text-rose-500" : "text-ink/50"}
            />
          </button>
        )}
      </div>

      {/* ── Below-cover info ── */}
      <div className="px-0.5">
        <Link href={`/resources/${resource.id}`} className="block">
          <h3 className="font-display text-sm font-semibold leading-snug text-sage-dark transition-colors group-hover:text-sage line-clamp-2">
            {resource.title}
          </h3>
        </Link>

        <div className="mt-1.5 flex items-center justify-between gap-2">
          <p className="font-mono text-[10px] text-ink/45 truncate">
            {resource.downloadsCount.toLocaleString()} downloads
            {rating && <> · ★ {rating}</>}
          </p>

          {onDownload && (
            <button
              onClick={(e) => onDownload(e, resource)}
              aria-label={`Download ${resource.title}`}
              className="flex shrink-0 h-7 w-7 items-center justify-center rounded-full bg-leaf-light text-sage-dark transition-all duration-200 hover:bg-leaf hover:scale-110 active:scale-90"
            >
              <Download size={13} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

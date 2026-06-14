"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    // Run on every route change so newly navigated pages get their
    // .reveal / .reveal-group elements observed correctly.
    const run = () => {
      const els = document.querySelectorAll<Element>(
        ".reveal:not(.is-visible), .reveal-group:not(.is-visible)"
      );

      if (!(("IntersectionObserver" in window))) {
        els.forEach((el) => el.classList.add("is-visible"));
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: "0px 0px 0px 0px" }
      );

      els.forEach((el) => {
        // Immediately reveal anything already in the viewport
        const rect = el.getBoundingClientRect();
        const inView = rect.top < window.innerHeight && rect.bottom > 0;
        if (inView) {
          el.classList.add("is-visible");
        } else {
          observer.observe(el);
        }
      });

      return () => observer.disconnect();
    };

    // Small rAF delay so the new page's DOM is fully painted before we query
    const id = requestAnimationFrame(() => {
      const cleanup = run();
      return cleanup;
    });

    return () => cancelAnimationFrame(id);
  }, [pathname]); // Re-run on every navigation

  return null;
}

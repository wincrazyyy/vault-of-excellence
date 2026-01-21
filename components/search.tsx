// app/_components/search.tsx
"use client";

import { useEffect, useRef } from "react";
import { SearchBar } from "./search-bar";

const NAV_SEARCH_EVENT = "findtutor:nav-search";
const NAV_SEARCH_REQUEST = "findtutor:nav-search:request";
const NAV_HEIGHT = 90;

export function Search() {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const subjects = [
    "Math",
    "English",
    "Science",
    "Languages",
    "Coding",
    "Exam Prep",
    "Music",
    "Economics",
  ];

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const emit = (show: boolean) => {
      window.dispatchEvent(
        new CustomEvent(NAV_SEARCH_EVENT, { detail: { show } })
      );
    };

    const computeAndEmit = () => {
      const rect = el.getBoundingClientRect();
      emit(rect.top < NAV_HEIGHT);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        emit(!entry.isIntersecting);
      },
      {
        threshold: 0,
        rootMargin: `-${NAV_HEIGHT}px 0px 0px 0px`,
      }
    );

    io.observe(el);

    requestAnimationFrame(computeAndEmit);

    const onRequest = () => computeAndEmit();
    window.addEventListener(NAV_SEARCH_REQUEST, onRequest);

    return () => {
      io.disconnect();
      window.removeEventListener(NAV_SEARCH_REQUEST, onRequest);
    };
  }, []);

  return (
    <div className="mt-7">
      {/* Sentinel: 1px line right above the hero search */}
      <div ref={sentinelRef} className="h-px w-full" />

      <SearchBar variant="full" />

      <div className="mt-4 flex flex-wrap gap-2">
        {subjects.map((s) => (
          <button
            key={s}
            type="button"
            className={[
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              // theme-safe base
              "border-border bg-muted text-foreground hover:bg-muted/70",
              // subtle violet accent (works in dark mode too)
              "hover:border-violet-300 dark:hover:border-violet-700",
            ].join(" ")}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SearchBar, POPULAR_SUBJECTS } from "./search-bar";
import { Button } from "@/components/ui/button";

const NAV_SEARCH_EVENT = "findtutor:nav-search";
const NAV_SEARCH_REQUEST = "findtutor:nav-search:request";
const NAV_HEIGHT = 96;

export function Search() {
  const router = useRouter();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const subjects = POPULAR_SUBJECTS.slice(0, 8);

  const handleSubjectClick = (subject: string) => {
    router.push(`/tutors?query=${encodeURIComponent(subject)}`);
  };

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
      <div ref={sentinelRef} className="h-px w-full" />

      <div className="relative z-50">
        <SearchBar variant="full" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2 relative z-0">
        {subjects.map((s) => (
          <Button
            key={s}
            variant="secondary"
            size="sm"
            onClick={() => handleSubjectClick(s)}
            className="h-7 px-3 text-xs font-medium hover:bg-violet-100 hover:text-violet-700 dark:hover:bg-violet-900/30 dark:hover:text-violet-300 transition-colors"
          >
            {s}
          </Button>
        ))}
      </div>
    </div>
  );
}

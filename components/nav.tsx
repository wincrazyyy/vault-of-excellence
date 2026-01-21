// app/_components/layout/nav.tsx
"use client";

import Image from "next/image";
import { useEffect, useState, ReactNode } from "react";
import { SearchBar } from "@/components/search-bar";
import { ThemeSwitcher } from "./theme-switcher";

type NavProps = {
  authSlot?: ReactNode;
};

export function Nav({ authSlot }: NavProps) {
  const [showNavSearch, setShowNavSearch] = useState(false);

  useEffect(() => {
    const onToggle = (e: Event) => {
      const ce = e as CustomEvent<{ show: boolean }>;
      setShowNavSearch(Boolean(ce.detail?.show));
    };

    window.addEventListener("findtutor:nav-search", onToggle);
    window.dispatchEvent(new CustomEvent("findtutor:nav-search:request"));

    return () => window.removeEventListener("findtutor:nav-search", onToggle);
  }, []);

  const logoSrc = showNavSearch ? "/logo.png" : "/logo-rectangle.png";

  return (
    <header
      className={[
        "fixed inset-x-0 top-0 z-50 h-24 border-b backdrop-blur",
        "bg-background/80 border-border",
      ].join(" ")}
    >
      <div className="mx-auto flex h-24 max-w-5xl items-center gap-4 px-6">
        {/* Logo */}
        <a href="/" className="shrink-0">
          <div
            className={[
              "relative overflow-hidden",
              showNavSearch ? "h-11 w-11 mx-6 rounded-xl" : "h-16 w-52",
            ].join(" ")}
          >
            <Image
              src={logoSrc}
              alt="Vault of Excellence"
              fill
              sizes={showNavSearch ? "48px" : "(max-width: 1024px) 160px, 200px"}
              className="object-contain"
              priority
            />
          </div>
        </a>

        {/* Search */}
        <div className="flex-1 min-w-0">
          <div
            className={[
              "h-13 transition-all duration-200",
              showNavSearch
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-1 pointer-events-none",
            ].join(" ")}
          >
            <SearchBar variant="nav" />
          </div>
        </div>

        {/* Auth */}
        <nav className="flex shrink-0 items-center gap-2">
          <ThemeSwitcher />
          {authSlot}
        </nav>
      </div>
    </header>
  );
}

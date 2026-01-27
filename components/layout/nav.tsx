// app/_components/layout/nav.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SearchBar } from "@/components/search-bar";
import { ThemeSwitcher } from "../theme-switcher";
import { createClient } from "@/lib/supabase/client";

type NavProps = {
  authSlot?: ReactNode;
};

export function Nav({ authSlot }: NavProps) {
  const pathname = usePathname();
  const [showNavSearch, setShowNavSearch] = useState(false);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

  // Supabase auth state (client)
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }) => {
      setIsAuthed(Boolean(data.user));
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(Boolean(session?.user));
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  // Reset on navigation
  useEffect(() => {
    setShowNavSearch(false);
    window.dispatchEvent(new CustomEvent("findtutor:nav-search:request"));
  }, [pathname]);

  // Listen for page scroll/observer events
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

  const logoHref = useMemo(() => (isAuthed ? "/dashboard" : "/"), [isAuthed]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-24 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-24 max-w-5xl items-center gap-4 px-6">
        {/* Logo */}
        <Link href={logoHref} className="shrink-0">
          <div
            className={[
              "relative overflow-hidden",
              showNavSearch ? "h-14 w-14 rounded-xl" : "h-16 w-52",
            ].join(" ")}
          >
            <Image
              key={logoSrc}
              src={logoSrc}
              alt="Vault of Excellence"
              fill
              sizes={showNavSearch ? "48px" : "(max-width: 1024px) 160px, 200px"}
              className="object-contain"
              priority
            />
          </div>
        </Link>

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

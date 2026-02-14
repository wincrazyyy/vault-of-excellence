"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SearchBar } from "@/components/main/search-bar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "@/components/env-var-warning";

type NavProps = {
  authSlot?: ReactNode;
};

export function Nav({ authSlot }: NavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showNavSearch, setShowNavSearch] = useState(false);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);

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

  useEffect(() => {
    if (pathname === "/tutors") {
      setShowNavSearch(true);
      return; 
    }

    setShowNavSearch(false);
    window.dispatchEvent(new CustomEvent("findtutor:nav-search:request"));
  }, [pathname]);

  useEffect(() => {
    const onToggle = (e: Event) => {
      if (pathname === "/tutors") return;

      const ce = e as CustomEvent<{ show: boolean }>;
      setShowNavSearch(Boolean(ce.detail?.show));
    };

    window.addEventListener("findtutor:nav-search", onToggle);
    window.dispatchEvent(new CustomEvent("findtutor:nav-search:request"));

    return () => window.removeEventListener("findtutor:nav-search", onToggle);
  }, [pathname]);

  const logoSrc = showNavSearch ? "/logo.png" : "/logo-rectangle.png";
  const logoHref = useMemo(() => (isAuthed ? "/dashboard" : "/"), [isAuthed]);

  const currentQuery = searchParams.get("query") || "";

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-24 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-24 max-w-5xl items-center gap-4 px-6">
        <Link href={logoHref} className="shrink-0">
          <div
            className={[
              "relative overflow-hidden",
              showNavSearch ? "h-10 w-10 sm:h-14 sm:w-14 rounded-xl" : "h-16 w-52",
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

        <div className="flex-1 min-w-0">
          <div
            className={[
              "h-13 transition-all duration-200",
              showNavSearch
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-1 pointer-events-none",
            ].join(" ")}
          >
            <SearchBar variant="nav" defaultValue={currentQuery} key={currentQuery} />
          </div>
        </div>

        <nav className="flex shrink-0 items-center gap-2">
          <ThemeSwitcher />
          {!hasEnvVars ? <EnvVarWarning /> : authSlot}
        </nav>
      </div>
    </header>
  );
}
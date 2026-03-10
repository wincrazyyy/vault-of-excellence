"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, ReactNode } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { SearchBar } from "@/components/main/search-bar";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import { EnvVarWarning } from "@/components/env-var-warning";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, Eye, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type NavProps = {
  authSlot?: ReactNode;
};

export function Nav({ authSlot }: NavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showNavSearch, setShowNavSearch] = useState(false);
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  
  const [tutorId, setTutorId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const supabase = createClient();

    const checkAdminStatus = async (userId: string) => {
      const { data } = await supabase
        .from("tutors")
        .select("is_admin")
        .eq("id", userId)
        .single();
      setIsAdmin(Boolean(data?.is_admin));
    };

    supabase.auth.getUser().then(({ data }) => {
      setIsAuthed(Boolean(data.user));
      if (data.user) {
        setTutorId(data.user.id);
        checkAdminStatus(data.user.id);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      setIsAuthed(Boolean(user));
      
      if (user) {
        setTutorId(user.id);
        checkAdminStatus(user.id);
      } else {
        setTutorId(null);
        setIsAdmin(false);
      }
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

  const logoLightSrc = showNavSearch ? "/logo.png" : "/logo-rectangle-light.png";
  const logoDarkSrc = showNavSearch ? "/logo.png" : "/logo-rectangle-dark.png"; 
  
  const currentQuery = searchParams.get("query") || "";

  const isDashboardActive = pathname.startsWith("/dashboard");
  const isPreviewActive = tutorId && pathname === `/tutors/${tutorId}`;
  const isAdminActive = pathname.startsWith("/admin");

  const activeStyles = "bg-violet-100 text-violet-700 hover:bg-violet-200 hover:text-violet-800 dark:bg-violet-500/20 dark:text-violet-200 dark:hover:bg-violet-500/30";
  const inactiveStyles = "text-muted-foreground hover:bg-muted hover:text-foreground";

  const adminActiveStyles = "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-500/20 dark:text-amber-400";
  const adminInactiveStyles = "text-amber-600/80 hover:bg-amber-50 dark:text-amber-500/80 dark:hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400";

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-24 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-24 max-w-5xl items-center gap-4 px-6">
        <Link href="/" className="shrink-0">
          <div
            className={[
              "relative overflow-hidden",
              showNavSearch ? "h-10 w-10 sm:h-14 sm:w-14 rounded-xl" : "h-16 w-52",
            ].join(" ")}
          >
            <Image
              key={`light-${logoLightSrc}`}
              src={logoLightSrc}
              alt="Vault of Excellence"
              fill
              sizes={showNavSearch ? "48px" : "(max-width: 1024px) 160px, 200px"}
              className="object-contain block dark:hidden"
              priority
            />
            <Image
              key={`dark-${logoDarkSrc}`}
              src={logoDarkSrc}
              alt="Vault of Excellence"
              fill
              sizes={showNavSearch ? "48px" : "(max-width: 1024px) 160px, 200px"}
              className="object-contain hidden dark:block"
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
          {isAuthed && (
            <TooltipProvider delayDuration={200}>
              <div className="hidden sm:flex items-center gap-1.5 mr-1 bg-muted/30 p-1 rounded-full border border-border/50">
                {isAdmin && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        asChild 
                        className={cn(
                          "h-8 w-8 rounded-full transition-colors",
                          isAdminActive ? adminActiveStyles : adminInactiveStyles
                        )}
                      >
                        <Link href="/admin">
                          <ShieldCheck className="h-4.5 w-4.5" />
                          <span className="sr-only">Admin Dashboard</span>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs font-medium">
                      <p>Admin Panel</p>
                    </TooltipContent>
                  </Tooltip>
                )}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      asChild 
                      className={cn(
                        "h-8 w-8 rounded-full transition-colors",
                        isDashboardActive ? activeStyles : inactiveStyles
                      )}
                    >
                      <Link href="/dashboard">
                        <LayoutDashboard className="h-4.5 w-4.5" />
                        <span className="sr-only">Dashboard</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="text-xs font-medium">
                    <p>Dashboard</p>
                  </TooltipContent>
                </Tooltip>

                {tutorId && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        asChild 
                        className={cn(
                          "h-8 w-8 rounded-full transition-colors",
                          isPreviewActive ? activeStyles : inactiveStyles
                        )}
                      >
                        <Link href={`/tutors/${tutorId}`}>
                          <Eye className="h-4.5 w-4.5" />
                          <span className="sr-only">Preview Public Profile</span>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="text-xs font-medium">
                      <p>View Public Profile</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
              </div>
            </TooltipProvider>
          )}
          
          <ThemeSwitcher />
          {!hasEnvVars ? <EnvVarWarning /> : authSlot}
        </nav>
      </div>
    </header>
  );
}

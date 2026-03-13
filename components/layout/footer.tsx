"use client";

import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col md:flex-row items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground">
        
        <p className="text-xs">
          © {new Date().getFullYear()} Vault of Excellence. All rights reserved.
        </p>
        
        <div className="flex items-center gap-6 text-xs font-medium">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <div className="h-4 w-px bg-border hidden sm:block"></div>
          
          <ThemeSwitcher />
        </div>

      </div>
    </footer>
  );
}

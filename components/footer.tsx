// components/footer.tsx
"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";

export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-center gap-4 px-6 py-16 text-center text-xs text-muted-foreground">
        <p>© {new Date().getFullYear()} Vault of Excellence. All rights reserved.</p>
        <ThemeSwitcher />
      </div>
    </footer>
  );
}

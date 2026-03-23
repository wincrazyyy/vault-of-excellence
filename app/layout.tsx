import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";

import { Nav } from "@/components/layout/nav";
import { AuthButton } from "@/components/auth/auth-button";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";

import { GoogleAnalytics } from "@next/third-parties/google";

const defaultUrl = process.env.NODE_ENV === "production"
  ? "https://voetutor.com"
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Vault of Excellence | Find the Best Online Tutors",
  description: "Connect with expert tutors for A-Level, IB, GCSE, and more. Book your lessons online today.",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Suspense fallback={<div className="h-24" />}>
              <Nav authSlot={<AuthButton />} />
            </Suspense>

            <main className="flex-1 pt-24">
              {children}
            </main>

            <Suspense>
              <Footer />
            </Suspense>
          </div>
          <Toaster />
        </ThemeProvider>

        <Analytics />
        <GoogleAnalytics gaId="G-08B8MKVYC7" />
      </body>
    </html>
  );
}

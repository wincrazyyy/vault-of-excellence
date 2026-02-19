"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

type SearchBarProps = {
  variant?: "full" | "nav";
  defaultValue?: string;
};

export function SearchBar({ variant = "full", defaultValue = "" }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(defaultValue);
  const isNav = variant === "nav";

  useEffect(() => {
    const currentUrlQuery = searchParams.get("query");
    if (currentUrlQuery) {
      setQuery(currentUrlQuery);
    } else {
      setQuery("");
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/tutors?query=${encodeURIComponent(query)}`);
  };

  const placeholder = isNav
    ? "Search tutors..."
    : "Try: Math, IELTS, Chemistry…";

  return (
    <form 
      onSubmit={handleSearch}
      className={isNav ? "w-full" : "grid gap-3 sm:grid-cols-[1fr_auto] items-end"}
    >
      <div className="w-full">
        {!isNav && (
          <div className="mb-2 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Search tutors
          </div>
        )}

        <div className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />

          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className={
              isNav 
                ? "h-10 pl-9 sm:h-13 sm:pl-10 bg-background" 
                : "h-12 pl-10 bg-background"
            }
          />
        </div>
      </div>

      {!isNav && (
        <Button
          type="submit"
          variant="default"
          className="mt-3 h-12 w-full sm:mt-0 sm:w-auto"
        >
          Search
        </Button>
      )}
    </form>
  );
}
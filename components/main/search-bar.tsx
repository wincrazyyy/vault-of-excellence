"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

type SearchBarProps = {
  variant?: "full" | "nav";
  defaultValue?: string;
};

const SUGGESTED_SEARCHES = [
  "Math",
  "Exam Prep",
  "English",
  "Science",
  "Chemistry",
  "Physics",
  "Computer Science",
  "History",
  "Spanish",
  "IELTS",
];

function SearchBarInner({ variant = "full", defaultValue = "" }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isNav = variant === "nav";

  const [query, setQuery] = useState(defaultValue);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentUrlQuery = searchParams.get("query");
    if (currentUrlQuery) {
      setQuery(currentUrlQuery);
    } else {
      setQuery("");
    }
    setShowDropdown(false);
  }, [searchParams]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredSuggestions = SUGGESTED_SEARCHES.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    
    setShowDropdown(false);
    router.push(`/tutors?query=${encodeURIComponent(query)}`);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setShowDropdown(false);
    router.push(`/tutors?query=${encodeURIComponent(suggestion)}`);
  };

  const placeholder = isNav
    ? "Search tutors..."
    : "Try: Math, IELTS, Chemistry…";

  return (
    <div ref={containerRef} className={`relative z-50 ${isNav ? "w-full" : ""}`}>
      <form 
        onSubmit={handleSearch}
        className={isNav ? "w-full" : "grid gap-3 sm:grid-cols-[1fr_auto] items-end"}
      >
        <div className="w-full relative">
          {!isNav && (
            <div className="mb-2 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Search tutors
            </div>
          )}

          <div className="relative w-full">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none z-20" />

            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowDropdown(true); 
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder={placeholder}
              className={
                isNav 
                  ? "h-10 pl-9 sm:h-13 sm:pl-10 bg-background relative z-10" 
                  : "h-12 pl-10 bg-background relative z-10"
              }
              autoComplete="off" 
            />
            
            {showDropdown && query.trim() !== "" && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-xl z-50 overflow-hidden">
                <ul className="max-h-64 overflow-y-auto py-1">
                  {filteredSuggestions.map((suggestion) => (
                    <li 
                      key={suggestion}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-4 py-2.5 text-sm cursor-pointer hover:bg-muted flex items-center gap-2 text-foreground transition-colors"
                    >
                      <SearchIcon className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>
                        {suggestion.substring(0, suggestion.toLowerCase().indexOf(query.toLowerCase()))}
                        <span className="font-semibold text-violet-600 dark:text-violet-400">
                          {suggestion.substring(
                            suggestion.toLowerCase().indexOf(query.toLowerCase()),
                            suggestion.toLowerCase().indexOf(query.toLowerCase()) + query.length
                          )}
                        </span>
                        {suggestion.substring(suggestion.toLowerCase().indexOf(query.toLowerCase()) + query.length)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
    </div>
  );
}

export function SearchBar(props: SearchBarProps) {
  return (
    <Suspense 
      fallback={
        <div className={props.variant === "nav" ? "h-10 w-full bg-muted animate-pulse rounded-md" : "h-12 w-full bg-muted animate-pulse rounded-md"} />
      }
    >
      <SearchBarInner {...props} />
    </Suspense>
  );
}
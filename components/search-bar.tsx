// app/_components/search-bar.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchBarProps = {
  variant?: "full" | "nav";
};

export function SearchBar({ variant = "full" }: SearchBarProps) {
  const isNav = variant === "nav";

  const placeholder = isNav
    ? "Search tutors — e.g. Math, IELTS, Chemistry…"
    : "Try: Math, IELTS, Chemistry…";

  return (
    <div className={isNav ? "w-full" : "grid gap-3 sm:grid-cols-[1fr_auto]"}>
      <div className="w-full">
        {!isNav && (
          <div className="mb-2 text-[11px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            Search tutors
          </div>
        )}

        <div className={isNav ? "" : "sm:flex sm:items-center sm:gap-3"}>
          <Input
            placeholder={placeholder}
            className={[
              isNav ? "h-13" : "h-12",
              "bg-background",
            ].join(" ")}
          />

          {!isNav && (
            <Button
              variant="default"
              className="mt-3 h-12 w-full sm:mt-0 sm:w-auto"
            >
              Search
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

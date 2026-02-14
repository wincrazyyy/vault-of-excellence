// components/hero.tsx
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <div>
      <Badge variant="secondary">
        Curated tutors for students who expect premium outcomes
      </Badge>

      <div className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
        Vault of Excellence
      </div>

      <h1 className="mt-3 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Premium private tutoring,{" "}
        <span className="underline decoration-violet-200 dark:decoration-violet-500/40 decoration-4 underline-offset-4">
          tailored for you
        </span>
        .
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
        Curated tutors. Clear lesson plans. Consistent progress — for students
        who want high-quality support and real results.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Badge variant="secondary">Curated profiles</Badge>
        <Badge variant="secondary">Premium standards</Badge>
        <Badge variant="secondary">Online &amp; in-person</Badge>
      </div>
    </div>
  );
}

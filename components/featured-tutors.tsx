// components/featured-tutors.tsx
import Link from "next/link";

export function FeaturedTutors() {
  return (
    <div className="mt-4">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold text-foreground">
          Featured tutors
        </h1>
        <a
          href="#"
          className="text-sm text-foreground/80 hover:text-foreground hover:underline"
        >
          View all
        </a>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-3xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-violet-200/80 dark:bg-violet-500/20 ring-1 ring-border" />
              <div>
                <div className="text-sm font-semibold text-foreground">
                  Tutor Name {i}
                </div>
                <div className="text-xs text-muted-foreground">
                  Subject • Level
                </div>
              </div>
            </div>

            <p className="mt-3 text-sm text-muted-foreground">
              Short bio goes here. Calm, structured teaching with clear feedback.
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span className="rounded-full border border-violet-200/70 bg-violet-50/80 px-2.5 py-1 text-xs font-medium text-foreground dark:border-violet-500/30 dark:bg-violet-500/10">
                Online
              </span>
              <span className="rounded-full border border-border bg-muted px-2.5 py-1 text-xs font-medium text-foreground/80">
                4.9 ★
              </span>
            </div>

            <Link
              href={`/tutors/${i}`}
              className="mt-5 inline-flex h-10 w-full items-center justify-center rounded-2xl bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              View profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

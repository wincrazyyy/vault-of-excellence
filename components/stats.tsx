// components/stats.tsx
export function Stats() {
  const stats = [
    { k: "Students helped", v: "12,000+" },
    { k: "Verified tutors", v: "650+" },
    { k: "Average rating", v: "4.9 ★" },
    { k: "Reported improvement", v: "78%+" },
  ];

  return (
    <div className="mt-10 border-t border-border pt-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Results you can trust
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A premium marketplace built around quality, consistency, and outcomes.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.k}
            className="rounded-3xl border border-border bg-card p-6 shadow-sm"
          >
            <div className="text-xs text-muted-foreground">{s.k}</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              {s.v}
            </div>
            <div className="mt-3 h-1 w-16 rounded-full bg-violet-200 dark:bg-violet-500/30" />
          </div>
        ))}
      </div>

      <div className="mt-4 text-xs text-muted-foreground">
        Stats shown are placeholders for now — replace with real metrics when you
        connect your database.
      </div>
    </div>
  );
}

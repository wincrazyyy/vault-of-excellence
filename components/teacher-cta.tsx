// components/teacher-cta.tsx
export function TeacherCTA() {
  return (
    <div className="mt-10 rounded-3xl border border-violet-200/70 bg-violet-50/80 p-6 dark:border-violet-500/25 dark:bg-violet-500/10">
      <div className="text-xs font-medium text-foreground">For teachers</div>

      <div className="mt-1 text-lg font-semibold text-foreground">
        Teach on a premium marketplace
      </div>

      <p className="mt-2 text-sm text-muted-foreground">
        Create a profile, list subjects, and connect with students who value
        high-quality tutoring.
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <a
          href="/signup"
          className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Teacher sign up
        </a>

        <a
          href="/login"
          className="inline-flex h-10 items-center justify-center rounded-xl border border-border bg-background px-4 text-sm font-medium text-foreground hover:bg-muted"
        >
          Teacher log in
        </a>
      </div>
    </div>
  );
}

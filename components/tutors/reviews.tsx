import type { Tutor, Review } from "@/components/tutors/types";
import { InfoCard } from "./info-card";

export function Reviews({ tutor, reviews }: { tutor: Tutor; reviews: Review[] }) {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#050B1E]">
            {tutor.reviews.title}
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            {tutor.reviews.description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
          <button
            type="button"
            className={[
              "inline-flex h-10 shrink-0 items-center justify-center gap-2",
              "whitespace-nowrap rounded-xl border border-neutral-200 bg-white px-4",
              "text-sm font-medium leading-none text-[#050B1E]",
              "hover:bg-neutral-50",
              "focus:outline-none focus:ring-2 focus:ring-violet-200 focus:ring-offset-2",
            ].join(" ")}
          >
            View all
          </button>
          <button
            type="button"
            className={[
              "inline-flex h-10 shrink-0 items-center justify-center gap-2",
              "whitespace-nowrap rounded-xl bg-[#050B1E] px-5",
              "text-sm font-medium leading-none text-white",
              "hover:bg-[#07102D]",
              "focus:outline-none focus:ring-2 focus:ring-violet-200 focus:ring-offset-2",
            ].join(" ")}
          >
            Leave a review
          </button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {reviews.map((r) => (
          <InfoCard
            key={r.name}
            title={r.name}
            description={r.text}
            className="bg-neutral-50/70"
          />
        ))}
      </div>
    </section>
  );
}

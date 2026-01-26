import type { Tutor } from "../../app/tutors/[id]/page";
import { InfoCard } from "./info-card";

export function Stats({ tutor }: { tutor: Tutor }) {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
      <div>
        <h2 className="text-2xl font-semibold text-[#050B1E]">
          {tutor.stats.title}
        </h2>
        <p className="mt-1 text-sm text-neutral-600">{tutor.stats.description}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-4">
        {tutor.stats.data.map((s) => (
          <InfoCard
            key={s.k}
            title={s.k}
            value={s.v}
            variant="stat"
            className="min-w-45 flex-1"
          />
        ))}
      </div>
    </section>
  );
}

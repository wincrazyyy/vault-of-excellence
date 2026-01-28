import { Markdown } from "@/components/ui/markdown";
import { stripIndent } from "@/lib/ui/markdown";
import type { Tutor } from "../../app/tutors/[id]/page";

export function About({ tutor }: { tutor: Tutor }) {
  const md = stripIndent(tutor.about.description);

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#050B1E]">
            {tutor.about.title}
          </h1>
        </div>
      </div>

      {/* Markdown */}
      <Markdown content={md} className="mt-4" />


      {/* Subjects / Levels */}
      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-medium text-neutral-500">Subjects</div>
            <div className="text-xs text-neutral-500">{tutor.about.subjects.length} listed</div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {tutor.about.subjects.map((s) => (
              <span
                key={s}
                className="inline-flex items-center rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-[#050B1E] shadow-sm"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-medium text-neutral-500">Syllabuses</div>
            <div className="text-xs text-neutral-500">{tutor.about.syllabuses.length} listed</div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {tutor.about.syllabuses.map((l) => (
              <span
                key={l}
                className="inline-flex items-center rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700"
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

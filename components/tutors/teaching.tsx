import type { Tutor } from "@/components/tutors/types";
import { InfoCard } from "./info-card";

export function Teaching({ tutor }: { tutor: Tutor }) {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
      <div className="flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold text-[#050B1E]">
          {tutor.teaching.title}
        </h2>
        <div className="hidden text-xs text-neutral-500 sm:block">
          Quick overview
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <InfoCard
          title="Teaching style"
          description={tutor.teaching.teachingStyle}
          className="lg:row-span-2"
          markdown
        />
        <InfoCard
          title="Lesson format"
          description={tutor.teaching.lessonFormat}
        />
        <InfoCard
          title="Teaching language"
          description={tutor.teaching.teachingLanguage}
        />
      </div>
    </section>
  );
}

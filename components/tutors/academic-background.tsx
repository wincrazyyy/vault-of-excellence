import type { Tutor } from "@/components/tutors/types";
import { InfoCard } from "./info-card";

function educationToMarkdown(
  education: { school: string; degree: string; graduation: string }[]
) {
  return education
    .map((e) => `- **${e.school}** — ${e.degree} • ${e.graduation}`)
    .join("\n");
}

export function AcademicBackground({ tutor }: { tutor: Tutor }) {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-[#050B1E]">
        Academic background
      </h2>

      <div className="mt-5">
        <InfoCard
          title="Education"
          description={educationToMarkdown(tutor.academic.education)}
          markdown
        />
      </div>
    </section>
  );
}

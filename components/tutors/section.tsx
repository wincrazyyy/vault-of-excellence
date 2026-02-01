import type { SectionContent } from "@/components/tutors/types";
import { TipTapRenderer } from "@/components/rte/renderer";

export function Section({ content }: { content: SectionContent }) {

  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
    <TipTapRenderer content={content.rteContent} />
    </section>
  );
}

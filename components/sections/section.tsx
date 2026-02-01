import type { Section } from "@/lib/sections/types";
import { ModuleRenderer } from "./module-renderer";

type Props = {
  section: Section;
  className?: string;
};

export function SectionView({ section, className }: Props) {
  const hasBorder = section.border !== "none";

  return (
    <section
      className={[
        hasBorder ? "rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm" : "",
        className ?? "",
      ].join(" ")}
    >
      {section.title ? (
        <h2 className="mb-4 text-2xl font-semibold text-[#050B1E]">{section.title}</h2>
      ) : null}

      <div className="space-y-4">
        {section.modules.map((m, idx) => (
          <ModuleRenderer key={idx} module={m} />
        ))}
      </div>
    </section>
  );
}

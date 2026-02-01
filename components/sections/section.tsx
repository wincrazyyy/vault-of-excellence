import type { Section } from "@/lib/sections/types";
import { ModuleRenderer } from "./module-renderer";

type Props = {
  section: Section;
  className?: string;
};

export function SectionView({ section, className }: Props) {
  return (
    <section className={className}>
      {section.title ? (
        <h2 className="mb-3 text-lg font-semibold">{section.title}</h2>
      ) : null}

      <div className="space-y-4">
        {section.modules.map((m, idx) => (
          <ModuleRenderer key={idx} module={m} />
        ))}
      </div>
    </section>
  );
}

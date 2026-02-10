import type { Section } from "@/lib/tutors/sections/types";
import { ModuleRenderer } from "./module-renderer";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  section: Section;
  className?: string;
};

export function SectionView({ section, className }: Props) {
  const isBorderless = section.border === "none";

  const body = (
    <div className="space-y-4">
      {section.modules.map((m, idx) => (
        <ModuleRenderer key={idx} module={m} />
      ))}
    </div>
  );

  if (isBorderless) {
    return (
      <section className={className}>
        {body}
      </section>
    );
  }

  return (
    <section className={className}>
      <Card>
        <CardContent className="pt-6">
          {body}
        </CardContent>
      </Card>
    </section>
  );
}

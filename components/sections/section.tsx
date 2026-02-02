import type { Section } from "@/lib/sections/types";
import { ModuleRenderer } from "./module-renderer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
        {section.title ? (
          <h2 className="mb-4 text-xl font-semibold">{section.title}</h2>
        ) : null}
        {body}
      </section>
    );
  }

  return (
    <section className={className}>
      <Card>
        {section.title ? (
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">{section.title}</CardTitle>
          </CardHeader>
        ) : null}

        <CardContent className={section.title ? "" : "pt-6"}>
          {body}
        </CardContent>
      </Card>
    </section>
  );
}

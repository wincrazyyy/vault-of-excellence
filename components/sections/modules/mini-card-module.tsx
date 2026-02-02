import type { MiniCardModule } from "@/lib/sections/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TipTapRenderer } from "@/components/rte/renderer";

type Props = {
  module: MiniCardModule;
  className?: string;
};

export function MiniCardModuleView({ module, className }: Props) {
  const { title, variant = "neutral" } = module.content;

  const badgeClass =
    variant === "violet"
      ? "border-violet-200 bg-violet-50 text-foreground dark:border-violet-500/30 dark:bg-violet-500/15"
      : "border-border bg-muted text-foreground";

  return (
    <Card className={cn(className)}>
      <CardContent className="p-6">
        {/* mini title row */}
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-medium text-muted-foreground">{title}</div>

          {module.content.kind === "tags" ? (
            <div className="text-xs text-muted-foreground">
              {module.content.items.length} {module.content.countLabel ?? "listed"}
            </div>
          ) : null}
        </div>

        {/* body */}
        {module.content.kind === "tags" ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {module.content.items.map((item) => (
              <Badge key={item} variant="outline" className={cn(badgeClass)}>
                {item}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="mt-3">
            <TipTapRenderer content={module.content.doc} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

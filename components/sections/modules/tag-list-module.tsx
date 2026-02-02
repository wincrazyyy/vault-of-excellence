import type { TagListModule } from "@/lib/sections/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  module: TagListModule;
  className?: string;
};

export function TagListModuleView({ module, className }: Props) {
  const { title, items, variant = "neutral", countLabel = "listed" } = module.content;

  const badgeClass =
    variant === "violet"
      ? "border-violet-200 bg-violet-50 text-foreground dark:border-violet-500/30 dark:bg-violet-500/15"
      : "border-border bg-muted text-foreground";

  return (
    <Card className={cn(className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-medium text-muted-foreground">{title}</div>
          <div className="text-xs text-muted-foreground">
            {items.length} {countLabel}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {items.map((item) => (
            <Badge
              key={item}
              variant="outline"
              className={cn("shadow-sm", badgeClass)}
            >
              {item}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

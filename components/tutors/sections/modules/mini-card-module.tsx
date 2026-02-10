import type { MiniCardModule } from "@/lib/tutors/sections/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { TipTapRenderer } from "@/components/tiptap/renderer";

type Props = {
  module: MiniCardModule;
  className?: string;
};

export function MiniCardModuleView({ module, className }: Props) {
  const { title, variant = "neutral" } = module.content;
  const align = module.content.align ?? "left";

  const badgeClass =
    variant === "violet"
      ? "border-violet-200 bg-violet-50 text-foreground dark:border-violet-500/30 dark:bg-violet-500/15"
      : "border-border bg-muted text-foreground";

  const barClass =
    variant === "violet"
      ? "bg-violet-200/80 dark:bg-violet-500/20"
      : "bg-muted";

  return (
    <Card className={cn(className)}>
      <CardContent className={cn("p-6", align === "center" ? "text-center" : "")}>
        {/* mini title row */}
        <div
          className={cn(
            "flex items-center gap-3",
            align === "center" ? "justify-center" : "justify-between",
          )}
        >
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {title}
          </div>

          {module.content.kind === "tags" && align !== "center" ? (
            <div className="text-xs text-muted-foreground">
              {module.content.items.length} {module.content.countLabel ?? "listed"}
            </div>
          ) : null}
        </div>

        {/* body */}
        {module.content.kind === "tags" ? (
          <div className={cn("mt-3 flex flex-wrap gap-2", align === "center" ? "justify-center" : "")}>
            {module.content.items.map((item) => (
              <Badge key={item} variant="outline" className={cn(badgeClass)}>
                {item}
              </Badge>
            ))}
          </div>
        ) : module.content.kind === "rte" ? (
          <div className="mt-3">
            <TipTapRenderer content={module.content.doc} />
          </div>
        ) : (
          <div className="mt-2">
            <div className="text-2xl font-semibold tracking-tight text-foreground">
              {module.content.value}
            </div>

            <div
              className={cn(
                "mt-3 h-1 w-14 rounded-full",
                barClass,
                align === "center" ? "mx-auto" : "",
              )}
            />

            {module.content.helper ? (
              <div className="mt-3 text-xs text-muted-foreground">{module.content.helper}</div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

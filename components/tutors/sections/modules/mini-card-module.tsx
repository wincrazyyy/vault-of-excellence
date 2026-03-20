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
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className={cn("p-4 sm:p-6", align === "center" ? "text-center" : "")}>
        <div
          className={cn(
            "flex flex-wrap items-start sm:items-center gap-2 sm:gap-3",
            align === "center" ? "justify-center" : "justify-between",
          )}
        >
          <div className="text-[10px] sm:text-xs font-medium uppercase tracking-wider text-muted-foreground wrap-break-word max-w-full">
            {title}
          </div>

          {module.content.kind === "tags" && align !== "center" ? (
            <div className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
              {module.content.items.length} {module.content.countLabel ?? "listed"}
            </div>
          ) : null}
        </div>

        {module.content.kind === "tags" ? (
          <div className={cn("mt-3 flex flex-wrap gap-1.5 sm:gap-2", align === "center" ? "justify-center" : "")}>
            {module.content.items.map((item) => (
              <Badge key={item} variant="outline" className={cn("text-xs font-normal sm:font-medium", badgeClass)}>
                {item}
              </Badge>
            ))}
          </div>
        ) : module.content.kind === "rte" ? (
          <div className="mt-3 overflow-hidden text-sm sm:text-base wrap-break-word">
            <TipTapRenderer content={module.content.doc} />
          </div>
        ) : (
          <div className="mt-2 sm:mt-3">
            <div className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground wrap-break-word">
              {module.content.value}
            </div>

            <div
              className={cn(
                "mt-2 sm:mt-3 h-1 w-12 sm:w-14 rounded-full",
                barClass,
                align === "center" ? "mx-auto" : "",
              )}
            />

            {module.content.helper ? (
              <div className="mt-2 sm:mt-3 text-[11px] sm:text-xs text-muted-foreground wrap-break-word">
                {module.content.helper}
              </div>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

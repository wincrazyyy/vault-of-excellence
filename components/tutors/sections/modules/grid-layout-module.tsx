import type { GridLayoutModule } from "@/lib/tutors/sections/types";
import { cn } from "@/lib/utils";
import { ModuleRenderer } from "../module-renderer";

type Props = {
  module: GridLayoutModule;
  className?: string;
};

function gapClass(gap?: GridLayoutModule["content"]["gap"]) {
  switch (gap) {
    case "sm":
      return "gap-3";
    case "lg":
      return "gap-6";
    case "md":
    default:
      return "gap-4";
  }
}

export function GridLayoutModuleView({ module, className }: Props) {
  const { columns, gap, align, equalRowHeight, items } = module.content;
  const isEqual = equalRowHeight ?? true;

  return (
    <div
      className={cn(
        "grid grid-cols-1 justify-items-stretch",
        "md:grid-cols-(--md-cols) md:auto-rows-(--md-auto-rows) md:[align-items:var(--md-align)]",
        gapClass(gap),
        className
      )}
      style={{
        "--md-cols": `repeat(${Math.max(1, columns)}, minmax(0, 1fr))`,
        "--md-auto-rows": isEqual ? "minmax(0, 1fr)" : "minmax(min-content, auto)",
        "--md-align": align === "start" ? "start" : "stretch",
      } as React.CSSProperties}
    >
      {items.map((it) => {
        const colSpan = Math.max(1, it.placement.colSpan ?? 1);
        const rowSpan = Math.max(1, it.placement.rowSpan ?? 1);
        const colStart = Math.max(1, it.placement.colStart);

        const gridColumn = `${colStart} / span ${colSpan}`;
        const gridRow = it.placement.rowStart
          ? `${Math.max(1, it.placement.rowStart)} / span ${rowSpan}`
          : undefined;

        return (
          <div
            key={it.id}
            style={{
              "--md-col": gridColumn,
              ...(gridRow ? { "--md-row": gridRow } : {})
            } as React.CSSProperties}
            className={cn(
              "w-full h-full min-w-0 min-h-0 *:h-full",
              "md:col-(--md-col)",
              gridRow ? "md:row-(--md-row)" : ""
            )}
          >
            <ModuleRenderer module={it.module} />
          </div>
        );
      })}
    </div>
  );
}
import type { GridLayoutModule } from "@/lib/sections/types";
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
  const { columns, gap, align, items } = module.content;
  const equalRowHeight = true;

  return (
    <div
      className={cn(gapClass(gap), className)}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${Math.max(1, columns)}, minmax(0, 1fr))`,

        justifyItems: "stretch",
        alignItems: align === "start" ? "start" : "stretch",

        ...(equalRowHeight
          ? { gridAutoRows: "minmax(0, 1fr)" }
          : { gridAutoRows: "minmax(min-content, auto)" }),
      }}
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
            style={{ gridColumn, gridRow }}
            className={cn(
              "w-full h-full min-w-0 min-h-0",
              "*:h-full",
            )}
          >
            <ModuleRenderer module={it.module} />
          </div>
        );
      })}
    </div>
  );
}

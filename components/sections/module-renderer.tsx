import type { Module } from "@/lib/sections/types";
import { RteModuleView } from "./modules/rte-module";
import { TagListModuleView } from "./modules/tag-list-module";
import { ImageModuleView } from "./modules/image-module";
import { DividerModuleView } from "./modules/divider-module";
import { CalloutModuleView } from "./modules/callout-module";
import { GridLayoutModuleView } from "./modules/grid-layout-module";

export function ModuleRenderer({ module, className }: { module: Module; className?: string }) {
  switch (module.type) {
    case "rte":
      return <RteModuleView module={module} className={className} />;
    case "tagList":
      return <TagListModuleView module={module} className={className} />;
    case "image":
      return <ImageModuleView module={module} className={className} />;
    case "divider":
      return <DividerModuleView module={module} className={className} />;
    case "callout":
      return <CalloutModuleView module={module} className={className} />;
    case "grid":
      return <GridLayoutModuleView module={module} className={className} />;
    default:
      return null;
  }
}

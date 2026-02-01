import type { Module } from "@/lib/sections/types";
import { RteModuleView } from "./modules/rte-module";
import { ImageModuleView } from "./modules/image-module";
import { DividerModuleView } from "./modules/divider-module";
import { CalloutModuleView } from "./modules/callout-module";

type Props = {
  module: Module;
  className?: string;
};

export function ModuleRenderer({ module, className }: Props) {
  switch (module.type) {
    case "rte":
      return <RteModuleView module={module} className={className} />;
    case "image":
      return <ImageModuleView module={module} className={className} />;
    case "divider":
      return <DividerModuleView module={module} className={className} />;
    case "callout":
      return <CalloutModuleView module={module} className={className} />;
    default:
      return null;
  }
}

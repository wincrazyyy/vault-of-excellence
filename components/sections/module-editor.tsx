
import type { Module } from "@/lib/sections/types";
import { RteModuleEditor } from "./modules/edit/rte-editor";
import { MiniCardModuleEditor } from "./modules/edit/minicard-editor";
import { GridLayoutModuleEditor } from "./modules/edit/grid-layout-editor";

export function ModuleEditor({
  module,
  updateModule,
}: {
  module: Module;
  updateModule: (newModule: Module) => void;
}) {
  switch (module.type) {
    case "rte":
      return <RteModuleEditor module={module} updateModule={updateModule} />;
    case "miniCard":
      return <MiniCardModuleEditor module={module} updateModule={updateModule} />;
    case "grid":
      return (
        <GridLayoutModuleEditor module={module} updateModule={updateModule} />
      );
    case "image":
    case "divider":
      return (
        <div className="rounded-lg border bg-gray-100 px-4 py-3 text-sm text-gray-600">
          Editing for &quot;{module.type}&quot; modules is not yet implemented.
        </div>
      );
    default:
      return <div>Unknown module type</div>;
  }
}

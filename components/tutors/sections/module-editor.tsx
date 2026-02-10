import { Button } from "@/components/ui/button";
import { Minus } from "lucide-react";
import type { ImageModule, Module } from "@/lib/tutors/sections/types";
import { RteModuleEditor } from "./modules/edit/rte-editor";
import { MiniCardModuleEditor } from "./modules/edit/minicard-editor";
import { GridLayoutModuleEditor } from "./modules/edit/grid-layout-editor";
import { DividerModuleEditor } from "./modules/edit/divider-editor";
import { ImageModuleEditor } from "./modules/edit/image-editor";

export function ModuleEditor({
  module,
  updateModule,
  deleteModule,
}: {
  module: Module;
  updateModule: (newModule: Module) => void;
  deleteModule: () => void;
}) {
  const editor = () => {
    switch (module.type) {
      case "rte":
        return <RteModuleEditor module={module} updateModule={updateModule} />;
      case "miniCard":
        return <MiniCardModuleEditor module={module} updateModule={updateModule} />;
      case "grid":
        return <GridLayoutModuleEditor module={module} updateModule={updateModule} />;
      case "divider":
        return <DividerModuleEditor module={module} updateModule={updateModule} />;
      case "image":
        return (
          <ImageModuleEditor 
            module={module} 
            updateModule={(newModule) => updateModule(newModule as ImageModule)} 
          />
        );
      default:
        return <div>Unknown module type</div>;
    }
  };

  return (
    <div className="relative">
      <div className="absolute -top-2 -right-2 z-10">
        <Button
          variant="destructive"
          size="icon"
          className="h-6 w-6 rounded-full shadow-md"
          onClick={(e) => {
            e.stopPropagation();
            deleteModule();
          }}
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>
      {editor()}
    </div>
  );
}
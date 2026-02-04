// components/sections/modules/edit/grid-layout-editor.tsx
"use client";

import type { GridLayoutModule, Module } from "@/lib/sections/types";
import { ModuleEditor } from "../../module-editor";

export function GridLayoutModuleEditor({
  module,
  updateModule,
}: {
  module: GridLayoutModule;
  updateModule: (newModule: GridLayoutModule) => void;
}) {
  function updateGridItemModule(itemId: string, newModule: Module) {
    const newItems = module.content.items.map((item) => {
      if (item.id === itemId) {
        return { ...item, module: newModule };
      }
      return item;
    });

    updateModule({
      ...module,
      content: {
        ...module.content,
        items: newItems,
      },
    });
  }

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-2 text-sm font-medium text-gray-500">Grid Layout</h3>
      <div className="space-y-4">
        {module.content.items.map((item) => (
          <div key={item.id} className="rounded-md border bg-gray-50 p-4">
            <h4 className="mb-2 text-xs font-medium text-gray-400">
              Grid Item (Col: {item.placement.colStart}, Span: {item.placement.colSpan ?? 1})
            </h4>
            <ModuleEditor
              module={item.module}
              updateModule={(newModule) => updateGridItemModule(item.id, newModule)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

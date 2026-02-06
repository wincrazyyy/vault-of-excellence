"use client";

import type { GridLayoutModule, Module } from "@/lib/sections/types";
import { ModuleEditor } from "@/components/sections/module-editor";

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

  function deleteGridItemModule(itemId: string) {
    const newItems = module.content.items.filter((item) => item.id !== itemId);
    updateModule({
      ...module,
      content: {
        ...module.content,
        items: newItems,
      },
    });
  }

  return (
    <div className="rounded-lg border p-4 bg-gray-50/50">
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${module.content.columns}, 1fr)`,
          gap: module.content.gap === "sm" ? "0.5rem" : module.content.gap === "lg" ? "2rem" : "1rem",
          alignItems: module.content.equalRowHeight ? "stretch" : module.content.align,
        }}
      >
        {module.content.items.map((item) => (
          <div
            key={item.id}
            className="relative p-2"
            style={{
              gridColumn: `${item.placement.colStart} / span ${item.placement.colSpan ?? 1}`,
              gridRow: item.placement.rowStart
                ? `${item.placement.rowStart} / span ${item.placement.rowSpan ?? 1}`
                : undefined,
            }}
          >
            <ModuleEditor
              module={item.module}
              updateModule={(newModule) => updateGridItemModule(item.id, newModule)}
              deleteModule={() => deleteGridItemModule(item.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
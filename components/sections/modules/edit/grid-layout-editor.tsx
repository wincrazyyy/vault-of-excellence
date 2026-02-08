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
    <div className="rounded-lg border bg-gray-50/50 overflow-hidden">
      <div className="px-4 py-2 border-b bg-white/50">
        <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Grid Layout ({module.content.columns} Columns)
        </h3>
      </div>

      <div
        className="grid border-t border-l border-dashed border-gray-300" 
        style={{
          gridTemplateColumns: `repeat(${module.content.columns}, 1fr)`,
          gap: 0, 
          alignItems: module.content.equalRowHeight ? "stretch" : module.content.align,
        }}
      >
        {module.content.items.map((item) => (
          <div
            key={item.id}
            className="relative p-4 border-r border-b border-dashed border-gray-300 bg-white/30 hover:bg-white/60 transition-colors"
            style={{
              gridColumn: `${item.placement.colStart} / span ${item.placement.colSpan ?? 1}`,
              gridRow: item.placement.rowStart
                ? `${item.placement.rowStart} / span ${item.placement.rowSpan ?? 1}`
                : undefined,
            }}
          >
            <div className="absolute top-1 left-2 text-[10px] text-gray-400 font-mono pointer-events-none">
              Col {item.placement.colStart}
            </div>

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
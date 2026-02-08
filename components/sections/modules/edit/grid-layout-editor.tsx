"use client";

import type { GridLayoutItem, GridLayoutModule, Module } from "@/lib/sections/types";
import { ModuleEditor } from "@/components/sections/module-editor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Grid3X3 } from "lucide-react";

export function GridLayoutModuleEditor({
  module,
  updateModule,
}: {
  module: GridLayoutModule;
  updateModule: (newModule: GridLayoutModule) => void;
}) {
  const { content } = module;

  function handleColChange(val: string) {
    const columns = Math.max(1, parseInt(val) || 1);
    updateModule({
      ...module,
      content: { ...content, columns },
    });
  }

  function addGridItem() {
    const newItem: GridLayoutItem = {
      id: `grid-item-${Date.now()}`,
      placement: {
        colStart: 1,
        colSpan: 1,
      },
      module: {
        id: `mod-${Date.now()}`,
        type: "rte",
        content: { doc: { type: "doc", content: [] } },
      } as Module,
    };

    updateModule({
      ...module,
      content: {
        ...content,
        items: [...content.items, newItem],
      },
    });
  }

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
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="grid-cols" className="text-xs font-bold uppercase tracking-wider">
              Columns
            </Label>
            <Input
              id="grid-cols"
              type="number"
              value={content.columns}
              onChange={(e) => handleColChange(e.target.value)}
              className="h-8 w-16 text-center"
              min="1"
              max="12"
            />
          </div>
        </div>

        <Button size="sm" variant="outline" onClick={addGridItem} className="gap-2">
          <Plus className="h-3.5 w-3.5" />
          Add Grid Item
        </Button>
      </div>

      <div
        className="grid border-l border-t border-dashed border-gray-300"
        style={{
          gridTemplateColumns: `repeat(${content.columns}, 1fr)`,
          gap: 0,
          alignItems: content.equalRowHeight ? "stretch" : content.align,
        }}
      >
        {content.items.map((item) => (
          <div
            key={item.id}
            className="relative p-4 border-b border-r border-dashed border-gray-300 bg-white/30 hover:bg-white/60 transition-colors"
            style={{
              gridColumn: `${item.placement.colStart} / span ${item.placement.colSpan ?? 1}`,
              gridRow: item.placement.rowStart
                ? `${item.placement.rowStart} / span ${item.placement.rowSpan ?? 1}`
                : undefined,
            }}
          >
            {/* instead of this */}
            <div className="absolute top-2 right-2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
               {/* You could add col-span controls here later */}
            </div>

            <ModuleEditor
              module={item.module}
              updateModule={(newMod) => updateGridItemModule(item.id, newMod)}
              deleteModule={() => deleteGridItemModule(item.id)}
            />
          </div>
        ))}

        {content.items.length === 0 && (
          <div className="col-span-full p-8 text-center text-sm text-muted-foreground italic">
            Grid is empty. Click "Add Grid Item" to start.
          </div>
        )}
      </div>
    </div>
  );
}
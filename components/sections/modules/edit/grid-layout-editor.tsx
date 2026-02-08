"use client";

import { useState, useRef } from "react";
import type { GridLayoutItem, GridLayoutModule, Module } from "@/lib/sections/types";
import { ModuleEditor } from "@/components/sections/module-editor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Grid3X3 } from "lucide-react";
import { cn } from "@/lib/utils";

export function GridLayoutModuleEditor({
  module,
  updateModule,
}: {
  module: GridLayoutModule;
  updateModule: (newModule: GridLayoutModule) => void;
}) {
  const { content } = module;
  const gridRef = useRef<HTMLDivElement>(null);

  // Track the ID of the item being resized (the "Left" item)
  const [resizingId, setResizingId] = useState<string | null>(null);

  function handleMouseDown(e: React.MouseEvent, leftItem: GridLayoutItem) {
    e.preventDefault();
    e.stopPropagation();

    // 1. Identify the "Right" neighbor
    const leftItemEnd = leftItem.placement.colStart + (leftItem.placement.colSpan ?? 1);
    const rightItem = content.items.find((i) => i.placement.colStart === leftItemEnd);

    // If no neighbor exists, we cannot resize. Stop here.
    if (!rightItem) return;

    const startX = e.pageX;
    const leftStartSpan = leftItem.placement.colSpan ?? 1;
    const rightStartSpan = rightItem.placement.colSpan ?? 1;
    // We don't use rightStartCol here, we calculate it dynamically

    // Total span must remain constant
    const totalSpan = leftStartSpan + rightStartSpan;

    if (!gridRef.current) return;
    const gridRect = gridRef.current.getBoundingClientRect();
    const colWidth = gridRect.width / content.columns;

    setResizingId(leftItem.id);

    function onMouseMove(moveEvent: MouseEvent) {
      // TypeScript safety: We know rightItem exists because of the check above,
      // but inside this closure, we ensure it's treated as defined.
      if (!rightItem) return; 

      const currentX = moveEvent.pageX;
      const diffX = currentX - startX;
      
      const colsMoved = Math.round(diffX / colWidth);
      
      let newLeftSpan = leftStartSpan + colsMoved;

      // Constraints
      newLeftSpan = Math.max(1, Math.min(newLeftSpan, totalSpan - 1));

      // Calculate Right Span
      const newRightSpan = totalSpan - newLeftSpan;

      // Calculate Right Start (Left Start + Left Width)
      const newRightStart = leftItem.placement.colStart + newLeftSpan;

      if (newLeftSpan !== (leftItem.placement.colSpan ?? 1)) {
        updateAdjacentItems(leftItem.id, newLeftSpan, rightItem.id, newRightStart, newRightSpan);
      }
    }

    function onMouseUp() {
      setResizingId(null);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  function updateAdjacentItems(
    leftId: string, 
    leftSpan: number, 
    rightId: string, 
    rightStart: number, 
    rightSpan: number
  ) {
    const newItems = content.items.map((item) => {
      // Update Left Item
      if (item.id === leftId) {
        return {
          ...item,
          placement: { ...item.placement, colSpan: leftSpan },
        };
      }
      // Update Right Item
      if (item.id === rightId) {
        return {
          ...item,
          placement: { ...item.placement, colStart: rightStart, colSpan: rightSpan },
        };
      }
      return item;
    });

    updateModule({
      ...module,
      content: { ...content, items: newItems },
    });
  }

  // --- Standard Helpers ---
  function handleColChange(val: string) {
    const columns = Math.max(1, parseInt(val) || 1);
    updateModule({ ...module, content: { ...content, columns } });
  }

  function addGridItem() {
    // Basic logic: Add to the end, or find the first gap. 
    // For simplicity, just appending to row 1, col 1 (overlapping).
    // In a real app, you'd calculate the next free slot.
    const newItem: GridLayoutItem = {
      id: `grid-item-${Date.now()}`,
      placement: { colStart: 1, colSpan: 1 },
      module: {
        id: `mod-${Date.now()}`,
        type: "rte",
        content: { doc: { type: "doc", content: [] } },
      } as Module,
    };
    updateModule({ ...module, content: { ...content, items: [...content.items, newItem] } });
  }

  function updateGridItemModule(itemId: string, newModule: Module) {
    const newItems = module.content.items.map((item) =>
      item.id === itemId ? { ...item, module: newModule } : item
    );
    updateModule({ ...module, content: { ...module.content, items: newItems } });
  }

  function deleteGridItemModule(itemId: string) {
    const newItems = module.content.items.filter((item) => item.id !== itemId);
    updateModule({ ...module, content: { ...module.content, items: newItems } });
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
        ref={gridRef}
        className="grid border-l border-t border-dashed border-gray-300 select-none"
        style={{
          gridTemplateColumns: `repeat(${content.columns}, 1fr)`,
          gap: 0,
          alignItems: content.equalRowHeight ? "stretch" : content.align,
        }}
      >
        {content.items.map((item) => {
            // Check if this item HAS a neighbor to the right.
            // If not, we don't render the resize handle.
            const itemEnd = item.placement.colStart + (item.placement.colSpan ?? 1);
            const hasRightNeighbor = content.items.some(i => i.placement.colStart === itemEnd);

            return (
              <div
                key={item.id}
                className={cn(
                  "relative p-4 border-b border-r border-dashed border-gray-300 transition-colors",
                  resizingId === item.id 
                    ? "bg-blue-50/50 ring-2 ring-blue-400 ring-inset z-20" 
                    : "bg-white/30 hover:bg-white/60"
                )}
                style={{
                  gridColumn: `${item.placement.colStart} / span ${item.placement.colSpan ?? 1}`,
                  gridRow: item.placement.rowStart
                    ? `${item.placement.rowStart} / span ${item.placement.rowSpan ?? 1}`
                    : undefined,
                }}
              >
                {/* Only show the drag handle if there is actually a neighbor to resize against.
                */}
                {hasRightNeighbor && (
                  <div 
                    className={cn(
                      "absolute top-0 bottom-0 -right-1.5 w-3 z-30 cursor-col-resize flex items-center justify-center group/handle",
                    )}
                    onMouseDown={(e) => handleMouseDown(e, item)}
                  >
                    <div className={cn(
                      "h-full w-[1px] bg-transparent group-hover/handle:bg-blue-400 transition-colors",
                      resizingId === item.id && "bg-blue-600 w-[2px]"
                    )} />
                  </div>
                )}

                {resizingId === item.id && (
                  <div className="absolute top-2 right-2 z-40 text-[10px] bg-blue-600 text-white px-1.5 py-0.5 rounded shadow-sm">
                    {item.placement.colSpan} col
                  </div>
                )}

                <ModuleEditor
                  module={item.module}
                  updateModule={(newMod) => updateGridItemModule(item.id, newMod)}
                  deleteModule={() => deleteGridItemModule(item.id)}
                />
              </div>
            );
        })}

        {content.items.length === 0 && (
          <div className="col-span-full p-8 text-center text-sm text-muted-foreground italic">
            Grid is empty. Click "Add Grid Item" to start.
          </div>
        )}
      </div>
    </div>
  );
}
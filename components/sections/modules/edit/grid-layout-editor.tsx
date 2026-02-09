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

  const [resizingId, setResizingId] = useState<string | null>(null);

  function addGridItem() {
    const occupied = new Set<string>();
    let maxRow = 0;

    content.items.forEach((item) => {
      const r = item.placement.rowStart ?? 1;
      const cStart = item.placement.colStart;
      const span = item.placement.colSpan ?? 1;

      if (r > maxRow) maxRow = r;

      for (let i = 0; i < span; i++) {
        occupied.add(`${r}-${cStart + i}`);
      }
    });

    let targetRow = 1;
    let targetCol = 1;
    let found = false;

    for (let r = 1; r <= maxRow + 1; r++) {
      for (let c = 1; c <= content.columns; c++) {
        if (!occupied.has(`${r}-${c}`)) {
          targetRow = r;
          targetCol = c;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    const newItem: GridLayoutItem = {
      id: `grid-item-${Date.now()}`,
      placement: { 
        colStart: targetCol, 
        colSpan: 1,
        rowStart: targetRow 
      },
      module: {
        id: `mod-${Date.now()}`,
        type: "rte",
        content: { doc: { type: "doc", content: [] } },
      } as Module,
    };

    updateModule({ ...module, content: { ...content, items: [...content.items, newItem] } });
  }

  function handleColChange(val: string) {
    const newColCount = Math.max(1, parseInt(val) || 1);
    const oldColCount = content.columns;

    if (newColCount >= oldColCount) {
      updateModule({ ...module, content: { ...content, columns: newColCount } });
      return;
    }

    let currentItems = [...content.items];

    for (let c = oldColCount; c > newColCount; c--) {
      const targetMaxCol = c - 1;
      const rows = new Set(currentItems.map((i) => i.placement.rowStart ?? 1));

      rows.forEach((rowNum) => {
        const rowItems = currentItems.filter((i) => (i.placement.rowStart ?? 1) === rowNum);
        const rowEnd = Math.max(
          ...rowItems.map((i) => i.placement.colStart + (i.placement.colSpan ?? 1) - 1)
        );

        if (rowEnd <= targetMaxCol) return;

        const shrinkableItems = rowItems.filter((i) => (i.placement.colSpan ?? 1) > 1);

        if (shrinkableItems.length > 0) {
          shrinkableItems.sort((a, b) => {
            const spanA = a.placement.colSpan ?? 1;
            const spanB = b.placement.colSpan ?? 1;
            if (spanA !== spanB) return spanB - spanA;
            return b.placement.colStart - a.placement.colStart;
          });

          const targetToShrink = shrinkableItems[0];
          const newSpan = (targetToShrink.placement.colSpan ?? 1) - 1;

          currentItems = currentItems.map((item) => {
            if (item.id === targetToShrink.id) {
              return {
                ...item,
                placement: { ...item.placement, colSpan: newSpan },
              };
            }
            if (
              (item.placement.rowStart ?? 1) === rowNum &&
              item.placement.colStart > targetToShrink.placement.colStart
            ) {
              return {
                ...item,
                placement: { ...item.placement, colStart: item.placement.colStart - 1 },
              };
            }
            return item;
          });
        } else {
          const targetToDelete = rowItems.sort(
            (a, b) => b.placement.colStart - a.placement.colStart
          )[0];

          if (targetToDelete) {
             currentItems = currentItems.filter((i) => i.id !== targetToDelete.id);
          }
        }
      });
    }

    updateModule({
      ...module,
      content: { ...content, columns: newColCount, items: currentItems },
    });
  }

  function handleMouseDown(e: React.MouseEvent, leftItem: GridLayoutItem) {
    e.preventDefault();
    e.stopPropagation();

    const leftItemEnd = leftItem.placement.colStart + (leftItem.placement.colSpan ?? 1);
    const rightItem = content.items.find((i) => i.placement.colStart === leftItemEnd);

    if (!rightItem) return;

    const startX = e.pageX;
    const leftStartSpan = leftItem.placement.colSpan ?? 1;
    const rightStartSpan = rightItem.placement.colSpan ?? 1;
    const totalSpan = leftStartSpan + rightStartSpan;

    if (!gridRef.current) return;
    const gridRect = gridRef.current.getBoundingClientRect();
    const colWidth = gridRect.width / content.columns;

    setResizingId(leftItem.id);

    function onMouseMove(moveEvent: MouseEvent) {
      if (!rightItem) return;

      const currentX = moveEvent.pageX;
      const diffX = currentX - startX;
      
      const colsMoved = Math.round(diffX / colWidth);
      
      let newLeftSpan = leftStartSpan + colsMoved;
      newLeftSpan = Math.max(1, Math.min(newLeftSpan, totalSpan - 1));

      const newRightSpan = totalSpan - newLeftSpan;
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
      if (item.id === leftId) {
        return { ...item, placement: { ...item.placement, colSpan: leftSpan } };
      }
      if (item.id === rightId) {
        return { ...item, placement: { ...item.placement, colStart: rightStart, colSpan: rightSpan } };
      }
      return item;
    });

    updateModule({ ...module, content: { ...content, items: newItems } });
  }

  function deleteGridItemModule(itemId: string) {
    const targetItem = content.items.find((i) => i.id === itemId);
    if (!targetItem) return;

    const targetStart = targetItem.placement.colStart;
    const targetSpan = targetItem.placement.colSpan ?? 1;
    const targetEnd = targetStart + targetSpan;

    const leftNeighbor = content.items.find(
      (i) => i.placement.colStart + (i.placement.colSpan ?? 1) === targetStart
    );

    if (leftNeighbor) {
      const newItems = content.items
        .filter((i) => i.id !== itemId)
        .map((i) => {
          if (i.id === leftNeighbor.id) {
            return {
              ...i,
              placement: {
                ...i.placement,
                colSpan: (i.placement.colSpan ?? 1) + targetSpan,
              },
            };
          }
          return i;
        });
      updateModule({ ...module, content: { ...content, items: newItems } });
      return;
    }

    const rightNeighbor = content.items.find(
      (i) => i.placement.colStart === targetEnd
    );

    if (rightNeighbor) {
      const newItems = content.items
        .filter((i) => i.id !== itemId)
        .map((i) => {
          if (i.id === rightNeighbor.id) {
            return {
              ...i,
              placement: {
                ...i.placement,
                colStart: targetStart,
                colSpan: (i.placement.colSpan ?? 1) + targetSpan,
              },
            };
          }
          return i;
        });
      updateModule({ ...module, content: { ...content, items: newItems } });
      return;
    }

    const newItems = content.items.filter((item) => item.id !== itemId);
    updateModule({ ...module, content: { ...content, items: newItems } });
  }

  function updateGridItemModule(itemId: string, newModule: Module) {
    const newItems = module.content.items.map((item) =>
      item.id === itemId ? { ...item, module: newModule } : item
    );
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
                {hasRightNeighbor && (
                  <div 
                    className={cn(
                      "absolute top-0 bottom-0 -right-1.5 w-3 z-30 cursor-col-resize flex items-center justify-center group/handle",
                    )}
                    onMouseDown={(e) => handleMouseDown(e, item)}
                  >
                    <div className={cn(
                      "h-full w-px bg-transparent group-hover/handle:bg-blue-400 transition-colors",
                      resizingId === item.id && "bg-blue-600 w-0.5"
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
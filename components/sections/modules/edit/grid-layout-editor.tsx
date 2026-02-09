"use client";

import { useState, useRef } from "react";
import type { GridLayoutItem, GridLayoutModule, Module } from "@/lib/sections/types";
import { ModuleEditor } from "@/components/sections/module-editor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Grid3X3, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: { distance: 5 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function repackItems(items: GridLayoutItem[], cols: number): GridLayoutItem[] {
    const packedItems: GridLayoutItem[] = [];
    const occupied = new Set<string>(); // Format: "row-col"

    let maxRow = 0;

    for (const item of items) {
      const span = item.placement.colSpan ?? 1;

      const actualSpan = Math.min(span, cols);
      
      let placed = false;
      let r = 1;

      while (!placed) {
        for (let c = 1; c <= cols; c++) {
          if (c + actualSpan - 1 > cols) continue;

          let fits = true;
          for (let i = 0; i < actualSpan; i++) {
            if (occupied.has(`${r}-${c + i}`)) {
              fits = false;
              break;
            }
          }

          if (fits) {
            for (let i = 0; i < actualSpan; i++) {
                occupied.add(`${r}-${c + i}`);
            }
            if (r > maxRow) maxRow = r;

            packedItems.push({
              ...item,
              placement: {
                colStart: c,
                rowStart: r,
                colSpan: actualSpan
              }
            });
            placed = true;
            break;
          }
        }
        r++;
        if (r > 100) break;
      }
    }
    return packedItems;
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = content.items.findIndex((i) => i.id === active.id);
      const newIndex = content.items.findIndex((i) => i.id === over.id);

      const reorderedItems = arrayMove(content.items, oldIndex, newIndex);

      const repackedItems = repackItems(reorderedItems, content.columns);

      updateModule({
        ...module,
        content: { ...content, items: repackedItems },
      });
    }
  }

  function handleColChange(val: string) {
    const newColCount = Math.max(1, parseInt(val) || 1);
    const repacked = repackItems(content.items, newColCount);
    
    updateModule({ 
        ...module, 
        content: { ...content, columns: newColCount, items: repacked } 
    });
  }

  function addGridItem() {
    const newItem: GridLayoutItem = {
      id: `grid-item-${Date.now()}`,
      placement: { colStart: 1, colSpan: 1 },
      module: {
        id: `mod-${Date.now()}`,
        type: "rte",
        content: { doc: { type: "doc", content: [] } },
      } as Module,
    };

    // Add to end and Repack
    const newItems = [...content.items, newItem];
    const repacked = repackItems(newItems, content.columns);

    updateModule({ ...module, content: { ...content, items: repacked } });
  }

  function handleMouseDown(e: React.MouseEvent, leftItem: GridLayoutItem) {
    e.preventDefault();
    e.stopPropagation();

    const leftItemEnd = leftItem.placement.colStart + (leftItem.placement.colSpan ?? 1);
    const rightItem = content.items.find((i) => i.placement.colStart === leftItemEnd && i.placement.rowStart === leftItem.placement.rowStart);
    
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
      const colsMoved = Math.round((currentX - startX) / colWidth);
      
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

  function updateAdjacentItems(lId: string, lSpan: number, rId: string, rStart: number, rSpan: number) {
      const newItems = content.items.map(i => {
          if(i.id === lId) return { ...i, placement: { ...i.placement, colSpan: lSpan }};
          if(i.id === rId) return { ...i, placement: { ...i.placement, colStart: rStart, colSpan: rSpan }};
          return i;
      });
      updateModule({...module, content: { ...content, items: newItems }});
  }

  function updateGridItemModule(itemId: string, newModule: Module) {
    const newItems = module.content.items.map((item) =>
      item.id === itemId ? { ...item, module: newModule } : item
    );
    updateModule({ ...module, content: { ...module.content, items: newItems } });
  }

  function deleteGridItemModule(itemId: string) {
    const filtered = content.items.filter((item) => item.id !== itemId);
    const repacked = repackItems(filtered, content.columns);
    updateModule({ ...module, content: { ...content, items: repacked } });
  }

  return (
    <div className="rounded-lg border bg-gray-50/50 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="grid-cols" className="text-xs font-bold uppercase tracking-wider">Columns</Label>
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
          <Plus className="h-3.5 w-3.5" /> Add Grid Item
        </Button>
      </div>

      <DndContext 
        id={`grid-dnd-${module.id}`}
        sensors={sensors} 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <div
            ref={gridRef}
            className="grid border-l border-t border-dashed border-gray-300 select-none"
            style={{
            gridTemplateColumns: `repeat(${content.columns}, 1fr)`,
            gap: 0,
            alignItems: content.equalRowHeight ? "stretch" : content.align,
            }}
        >
            <SortableContext 
                items={content.items.map(i => i.id)} 
                strategy={rectSortingStrategy}
            >
                {content.items.map((item) => {
                    const itemEnd = item.placement.colStart + (item.placement.colSpan ?? 1);
                    const hasRightNeighbor = content.items.some(i => 
                        i.placement.colStart === itemEnd && 
                        i.placement.rowStart === item.placement.rowStart
                    );

                    return (
                        <SortableGridItem
                            key={item.id}
                            item={item}
                            resizingId={resizingId}
                            hasRightNeighbor={hasRightNeighbor}
                            onResizeStart={(e) => handleMouseDown(e, item)}
                        >
                            <ModuleEditor
                                module={item.module}
                                updateModule={(newMod) => updateGridItemModule(item.id, newMod)}
                                deleteModule={() => deleteGridItemModule(item.id)}
                            />
                        </SortableGridItem>
                    );
                })}
            </SortableContext>

            {content.items.length === 0 && (
            <div className="col-span-full p-8 text-center text-sm text-muted-foreground italic">
                Grid is empty. Click "Add Grid Item" to start.
            </div>
            )}
        </div>
      </DndContext>
    </div>
  );
}

function SortableGridItem({
    item,
    children,
    resizingId,
    hasRightNeighbor,
    onResizeStart
}: {
    item: GridLayoutItem;
    children: React.ReactNode;
    resizingId: string | null;
    hasRightNeighbor: boolean;
    onResizeStart: (e: React.MouseEvent) => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        gridColumn: `${item.placement.colStart} / span ${item.placement.colSpan ?? 1}`,
        gridRow: item.placement.rowStart ? `${item.placement.rowStart} / span ${item.placement.rowSpan ?? 1}` : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group/item relative p-4 border-b border-r border-dashed border-gray-300 transition-colors bg-white/30",
                isDragging ? "opacity-50 bg-blue-50" : "hover:bg-white/60",
                resizingId === item.id && "bg-blue-50/50 ring-2 ring-blue-400 ring-inset z-20"
            )}
        >
            <div
                {...attributes}
                {...listeners}
                className="absolute top-1 left-1 z-30 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200 opacity-0 group-hover/item:opacity-100 transition-opacity"
            >
                <GripVertical className="h-3 w-3 text-gray-400" />
            </div>

            {hasRightNeighbor && (
                <div 
                    className="absolute top-0 bottom-0 -right-1.5 w-3 z-30 cursor-col-resize flex items-center justify-center group/handle"
                    onMouseDown={onResizeStart}
                    onPointerDown={(e) => e.stopPropagation()} 
                >
                    <div className={cn(
                        "h-full w-px bg-transparent group-hover/handle:bg-blue-400 transition-colors",
                        resizingId === item.id && "bg-blue-600 w-0.5"
                    )} />
                </div>
            )}

            {children}
        </div>
    );
}
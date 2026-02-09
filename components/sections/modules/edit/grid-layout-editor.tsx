"use client";

import { useState, useRef } from "react";
import type { GridLayoutItem, GridLayoutModule, Module } from "@/lib/sections/types";
import { ModuleEditor } from "@/components/sections/module-editor";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Grid3X3, GripVertical, ArrowDownToLine } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  useDroppable,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DropAnimation
} from "@dnd-kit/core";
import {
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
  const [activeItem, setActiveItem] = useState<GridLayoutItem | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: { distance: 5 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  function getOccupiedCells(items: GridLayoutItem[]) {
    const occupied = new Set<string>();
    items.forEach(item => {
        const r = item.placement.rowStart ?? 1;
        const c = item.placement.colStart;
        const span = item.placement.colSpan ?? 1;
        for(let i=0; i<span; i++) occupied.add(`${r}-${c+i}`);
    });
    return occupied;
  }

  function getMaxRow(items: GridLayoutItem[]) {
      let max = 0;
      items.forEach(i => {
          const bottom = (i.placement.rowStart ?? 1) + (i.placement.rowSpan ?? 1) - 1;
          if (bottom > max) max = bottom;
      });
      return max;
  }

  function handleDragStart(event: DragStartEvent) {
    const item = content.items.find((i) => i.id === event.active.id);
    if (item) setActiveItem(item);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    if (over.id === "grid-bottom-drop-zone") {
        const activeItem = content.items.find(i => i.id === active.id);
        if (!activeItem) return;

        const maxRow = getMaxRow(content.items);
        
        const updatedItems = content.items.map(i => {
            if (i.id === active.id) {
                return {
                    ...i,
                    placement: {
                        ...i.placement,
                        rowStart: maxRow + 1,
                        colStart: 1,
                    }
                };
            }
            return i;
        });

        updateModule({ ...module, content: { ...content, items: updatedItems } });
        return;
    }

    if (active.id !== over.id) {
      const activeIdx = content.items.findIndex(i => i.id === active.id);
      const overIdx = content.items.findIndex(i => i.id === over.id);
      
      if (activeIdx === -1 || overIdx === -1) return;

      const activeItem = content.items[activeIdx];
      const overItem = content.items[overIdx];

      const newItems = [...content.items];
      
      newItems[activeIdx] = {
          ...activeItem,
          placement: { ...overItem.placement }
      };
      
      newItems[overIdx] = {
          ...overItem,
          placement: { ...activeItem.placement }
      };

      updateModule({
        ...module,
        content: { ...content, items: newItems },
      });
    }
  }

  function handleColChange(val: string) {
    const newColCount = Math.max(1, parseInt(val) || 1);

    const updatedItems = content.items.map(item => {
        let newCol = item.placement.colStart;
        let newSpan = item.placement.colSpan ?? 1;

        if (newCol > newColCount) {
            newCol = newColCount; 
            newSpan = 1;
        }
        else if (newCol + newSpan - 1 > newColCount) {
            newSpan = (newColCount - newCol) + 1;
        }

        return {
            ...item,
            placement: { ...item.placement, colStart: newCol, colSpan: newSpan }
        };
    });

    updateModule({ 
        ...module, 
        content: { ...content, columns: newColCount, items: updatedItems } 
    });
  }

  function addGridItem() {
    const occupied = getOccupiedCells(content.items);
    const maxRow = getMaxRow(content.items);

    let found = false;
    let targetR = 1;
    let targetC = 1;

    for(let r=1; r<=maxRow; r++) {
        for(let c=1; c<=content.columns; c++) {
            if(!occupied.has(`${r}-${c}`)) {
                targetR = r;
                targetC = c;
                found = true;
                break;
            }
        }
        if(found) break;
    }

    if (!found) {
        targetR = maxRow + 1;
        targetC = 1;
    }

    const newItem: GridLayoutItem = {
      id: `grid-item-${Date.now()}`,
      placement: { colStart: targetC, rowStart: targetR, colSpan: 1 },
      module: { id: `mod-${Date.now()}`, type: "rte", content: { doc: { type: "doc", content: [] } } } as Module,
    };

    updateModule({ ...module, content: { ...content, items: [...content.items, newItem] } });
  }

  function deleteGridItemModule(itemId: string) {
    const newItems = content.items.filter((item) => item.id !== itemId);
    updateModule({ ...module, content: { ...content, items: newItems } });
  }

  function handleMouseDown(e: React.MouseEvent, leftItem: GridLayoutItem) {
    e.preventDefault();
    e.stopPropagation();

    const row = leftItem.placement.rowStart ?? 1;
    const leftStart = leftItem.placement.colStart;
    const leftStartSpan = leftItem.placement.colSpan ?? 1;
    const leftItemEnd = leftStart + leftStartSpan;

    const rightItem = content.items.find((i) => 
        i.placement.colStart === leftItemEnd && 
        i.placement.rowStart === row
    );

    let wallColumn = content.columns + 1;
    const searchStart = rightItem 
        ? rightItem.placement.colStart + (rightItem.placement.colSpan ?? 1) 
        : leftItemEnd;

    const blockingItem = content.items
        .filter(i => (i.placement.rowStart ?? 1) === row && i.placement.colStart >= searchStart)
        .sort((a,b) => a.placement.colStart - b.placement.colStart)[0];

    if (blockingItem) {
        wallColumn = blockingItem.placement.colStart;
    }

    const rightStartSpan = rightItem ? (rightItem.placement.colSpan ?? 1) : 0;
    const startX = e.pageX;
    if (!gridRef.current) return;
    const gridRect = gridRef.current.getBoundingClientRect();
    const colWidth = gridRect.width / content.columns;

    setResizingId(leftItem.id);

    function onMouseMove(moveEvent: MouseEvent) {
      const currentX = moveEvent.pageX;
      const colsMoved = Math.round((currentX - startX) / colWidth);
      let newLeftSpan = leftStartSpan + colsMoved;
      newLeftSpan = Math.max(1, newLeftSpan);

      if (!rightItem) {
          const maxLeftSpan = wallColumn - leftStart;
          newLeftSpan = Math.min(newLeftSpan, maxLeftSpan);
          if (newLeftSpan !== (leftItem.placement.colSpan ?? 1)) {
              updateSingleItem(leftItem.id, newLeftSpan);
          }
      } else {
          const absoluteMaxLeft = (wallColumn - leftStart) - 1;
          newLeftSpan = Math.min(newLeftSpan, absoluteMaxLeft);
          const newRightStart = leftStart + newLeftSpan;
          const availableSpaceForRight = wallColumn - newRightStart;
          const newRightSpan = Math.min(rightStartSpan, availableSpaceForRight);

          if (
              newLeftSpan !== (leftItem.placement.colSpan ?? 1) || 
              newRightStart !== rightItem.placement.colStart ||
              newRightSpan !== (rightItem.placement.colSpan ?? 1)
          ) {
              updateAdjacentItems(leftItem.id, newLeftSpan, rightItem.id, newRightStart, newRightSpan);
          }
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

  function updateSingleItem(id: string, span: number) {
      const newItems = content.items.map(i => i.id === id ? { ...i, placement: { ...i.placement, colSpan: span } } : i);
      updateModule({...module, content: { ...content, items: newItems }});
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

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: { opacity: '0.4' },
      },
    }),
  };

  return (
    <div className="rounded-lg border bg-gray-50/50 overflow-hidden">
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
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
            ref={gridRef}
            className="grid border-l border-t border-dashed border-gray-300 select-none pb-2 relative"
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
                    const canResizeRight = itemEnd <= content.columns; 

                    return (
                        <SortableGridItem
                            key={item.id}
                            item={item}
                            resizingId={resizingId}
                            canResizeRight={canResizeRight}
                            isOverlay={false}
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

            <BottomDropZone colSpan={content.columns} visible={!!activeItem} />

            {content.items.length === 0 && (
                <div className="col-span-full p-8 text-center text-sm text-muted-foreground italic">
                    Grid is empty. Click "Add Grid Item" to start.
                </div>
            )}
        </div>

        <DragOverlay dropAnimation={dropAnimation}>
            {activeItem ? (
                 <SortableGridItem
                    item={activeItem}
                    resizingId={null}
                    canResizeRight={false}
                    isOverlay={true}
                    onResizeStart={() => {}}
                >
                    <div className="opacity-80 pointer-events-none">
                         <ModuleEditor
                            module={activeItem.module}
                            updateModule={() => {}}
                            deleteModule={() => {}}
                        />
                    </div>
                </SortableGridItem>
            ) : null}
        </DragOverlay>

      </DndContext>
    </div>
  );
}

function BottomDropZone({ colSpan, visible }: { colSpan: number, visible: boolean }) {
    const { isOver, setNodeRef } = useDroppable({
        id: "grid-bottom-drop-zone",
    });

    if (!visible) return null;

    return (
        <div 
            ref={setNodeRef}
            className={cn(
                "col-span-full transition-all duration-200 ease-in-out border-dashed border-2 border-transparent rounded-md m-2 flex items-center justify-center gap-2 text-muted-foreground",
                isOver ? "h-24 bg-blue-50 border-blue-300 text-blue-600 shadow-inner" : "h-4 hover:bg-gray-50"
            )}
            style={{ gridColumn: `1 / span ${colSpan}` }}
        >
            {isOver && (
                <div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200">
                    <ArrowDownToLine className="h-5 w-5" />
                    <span className="font-medium">Create new row</span>
                </div>
            )}
        </div>
    );
}

function SortableGridItem({
    item,
    children,
    resizingId,
    canResizeRight,
    isOverlay,
    onResizeStart
}: {
    item: GridLayoutItem;
    children: React.ReactNode;
    resizingId: string | null;
    canResizeRight: boolean;
    isOverlay: boolean;
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

    const style: React.CSSProperties = isOverlay ? {
        cursor: 'grabbing',
        border: '1px solid #3b82f6',
        borderRadius: '0.5rem',
        background: 'white',
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    } : {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : "auto",
        gridColumn: `${item.placement.colStart} / span ${item.placement.colSpan ?? 1}`,
        gridRow: item.placement.rowStart ? `${item.placement.rowStart} / span ${item.placement.rowSpan ?? 1}` : undefined,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={isOverlay ? null : setNodeRef}
            style={style}
            className={cn(
                "group/item relative p-4 transition-colors",
                !isOverlay && "border-b border-r border-dashed border-gray-300 bg-white/30 hover:bg-white/60",
                resizingId === item.id && "bg-blue-50/50 ring-2 ring-blue-400 ring-inset z-20"
            )}
        >
            <div
                {...attributes}
                {...listeners}
                className={cn(
                    "absolute top-1 left-1 z-30 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200 transition-opacity",
                    isOverlay ? "opacity-100" : "opacity-0 group-hover/item:opacity-100"
                )}
            >
                <GripVertical className="h-3 w-3 text-gray-400" />
            </div>

            {!isOverlay && canResizeRight && (
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
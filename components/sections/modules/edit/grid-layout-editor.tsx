"use client";

import { useState, useRef, useMemo } from "react";
import type { GridLayoutItem, GridLayoutModule, Module } from "@/lib/sections/types";
import { createModule } from "@/lib/sections/utils";
import { ModuleEditor } from "@/components/sections/module-editor";
import { AddModuleMenu } from "@/components/sections/add-module-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Grid3X3, GripVertical, ArrowDownToLine } from "lucide-react";
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
  rectSwappingStrategy,
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

  const maxRow = useMemo(() => {
      let max = 0;
      content.items.forEach(i => {
          const bottom = (i.placement.rowStart ?? 1) + (i.placement.rowSpan ?? 1) - 1;
          if (bottom > max) max = bottom;
      });
      return Math.max(max, 1);
  }, [content.items]);

  const occupiedCells = useMemo(() => {
      const map = new Map<string, string>();
      content.items.forEach(item => {
          const rStart = item.placement.rowStart ?? 1;
          const rSpan = item.placement.rowSpan ?? 1;
          const cStart = item.placement.colStart;
          const cSpan = item.placement.colSpan ?? 1;
          
          for (let r = 0; r < rSpan; r++) {
              for(let c = 0; c < cSpan; c++) {
                  map.set(`${rStart + r}-${cStart + c}`, item.id);
              }
          }
      });
      return map;
  }, [content.items]);

  function handleDragStart(event: DragStartEvent) {
    const item = content.items.find((i) => i.id === event.active.id);
    if (item) setActiveItem(item);
  }

  function getSafeSpan(targetRow: number, targetCol: number, desiredSpan: number, currentItemId: string, allItems: GridLayoutItem[]) {
      let maxPossible = content.columns - targetCol + 1;

      const blockingItem = allItems
          .filter(i => (i.placement.rowStart ?? 1) === targetRow && i.placement.colStart > targetCol && i.id !== currentItemId)
          .sort((a, b) => a.placement.colStart - b.placement.colStart)[0];

      if (blockingItem) {
          const spaceToNeighbor = blockingItem.placement.colStart - targetCol;
          maxPossible = Math.min(maxPossible, spaceToNeighbor);
      }

      return Math.min(desiredSpan, maxPossible);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const draggingItem = content.items.find(i => i.id === active.id);
    if (!draggingItem) return;

    let newItems = [...content.items];

    if (over.id === "grid-bottom-drop-zone") {
        const targetRow = maxRow + 1;
        newItems = newItems.map(i => i.id === active.id ? {
            ...i,
            placement: { ...i.placement, rowStart: targetRow, colStart: 1 }
        } : i);

        updateModule({ ...module, content: { ...content, items: newItems } });
        return;
    }

    if (typeof over.id === "string" && over.id.startsWith("empty-")) {
        const [, rStr, cStr] = over.id.split("-");
        const targetRow = parseInt(rStr);
        const targetCol = parseInt(cStr);

        const newSpan = getSafeSpan(
            targetRow, 
            targetCol, 
            draggingItem.placement.colSpan ?? 1, 
            active.id as string, 
            content.items
        );

        newItems = newItems.map(i => i.id === active.id ? {
            ...i,
            placement: { 
                ...i.placement, 
                rowStart: targetRow, 
                colStart: targetCol,
                colSpan: newSpan
            }
        } : i);

        updateModule({ ...module, content: { ...content, items: newItems } });
        return;
    }

    if (active.id !== over.id) {
        const overItem = content.items.find(i => i.id === over.id);
        if (overItem) {
            newItems = newItems.map(i => {
                if (i.id === active.id) return { ...i, placement: { ...overItem.placement } };
                if (i.id === over.id) return { ...i, placement: { ...draggingItem.placement } };
                return i;
            });
            updateModule({ ...module, content: { ...content, items: newItems } });
        }
    }
  }

  function addGridItem(type: Module["type"]) {
    let targetR = 1;
    let targetC = 1;
    let found = false;
    for(let r=1; r <= maxRow + 1; r++) {
        for(let c=1; c <= content.columns; c++) {
            if(!occupiedCells.has(`${r}-${c}`)) {
                targetR = r; targetC = c; found = true; break;
            }
        }
        if(found) break;
    }

    const newModule = createModule(type);

    const newItem: GridLayoutItem = {
      id: `grid-item-${Date.now()}`,
      placement: { colStart: targetC, rowStart: targetR, colSpan: 1 },
      module: newModule,
    };
    updateModule({ ...module, content: { ...content, items: [...content.items, newItem] } });
  }

  function handleColChange(val: string) {
    const newColCount = Math.max(1, parseInt(val) || 1);
    const updatedItems = content.items.map(item => {
        let newCol = item.placement.colStart;
        let newSpan = item.placement.colSpan ?? 1;
        if (newCol > newColCount) { newCol = newColCount; newSpan = 1; } 
        else if (newCol + newSpan - 1 > newColCount) { newSpan = (newColCount - newCol) + 1; }
        return { ...item, placement: { ...item.placement, colStart: newCol, colSpan: newSpan } };
    });
    updateModule({ ...module, content: { ...content, columns: newColCount, items: updatedItems } });
  }

  function deleteGridItemModule(itemId: string) {
    const newItems = content.items.filter((item) => item.id !== itemId);
    updateModule({ ...module, content: { ...content, items: newItems } });
  }

  function updateGridItemModule(itemId: string, newModule: Module) {
    const newItems = module.content.items.map((item) => item.id === itemId ? { ...item, module: newModule } : item);
    updateModule({ ...module, content: { ...module.content, items: newItems } });
  }

  function handleResizeStart(e: React.MouseEvent, item: GridLayoutItem, direction: 'left' | 'right') {
    e.preventDefault(); e.stopPropagation();
    
    const rowStart = item.placement.rowStart ?? 1;
    const rowSpan = item.placement.rowSpan ?? 1;
    const currentStart = item.placement.colStart;
    const currentSpan = item.placement.colSpan ?? 1;
    const itemRows = Array.from({length: rowSpan}, (_, i) => rowStart + i);

    if (!gridRef.current) return;
    const gridRect = gridRef.current.getBoundingClientRect();
    const colWidth = gridRect.width / content.columns;
    const startX = e.pageX;

    setResizingId(item.id);

    function onMouseMove(moveEvent: MouseEvent) {
      const currentX = moveEvent.pageX;
      const colsMoved = Math.round((currentX - startX) / colWidth);

      if (direction === 'right') {
          let newSpan = currentSpan + colsMoved;
          newSpan = Math.max(1, newSpan);

          let wallColumn = content.columns + 1;
          let blockingNeighborId: string | null = null;

          for (let c = currentStart + 1; c <= content.columns; c++) {
              for (const r of itemRows) {
                  const occupiedId = occupiedCells.get(`${r}-${c}`);
                  if (occupiedId && occupiedId !== item.id) {
                      if (c < wallColumn) {
                          wallColumn = c;
                          blockingNeighborId = occupiedId;
                      }
                  }
              }
              if (wallColumn <= c) break;
          }

          if (!blockingNeighborId) {
              const maxSpan = (wallColumn - currentStart);
              newSpan = Math.min(newSpan, maxSpan);
              if (newSpan !== (item.placement.colSpan ?? 1)) {
                  updateItemSpan(item.id, newSpan);
              }
          } else {
              const neighbor = content.items.find(i => i.id === blockingNeighborId);
              
              if (neighbor) {
                  const rightStartSpan = neighbor.placement.colSpan ?? 1;
                  const maxAllowedSpan = (wallColumn - currentStart) + (rightStartSpan - 1);
                  newSpan = Math.min(newSpan, maxAllowedSpan);

                  const newRightStart = currentStart + newSpan;
                  const neighborOriginalEnd = neighbor.placement.colStart + rightStartSpan;
                  const newRightSpan = neighborOriginalEnd - newRightStart;

                  if (newSpan !== (item.placement.colSpan ?? 1) || newRightStart !== neighbor.placement.colStart) {
                      updateTwoItems(item.id, { colSpan: newSpan }, neighbor.id, { colStart: newRightStart, colSpan: newRightSpan });
                  }
              }
          }
      } else {
          let newStart = currentStart + colsMoved;
          newStart = Math.max(1, newStart);
          const originalEnd = currentStart + currentSpan;
          let newSpan = originalEnd - newStart;

          if (newSpan < 1) {
              newSpan = 1;
              newStart = originalEnd - 1;
          }

          let wallEnd = 0;
          let blockingNeighborId: string | null = null;

          for (let c = currentStart - 1; c >= 1; c--) {
              for (const r of itemRows) {
                  const occupiedId = occupiedCells.get(`${r}-${c}`);
                  if (occupiedId && occupiedId !== item.id) {
                      if (c + 1 > wallEnd) {
                          wallEnd = c + 1;
                          blockingNeighborId = occupiedId;
                      }
                  }
              }
              if (wallEnd > c) break; 
          }
          
          if (!blockingNeighborId) {
              newStart = Math.max(wallEnd > 0 ? wallEnd : 1, newStart);
              newSpan = originalEnd - newStart;
              if (newStart !== item.placement.colStart) {
                  updateItemPos(item.id, newStart, newSpan);
              }
          } else {
              const neighbor = content.items.find(i => i.id === blockingNeighborId);
              if (neighbor) {
                  const neighborStart = neighbor.placement.colStart;
                  newStart = Math.max(neighborStart + 1, newStart);
                  newSpan = originalEnd - newStart;
                  const newLeftNeighborSpan = newStart - neighborStart;

                  if (newStart !== item.placement.colStart) {
                      updateTwoItems(item.id, { colStart: newStart, colSpan: newSpan }, neighbor.id, { colSpan: newLeftNeighborSpan });
                  }
              }
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

  function updateItemSpan(id: string, span: number) {
      const newItems = content.items.map(i => i.id === id ? { ...i, placement: { ...i.placement, colSpan: span } } : i);
      updateModule({...module, content: { ...content, items: newItems }});
  }
  function updateItemPos(id: string, col: number, span: number) {
      const newItems = content.items.map(i => i.id === id ? { ...i, placement: { ...i.placement, colStart: col, colSpan: span } } : i);
      updateModule({...module, content: { ...content, items: newItems }});
  }
  function updateTwoItems(id1: string, p1: Partial<GridLayoutItem['placement']>, id2: string, p2: Partial<GridLayoutItem['placement']>) {
      const newItems = content.items.map(i => {
          if (i.id === id1) return { ...i, placement: { ...i.placement, ...p1 } };
          if (i.id === id2) return { ...i, placement: { ...i.placement, ...p2 } };
          return i;
      });
      updateModule({...module, content: { ...content, items: newItems }});
  }

  const renderCells = () => {
      const cells = [];
      const visited = new Set<string>();

      for (let r = 1; r <= maxRow; r++) {
          for (let c = 1; c <= content.columns; c++) {
              const key = `${r}-${c}`;
              if (visited.has(key)) continue;

              const itemId = occupiedCells.get(key);

              if (itemId) {
                  const item = content.items.find(i => i.id === itemId)!;
                  const span = item.placement.colSpan ?? 1;
                  const rSpan = item.placement.rowSpan ?? 1;

                  for(let i=0; i<span; i++) {
                      for(let j=0; j<rSpan; j++) {
                          visited.add(`${r+j}-${c+i}`);
                      }
                  }

                  cells.push(
                      <SortableGridItem
                          key={item.id}
                          item={item}
                          resizingId={resizingId}
                          isOverlay={false}
                          onResizeStart={(e, dir) => handleResizeStart(e, item, dir)}
                      >
                          <ModuleEditor
                              module={item.module}
                              updateModule={(newMod) => updateGridItemModule(item.id, newMod)}
                              deleteModule={() => deleteGridItemModule(item.id)}
                          />
                      </SortableGridItem>
                  );
              } else {
                  cells.push(
                      <DroppableGhostCell key={`empty-${r}-${c}`} row={r} col={c} />
                  );
              }
          }
      }
      return cells;
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }),
  };

  return (
    <div className="rounded-lg border border-border bg-gray-50/50 dark:bg-gray-900/40 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="grid-cols" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Columns</Label>
            <Input id="grid-cols" type="number" value={content.columns} onChange={(e) => handleColChange(e.target.value)} className="h-8 w-16 text-center" min="1" max="12" />
          </div>
        </div>
        
        <AddModuleMenu 
            onAdd={addGridItem} 
            includeGrid={false} 
            buttonText="Add Grid Item" 
            align="end" 
        />
        
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
            className="grid border-l border-t border-dashed border-gray-300 dark:border-gray-800 select-none pb-2 relative"
            style={{
                gridTemplateColumns: `repeat(${content.columns}, 1fr)`,
                gap: 0,
            }}
        >
            <SortableContext 
                items={content.items.map(i => i.id)} 
                strategy={rectSwappingStrategy}
            >
                {renderCells()}
            </SortableContext>

            <BottomDropZone colSpan={content.columns} visible={!!activeItem} />

            {content.items.length === 0 && (
                <div className="col-span-full p-8 text-center text-sm text-muted-foreground italic">Grid is empty. Click "Add Grid Item" to start.</div>
            )}
        </div>

        <DragOverlay dropAnimation={dropAnimation}>
            {activeItem ? (
                 <SortableGridItem
                    item={activeItem}
                    resizingId={null}
                    isOverlay={true}
                    onResizeStart={() => {}}
                >
                    <div className="opacity-80 pointer-events-none">
                         <ModuleEditor module={activeItem.module} updateModule={() => {}} deleteModule={() => {}} />
                    </div>
                </SortableGridItem>
            ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

function DroppableGhostCell({ row, col }: { row: number; col: number }) {
    const { isOver, setNodeRef } = useDroppable({ id: `empty-${row}-${col}` });
    return (
        <div 
            ref={setNodeRef} 
            style={{ gridColumn: `${col} / span 1`, gridRow: `${row} / span 1` }} 
            className={cn(
                "border-b border-r border-dashed border-gray-300 dark:border-gray-800 transition-colors min-h-25", 
                isOver ? "bg-blue-100/50 dark:bg-blue-900/20" : "bg-transparent"
            )} 
        />
    );
}

function BottomDropZone({ colSpan, visible }: { colSpan: number, visible: boolean }) {
    const { isOver, setNodeRef } = useDroppable({ id: "grid-bottom-drop-zone" });
    if (!visible) return null;
    return (
        <div 
            ref={setNodeRef} 
            className={cn(
                "col-span-full transition-all duration-200 ease-in-out border-dashed border-2 border-transparent rounded-md m-2 flex items-center justify-center gap-2 text-muted-foreground", 
                isOver ? "h-24 bg-blue-50 dark:bg-blue-900/10 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 shadow-inner" : "h-4 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            )} 
            style={{ gridColumn: `1 / span ${colSpan}` }}
        >
            {isOver && (<div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200"><ArrowDownToLine className="h-5 w-5" /><span className="font-medium">Create new row</span></div>)}
        </div>
    );
}

interface SortableGridItemProps {
  item: GridLayoutItem;
  children: React.ReactNode;
  resizingId: string | null;
  isOverlay: boolean;
  onResizeStart: (e: React.MouseEvent, direction: 'left' | 'right') => void;
}

function SortableGridItem({ item, children, resizingId, isOverlay, onResizeStart }: SortableGridItemProps) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform), 
        transition, 
        zIndex: isDragging ? 50 : "auto",
        gridColumn: `${item.placement.colStart} / span ${item.placement.colSpan ?? 1}`,
        gridRow: item.placement.rowStart ? `${item.placement.rowStart} / span ${item.placement.rowSpan ?? 1}` : undefined,
        opacity: isDragging ? 0.3 : 1,
    };

    if (isOverlay) {
        delete style.gridColumn;
        delete style.gridRow;
        style.opacity = 1;
        style.zIndex = 999;
    }

    return (
        <div 
            ref={isOverlay ? null : setNodeRef} 
            style={style} 
            className={cn(
                "group/item relative p-4 transition-colors",
                !isOverlay && "border-b border-r border-dashed border-gray-300 dark:border-gray-800 bg-white/30 dark:bg-gray-900/30 hover:bg-white/60 dark:hover:bg-gray-900/60",
                isOverlay && "bg-background border border-primary shadow-xl rounded-lg cursor-grabbing ring-2 ring-primary/20",
                resizingId === item.id && "bg-blue-50/50 dark:bg-blue-900/20 ring-2 ring-blue-400 dark:ring-blue-500 ring-inset z-20"
            )}
        >
            <div 
                {...attributes} 
                {...listeners} 
                className={cn(
                    "absolute top-1 left-1/2 -translate-x-1/2 z-30 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-opacity", 
                    isOverlay ? "opacity-100" : "opacity-0 group-hover/item:opacity-100"
                )}
            >
                <GripVertical className="h-3 w-3 text-muted-foreground rotate-90" />
            </div>
            
            {!isOverlay && (
                <div className="absolute top-0 bottom-0 -left-1.5 w-3 z-30 cursor-col-resize flex items-center justify-center group/handle" onMouseDown={(e) => onResizeStart(e, 'left')} onPointerDown={(e) => e.stopPropagation()}>
                    <div className={cn("h-full w-px bg-transparent group-hover/handle:bg-blue-400 dark:group-hover/handle:bg-blue-500 transition-colors", resizingId === item.id && "bg-blue-600 dark:bg-blue-500 w-0.5")} />
                </div>
            )}

            {!isOverlay && (
                <div className="absolute top-0 bottom-0 -right-1.5 w-3 z-30 cursor-col-resize flex items-center justify-center group/handle" onMouseDown={(e) => onResizeStart(e, 'right')} onPointerDown={(e) => e.stopPropagation()}>
                    <div className={cn("h-full w-px bg-transparent group-hover/handle:bg-blue-400 dark:group-hover/handle:bg-blue-500 transition-colors", resizingId === item.id && "bg-blue-600 dark:bg-blue-500 w-0.5")} />
                </div>
            )}
            {children}
        </div>
    );
}
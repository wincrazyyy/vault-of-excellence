"use client";

import { useState, useRef, useMemo } from "react";
import type { GridLayoutItem, GridLayoutModule, Module } from "@/lib/tutors/sections/types";
import { createModule } from "@/lib/tutors/sections/utils";
import { ModuleEditor } from "@/components/tutors/edit/sections/module-editor";
import { AddModuleMenu } from "@/components/tutors/edit/sections/add-module-menu";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Grid3X3, GripVertical, Rows as RowIcon, ArrowDownToLine, ArrowRightToLine } from "lucide-react";
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
  const rowCount = content.rows || Math.max(1, content.items.reduce((max, item) => Math.max(max, (item.placement.rowStart || 1) + (item.placement.rowSpan || 1) - 1), 1));

  const gridRef = useRef<HTMLDivElement>(null);

  const [resizingLine, setResizingLine] = useState<number | null>(null);
  const [activeItem, setActiveItem] = useState<GridLayoutItem | null>(null);
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const occupiedCells = useMemo(() => {
      const map = new Map<string, string>();
      content.items.forEach(item => {
          const rStart = item.placement.rowStart ?? 1;
          const rSpan = item.placement.rowSpan ?? 1;
          const cStart = item.placement.colStart;
          const cSpan = item.placement.colSpan ?? 1;
          for(let r = 0; r < rSpan; r++) {
              for(let c = 0; c < cSpan; c++) {
                  map.set(`${rStart + r}-${cStart + c}`, item.id);
              }
          }
      });
      return map;
  }, [content.items]);

  const activeItemData = content.items.find(i => i.id === (activeItem?.id || hoveredItemId));
  
  const activeColRange = useMemo(() => {
      if (!activeItemData) return null;
      const start = activeItemData.placement.colStart;
      const end = start + (activeItemData.placement.colSpan ?? 1) - 1;
      return { start, end };
  }, [activeItemData]);

  const activeRowRange = useMemo(() => {
      if (!activeItemData) return null;
      const start = activeItemData.placement.rowStart ?? 1;
      const end = start + (activeItemData.placement.rowSpan ?? 1) - 1;
      return { start, end };
  }, [activeItemData]);

  function handleColResizeStart(e: React.MouseEvent, lineIndex: number, sourceItem: GridLayoutItem) {
    e.preventDefault(); e.stopPropagation();
    if (!gridRef.current) return;
    const gridRect = gridRef.current.getBoundingClientRect();
    const colWidth = gridRect.width / content.columns;
    const startX = e.pageX;

    const activeRows = new Set<number>();
    const startRow = sourceItem.placement.rowStart ?? 1;
    const rowSpan = sourceItem.placement.rowSpan ?? 1;
    for(let i=0; i<rowSpan; i++) activeRows.add(startRow + i);

    let changed = true;
    while(changed) {
        changed = false;
        const currentSize = activeRows.size;
        const touchingItems = content.items.filter(i => {
            const iStart = i.placement.rowStart ?? 1;
            const iSpan = i.placement.rowSpan ?? 1;
            const iRows = Array.from({length: iSpan}, (_, x) => iStart + x);
            if (!iRows.some(r => activeRows.has(r))) return false;
            const colStart = i.placement.colStart;
            const colEnd = colStart + (i.placement.colSpan ?? 1) - 1;
            return (colEnd === lineIndex) || (colStart === lineIndex + 1);
        });
        touchingItems.forEach(i => {
            const rStart = i.placement.rowStart ?? 1;
            const rSpan = i.placement.rowSpan ?? 1;
            for(let r=0; r<rSpan; r++) activeRows.add(rStart + r);
        });
        if (activeRows.size > currentSize) changed = true;
    }

    const leftItems = content.items.filter(i => {
        const end = i.placement.colStart + (i.placement.colSpan ?? 1) - 1;
        if (end !== lineIndex) return false;
        const start = i.placement.rowStart ?? 1;
        const span = i.placement.rowSpan ?? 1;
        const rows = Array.from({length: span}, (_, x) => start + x);
        return rows.some(r => activeRows.has(r));
    });
    const rightItems = content.items.filter(i => {
        const start = i.placement.colStart;
        if (start !== lineIndex + 1) return false;
        const startR = i.placement.rowStart ?? 1;
        const spanR = i.placement.rowSpan ?? 1;
        const rows = Array.from({length: spanR}, (_, x) => startR + x);
        return rows.some(r => activeRows.has(r));
    });

    if (leftItems.length === 0 && rightItems.length === 0) return;
    setResizingLine(lineIndex);

    function onMouseMove(moveEvent: MouseEvent) {
        const currentX = moveEvent.pageX;
        const diffX = currentX - startX;
        const colsMoved = Math.round(diffX / colWidth);
        if (colsMoved === 0) return;

        const newLineIndex = lineIndex + colsMoved;
        if (newLineIndex < 0 || newLineIndex > content.columns) return;
        if (leftItems.some(i => (i.placement.colSpan ?? 1) + colsMoved < 1)) return;
        if (rightItems.some(i => (i.placement.colSpan ?? 1) - colsMoved < 1)) return;

        const movingRight = colsMoved > 0;
        const collisionRows = Array.from(activeRows);

        if (movingRight) {
            for (let c = lineIndex + 1; c <= newLineIndex; c++) {
                for(const r of collisionRows) {
                    const occId = occupiedCells.get(`${r}-${c}`);
                    if (occId && !rightItems.find(ri => ri.id === occId)) return;
                }
            }
        } else {
            for (let c = lineIndex; c > newLineIndex; c--) {
                for(const r of collisionRows) {
                    const occId = occupiedCells.get(`${r}-${c}`);
                    if (occId && !leftItems.find(li => li.id === occId)) return;
                }
            }
        }

        const newItems = content.items.map(item => {
            if (leftItems.find(li => li.id === item.id)) {
                return { ...item, placement: { ...item.placement, colSpan: (item.placement.colSpan ?? 1) + colsMoved } };
            }
            if (rightItems.find(ri => ri.id === item.id)) {
                return {
                    ...item,
                    placement: { ...item.placement, colStart: item.placement.colStart + colsMoved, colSpan: (item.placement.colSpan ?? 1) - colsMoved }
                };
            }
            return item;
        });
        updateModule({ ...module, content: { ...content, items: newItems } });
    }
    function onMouseUp() {
        setResizingLine(null);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  function handleRowResizeStart(e: React.MouseEvent, lineIndex: number, sourceItem: GridLayoutItem) {
    e.preventDefault(); e.stopPropagation();
    if (!gridRef.current) return;
    const gridRect = gridRef.current.getBoundingClientRect();
    const rowHeight = gridRect.height / rowCount;
    const startY = e.pageY;

    const activeCols = new Set<number>();
    const startCol = sourceItem.placement.colStart;
    const colSpan = sourceItem.placement.colSpan ?? 1;
    for(let i=0; i<colSpan; i++) activeCols.add(startCol + i);

    let changed = true;
    while(changed) {
        changed = false;
        const currentSize = activeCols.size;
        const touchingItems = content.items.filter(i => {
            const cStart = i.placement.colStart;
            const cSpan = i.placement.colSpan ?? 1;
            const iCols = Array.from({length: cSpan}, (_, x) => cStart + x);
            if (!iCols.some(c => activeCols.has(c))) return false;
            const rStart = i.placement.rowStart ?? 1;
            const rEnd = rStart + (i.placement.rowSpan ?? 1) - 1;
            return (rEnd === lineIndex) || (rStart === lineIndex + 1);
        });
        touchingItems.forEach(i => {
            const cStart = i.placement.colStart;
            const cSpan = i.placement.colSpan ?? 1;
            for(let c=0; c<cSpan; c++) activeCols.add(cStart + c);
        });
        if (activeCols.size > currentSize) changed = true;
    }

    const topItems = content.items.filter(i => {
        const end = (i.placement.rowStart ?? 1) + (i.placement.rowSpan ?? 1) - 1;
        if (end !== lineIndex) return false;
        const start = i.placement.colStart;
        const span = i.placement.colSpan ?? 1;
        const cols = Array.from({length: span}, (_, x) => start + x);
        return cols.some(c => activeCols.has(c));
    });
    const bottomItems = content.items.filter(i => {
        const start = i.placement.rowStart ?? 1;
        if (start !== lineIndex + 1) return false;
        const startC = i.placement.colStart;
        const spanC = i.placement.colSpan ?? 1;
        const cols = Array.from({length: spanC}, (_, x) => startC + x);
        return cols.some(c => activeCols.has(c));
    });

    if (topItems.length === 0 && bottomItems.length === 0) return;
    setResizingLine(lineIndex);

    function onMouseMove(moveEvent: MouseEvent) {
        const currentY = moveEvent.pageY;
        const diffY = currentY - startY;
        const rowsMoved = Math.round(diffY / rowHeight);
        if (rowsMoved === 0) return;

        const newLineIndex = lineIndex + rowsMoved;
        if (newLineIndex < 0 || newLineIndex > rowCount) return;
        if (topItems.some(i => (i.placement.rowSpan ?? 1) + rowsMoved < 1)) return;
        if (bottomItems.some(i => (i.placement.rowSpan ?? 1) - rowsMoved < 1)) return;

        const movingDown = rowsMoved > 0;
        const collisionCols = Array.from(activeCols);

        if (movingDown) {
            for (let r = lineIndex + 1; r <= newLineIndex; r++) {
                for(const c of collisionCols) {
                    const occId = occupiedCells.get(`${r}-${c}`);
                    if (occId && !bottomItems.find(bi => bi.id === occId)) return;
                }
            }
        } else {
            for (let r = lineIndex; r > newLineIndex; r--) {
                for(const c of collisionCols) {
                    const occId = occupiedCells.get(`${r}-${c}`);
                    if (occId && !topItems.find(ti => ti.id === occId)) return;
                }
            }
        }

        const newItems = content.items.map(item => {
            if (topItems.find(ti => ti.id === item.id)) {
                return { ...item, placement: { ...item.placement, rowSpan: (item.placement.rowSpan ?? 1) + rowsMoved } };
            }
            if (bottomItems.find(bi => bi.id === item.id)) {
                return {
                    ...item,
                    placement: { ...item.placement, rowStart: (item.placement.rowStart ?? 1) + rowsMoved, rowSpan: (item.placement.rowSpan ?? 1) - rowsMoved }
                };
            }
            return item;
        });
        updateModule({ ...module, content: { ...content, items: newItems } });
    }
    function onMouseUp() {
        setResizingLine(null);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  function handleDragStart(event: DragStartEvent) {
    const item = content.items.find((i) => i.id === event.active.id);
    if (item) setActiveItem(item);
  }

  function getSafeSpan(targetRow: number, targetCol: number, desiredSpan: number, currentItemId: string, allItems: GridLayoutItem[], rowSpan: number) {
      let maxPossible = content.columns - targetCol + 1;
      let minDistanceToBlocker = maxPossible;
      for(let r=0; r<rowSpan; r++) {
          const currentRow = targetRow + r;
          const blockingItem = allItems
              .filter(i => {
                  const rStart = i.placement.rowStart ?? 1;
                  const rSpan = i.placement.rowSpan ?? 1;
                  const onRow = rStart <= currentRow && (rStart + rSpan - 1) >= currentRow;
                  const toRight = i.placement.colStart > targetCol;
                  return onRow && toRight && i.id !== currentItemId;
              })
              .sort((a, b) => a.placement.colStart - b.placement.colStart)[0];
          if (blockingItem) {
              const dist = blockingItem.placement.colStart - targetCol;
              if (dist < minDistanceToBlocker) minDistanceToBlocker = dist;
          }
      }
      return Math.min(desiredSpan, minDistanceToBlocker);
  }

  function getSafeRowSpan(targetRow: number, targetCol: number, desiredRowSpan: number, colSpan: number, currentItemId: string, allItems: GridLayoutItem[]) {
      let maxRowsAvailable = 0;
      for (let r = 0; r < desiredRowSpan; r++) {
          const currentRow = targetRow + r;
          if (currentRow > rowCount) break;
          let rowIsClear = true;
          for (let c = 0; c < colSpan; c++) {
              const currentCol = targetCol + c;
              const blocker = allItems.find(i => {
                  if (i.id === currentItemId) return false;
                  const rStart = i.placement.rowStart ?? 1;
                  const rSpan = i.placement.rowSpan ?? 1;
                  const cStart = i.placement.colStart;
                  const cSpan = i.placement.colSpan ?? 1;
                  const rOverlap = currentRow >= rStart && currentRow < (rStart + rSpan);
                  const cOverlap = currentCol >= cStart && currentCol < (cStart + cSpan);
                  return rOverlap && cOverlap;
              });
              if (blocker) { rowIsClear = false; break; }
          }
          if (rowIsClear) { maxRowsAvailable++; } else { break; }
      }
      return Math.max(1, maxRowsAvailable);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveItem(null);
    if (!over) return;
    const draggingItem = content.items.find(i => i.id === active.id);
    if (!draggingItem) return;
    let newItems = [...content.items];

    if (over.id === "grid-bottom-drop-zone") {
        let targetRow = rowCount + 1;
        if (targetRow > 4) targetRow = 4;
        let newRowCount = rowCount;
        if (targetRow > rowCount) newRowCount = targetRow;
        newItems = newItems.map(i => i.id === active.id ? { ...i, placement: { ...i.placement, rowStart: targetRow, colStart: 1 } } : i);
        updateModule({ ...module, content: { ...content, rows: newRowCount, items: newItems } });
        return;
    }

    if (over.id === "grid-right-drop-zone") {
        let targetCol = content.columns + 1;
        if (targetCol > 4) targetCol = 4;
        let newColCount = content.columns;
        if (targetCol > content.columns) newColCount = targetCol;
        newItems = newItems.map(i => i.id === active.id ? { ...i, placement: { ...i.placement, rowStart: 1, colStart: targetCol } } : i);
        updateModule({ ...module, content: { ...content, columns: newColCount, items: newItems } });
        return;
    }

    if (typeof over.id === "string" && over.id.startsWith("empty-")) {
        const [, rStr, cStr] = over.id.split("-");
        const targetRow = parseInt(rStr);
        const targetCol = parseInt(cStr);
        let newColSpan = getSafeSpan(targetRow, targetCol, draggingItem.placement.colSpan ?? 1, active.id as string, content.items, 1);
        const newRowSpan = getSafeRowSpan(targetRow, targetCol, draggingItem.placement.rowSpan ?? 1, newColSpan, active.id as string, content.items);
        newColSpan = getSafeSpan(targetRow, targetCol, draggingItem.placement.colSpan ?? 1, active.id as string, content.items, newRowSpan);
        newItems = newItems.map(i => i.id === active.id ? { ...i, placement: { ...i.placement, rowStart: targetRow, colStart: targetCol, colSpan: newColSpan, rowSpan: newRowSpan } } : i);
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
    let targetR = 1; let targetC = 1; let found = false;
    for(let r=1; r <= rowCount; r++) {
        for(let c=1; c <= content.columns; c++) {
            if(!occupiedCells.has(`${r}-${c}`)) { targetR = r; targetC = c; found = true; break; }
        }
        if(found) break;
    }
    if (!found && rowCount < 4) { targetR = rowCount + 1; targetC = 1; found = true; }
    if (!found) return;
    const newRowCount = Math.max(rowCount, targetR);
    const newModule = createModule(type);
    const newItem: GridLayoutItem = {
      id: `grid-item-${Date.now()}`,
      placement: { colStart: targetC, rowStart: targetR, colSpan: 1, rowSpan: 1 },
      module: newModule,
    };
    updateModule({ ...module, content: { ...content, rows: newRowCount, items: [...content.items, newItem] } });
  }

  function handleColChange(val: string) {
    let newColCount = Math.max(1, parseInt(val) || 1);
    if (newColCount > 4) newColCount = 4;
    const updatedItems = content.items.map(item => {
        let newCol = item.placement.colStart;
        let newSpan = item.placement.colSpan ?? 1;
        if (newCol > newColCount) { newCol = newColCount; newSpan = 1; } 
        else if (newCol + newSpan - 1 > newColCount) { newSpan = (newColCount - newCol) + 1; }
        return { ...item, placement: { ...item.placement, colStart: newCol, colSpan: newSpan } };
    });
    updateModule({ ...module, content: { ...content, columns: newColCount, items: updatedItems } });
  }

  function handleRowChange(val: string) {
    let newRowCount = Math.max(1, parseInt(val) || 1);
    if (newRowCount > 4) newRowCount = 4;
    const updatedItems = content.items.filter(item => {
        const rStart = item.placement.rowStart ?? 1;
        return rStart <= newRowCount;
    });
    updateModule({ ...module, content: { ...content, rows: newRowCount, items: updatedItems } });
  }

  function deleteGridItemModule(itemId: string) {
    const newItems = content.items.filter((item) => item.id !== itemId);
    updateModule({ ...module, content: { ...content, items: newItems } });
  }

  function updateGridItemModule(itemId: string, newModule: Module) {
    const newItems = module.content.items.map((item) => item.id === itemId ? { ...item, module: newModule } : item);
    updateModule({ ...module, content: { ...module.content, items: newItems } });
  }

  const renderCells = () => {
      const cells = [];
      const visited = new Set<string>();

      for (let r = 1; r <= rowCount; r++) {
          for (let c = 1; c <= content.columns; c++) {
              const key = `${r}-${c}`;
              if (visited.has(key)) continue;

              const itemId = occupiedCells.get(key);

              if (itemId) {
                  const item = content.items.find(i => i.id === itemId)!;
                  const span = item.placement.colSpan ?? 1;
                  const rSpan = item.placement.rowSpan ?? 1;
                  for(let i=0; i<span; i++) {
                      for(let j=0; j<rSpan; j++) { visited.add(`${r+j}-${c+i}`); }
                  }

                  const leftLine = c - 1;
                  const rightLine = c + span - 1;
                  const topLine = r - 1;
                  const bottomLine = r + rSpan - 1;

                  cells.push(
                      <SortableGridItem
                          key={item.id}
                          item={item}
                          leftLineIndex={leftLine}
                          rightLineIndex={rightLine}
                          topLineIndex={topLine}
                          bottomLineIndex={bottomLine}
                          isResizing={resizingLine !== null}
                          isActive={activeItem?.id === item.id}
                          isOverlay={false}
                          onResizeCol={(e, line) => handleColResizeStart(e, line, item)}
                          onResizeRow={(e, line) => handleRowResizeStart(e, line, item)}
                          onHover={() => setHoveredItemId(item.id)}
                          onLeave={() => setHoveredItemId(null)}
                      >
                          <ModuleEditor
                              module={item.module}
                              updateModule={(newMod) => updateGridItemModule(item.id, newMod)}
                              deleteModule={() => deleteGridItemModule(item.id)}
                          />
                      </SortableGridItem>
                  );
              } else {
                  cells.push(<DroppableGhostCell key={`empty-${r}-${c}`} row={r} col={c} />);
              }
          }
      }
      return cells;
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }),
  };

  return (
    <div className="rounded-lg border border-border bg-gray-50/50 dark:bg-gray-900/40 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Grid3X3 className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="grid-cols" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Columns</Label>
            <Input id="grid-cols" type="number" value={content.columns} onChange={(e) => handleColChange(e.target.value)} className="h-8 w-16 text-center" min="1" max="4" />
          </div>
          <div className="flex items-center gap-2">
            <RowIcon className="h-4 w-4 text-muted-foreground" />
            <Label htmlFor="grid-rows" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Rows</Label>
            <Input id="grid-rows" type="number" value={rowCount} onChange={(e) => handleRowChange(e.target.value)} className="h-8 w-16 text-center" min="1" max="4" />
          </div>
        </div>
        <AddModuleMenu onAdd={addGridItem} includeGrid={false} buttonText="Add Grid Item" align="end" />
      </div>

      <div className="overflow-x-auto w-full p-4 pl-8 pt-8"> {/* Added padding for indicators */}
        <DndContext id={`grid-dnd-${module.id}`} sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex relative">

                <div className="absolute -top-6 left-0 right-0 flex ml-px" style={{ width: 'calc(100% - 3rem)' }}>
                    {Array.from({ length: content.columns }).map((_, i) => {
                        const colNum = i + 1;
                        const isActive = activeColRange && colNum >= activeColRange.start && colNum <= activeColRange.end;
                        return (
                            <div key={i} className="flex-1 flex justify-center text-xs font-mono text-muted-foreground transition-colors duration-200">
                                <span className={cn("px-2 rounded", isActive && "bg-blue-100 dark:bg-blue-900/50 text-blue-600 font-bold")}>
                                    {colNum}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="absolute -left-6 top-0 bottom-0 flex flex-col mb-px" style={{ height: 'calc(100% - 3rem)' }}>
                    {Array.from({ length: rowCount }).map((_, i) => {
                        const rowNum = i + 1;
                        const isActive = activeRowRange && rowNum >= activeRowRange.start && rowNum <= activeRowRange.end;
                        return (
                            <div key={i} className="flex-1 flex items-center justify-end pr-2 text-xs font-mono text-muted-foreground transition-colors duration-200">
                                <span className={cn("px-1 rounded", isActive && "bg-blue-100 dark:bg-blue-900/50 text-blue-600 font-bold")}>
                                    {rowNum}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div
                    ref={gridRef}
                    className="grid w-full border-l border-t border-dashed border-gray-300 dark:border-gray-800 select-none pb-2 relative"
                    style={{ gridTemplateColumns: `repeat(${content.columns}, minmax(0, 1fr))`, gap: 0 }}
                >
                    <SortableContext items={content.items.map(i => i.id)} strategy={rectSwappingStrategy}>
                        {renderCells()}
                    </SortableContext>
                    <BottomDropZone colSpan={content.columns} visible={!!activeItem && rowCount < 4} />
                    {content.items.length === 0 && rowCount === 0 && (
                        <div className="col-span-full p-8 text-center text-sm text-muted-foreground italic">Grid is empty. Adjust Rows/Cols or Click "Add Grid Item".</div>
                    )}
                </div>
                <RightDropZone visible={!!activeItem && content.columns < 4} />
            </div>
            <DragOverlay dropAnimation={dropAnimation}>
                {activeItem ? (
                    <SortableGridItem
                        item={activeItem}
                        leftLineIndex={-1} rightLineIndex={-1} topLineIndex={-1} bottomLineIndex={-1}
                        onResizeCol={() => {}} onResizeRow={() => {}}
                        isResizing={false} isActive={false} isOverlay={true}
                        onHover={()=>{}} onLeave={()=>{}}
                    >
                        <div className="opacity-80 pointer-events-none">
                            <ModuleEditor module={activeItem.module} updateModule={() => {}} deleteModule={() => {}} />
                        </div>
                    </SortableGridItem>
                ) : null}
            </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

function DroppableGhostCell({ row, col }: { row: number; col: number }) {
    const { isOver, setNodeRef } = useDroppable({ id: `empty-${row}-${col}` });
    return (
        <div ref={setNodeRef} style={{ gridColumn: `${col} / span 1`, gridRow: `${row} / span 1` }} className={cn("border-b border-r border-dashed border-gray-300 dark:border-gray-800 transition-colors min-h-25", isOver ? "bg-blue-100/50 dark:bg-blue-900/20" : "bg-transparent")} />
    );
}

function BottomDropZone({ colSpan, visible }: { colSpan: number, visible: boolean }) {
    const { isOver, setNodeRef } = useDroppable({ id: "grid-bottom-drop-zone" });
    if (!visible) return null;
    return (
        <div ref={setNodeRef} className={cn("col-span-full transition-all duration-200 ease-in-out border-dashed border-2 border-transparent rounded-md m-2 flex items-center justify-center gap-2 text-muted-foreground", isOver ? "h-24 bg-blue-50 dark:bg-blue-900/10 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 shadow-inner" : "h-4 hover:bg-gray-50 dark:hover:bg-gray-800/50")} style={{ gridColumn: `1 / span ${colSpan}` }}>
            {isOver && (<div className="flex items-center gap-2 animate-in fade-in zoom-in duration-200"><ArrowDownToLine className="h-5 w-5" /><span className="font-medium">Create new row</span></div>)}
        </div>
    );
}

function RightDropZone({ visible }: { visible: boolean }) {
    const { isOver, setNodeRef } = useDroppable({ id: "grid-right-drop-zone" });
    if (!visible) return null;
    return (
        <div ref={setNodeRef} className={cn("w-12 transition-all duration-200 ease-in-out border-dashed border-2 border-transparent rounded-md m-2 flex flex-col items-center justify-center gap-2 text-muted-foreground", isOver ? "w-24 bg-blue-50 dark:bg-blue-900/10 border-blue-300 dark:border-blue-700 text-blue-600 dark:text-blue-400 shadow-inner" : "w-4 hover:bg-gray-50 dark:hover:bg-gray-800/50")}>
            {isOver && (<div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-200 text-xs text-center"><ArrowRightToLine className="h-5 w-5" /><span className="font-medium writing-mode-vertical">New Column</span></div>)}
        </div>
    );
}

interface SortableGridItemProps {
  item: GridLayoutItem;
  children: React.ReactNode;
  leftLineIndex: number;
  rightLineIndex: number;
  topLineIndex: number;
  bottomLineIndex: number;
  isResizing: boolean;
  isActive: boolean;
  isOverlay: boolean;
  onResizeCol: (e: React.MouseEvent, lineIndex: number) => void;
  onResizeRow: (e: React.MouseEvent, lineIndex: number) => void;
  onHover: () => void;
  onLeave: () => void;
}

function SortableGridItem({ item, children, leftLineIndex, rightLineIndex, topLineIndex, bottomLineIndex, isResizing, isActive, isOverlay, onResizeCol, onResizeRow, onHover, onLeave }: SortableGridItemProps) {
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

    const showHandles = !isOverlay && !isDragging && !isResizing;

    return (
        <div 
            ref={isOverlay ? null : setNodeRef} 
            style={style} 
            onMouseEnter={onHover}
            onMouseLeave={onLeave}
            className={cn(
                "group/item relative p-4 transition-colors",
                "min-w-0 overflow-hidden", 
                !isOverlay && "border-b border-r border-dashed border-gray-300 dark:border-gray-800 bg-white/30 dark:bg-gray-900/30 hover:bg-white/60 dark:hover:bg-gray-900/60",
                isOverlay && "bg-background border border-primary shadow-xl rounded-lg cursor-grabbing ring-2 ring-primary/20",
                isActive && !isOverlay && "pointer-events-none" 
            )}
        >
            <div 
                {...attributes} 
                {...listeners} 
                className={cn(
                    "absolute top-1 left-1/2 -translate-x-1/2 z-30 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-opacity", 
                    isOverlay ? "opacity-100" : "opacity-0 group-hover/item:opacity-100",
                    isActive && !isOverlay && "pointer-events-auto"
                )}
            >
                <GripVertical className="h-3 w-3 text-muted-foreground rotate-90" />
            </div>
            {showHandles && (<div className="absolute top-0 bottom-0 -left-2 w-4 z-40 cursor-col-resize flex items-center justify-center group/handle" onMouseDown={(e) => onResizeCol(e, leftLineIndex)} onPointerDown={(e) => e.stopPropagation()}><div className="h-full w-px bg-transparent group-hover/handle:bg-blue-400 dark:group-hover/handle:bg-blue-500 transition-colors group-hover/handle:w-1" /></div>)}
            {showHandles && (<div className="absolute top-0 bottom-0 -right-2 w-4 z-40 cursor-col-resize flex items-center justify-center group/handle" onMouseDown={(e) => onResizeCol(e, rightLineIndex)} onPointerDown={(e) => e.stopPropagation()}><div className="h-full w-px bg-transparent group-hover/handle:bg-blue-400 dark:group-hover/handle:bg-blue-500 transition-colors group-hover/handle:w-1" /></div>)}
            {showHandles && (<div className="absolute left-0 right-0 -top-2 h-4 z-40 cursor-row-resize flex items-center justify-center group/handle" onMouseDown={(e) => onResizeRow(e, topLineIndex)} onPointerDown={(e) => e.stopPropagation()}><div className="w-full h-px bg-transparent group-hover/handle:bg-blue-400 dark:group-hover/handle:bg-blue-500 transition-colors group-hover/handle:h-1" /></div>)}
            {showHandles && (<div className="absolute left-0 right-0 -bottom-2 h-4 z-40 cursor-row-resize flex items-center justify-center group/handle" onMouseDown={(e) => onResizeRow(e, bottomLineIndex)} onPointerDown={(e) => e.stopPropagation()}><div className="w-full h-px bg-transparent group-hover/handle:bg-blue-400 dark:group-hover/handle:bg-blue-500 transition-colors group-hover/handle:h-1" /></div>)}
            {children}
        </div>
    );
}
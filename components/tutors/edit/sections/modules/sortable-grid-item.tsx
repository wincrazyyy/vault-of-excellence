"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GridLayoutItem } from "@/lib/tutors/sections/types";

export interface SortableGridItemProps {
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

export function SortableGridItem({ 
  item, children, leftLineIndex, rightLineIndex, topLineIndex, bottomLineIndex, 
  isResizing, isActive, isOverlay, onResizeCol, onResizeRow, onHover, onLeave 
}: SortableGridItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  
  const style: React.CSSProperties = isOverlay ? {
    cursor: "grabbing",
    zIndex: 999,
    width: "100%",
    height: "100%",
  } : {
    transform: CSS.Transform.toString(transform), 
    transition, 
    zIndex: isDragging ? 50 : "auto",
    gridColumn: `${item.placement.colStart} / span ${item.placement.colSpan ?? 1}`,
    gridRow: item.placement.rowStart ? `${item.placement.rowStart} / span ${item.placement.rowSpan ?? 1}` : undefined,
    opacity: isDragging ? 0.3 : 1,
  };

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
        !isOverlay && "border-b border-r border-dashed border-border/50 bg-background/80 hover:bg-accent/50",
        isOverlay && "bg-background border border-primary shadow-xl rounded-lg cursor-grabbing ring-2 ring-primary/20",
        isActive && !isOverlay && "pointer-events-none" 
      )}
    >
      <div 
        {...(!isOverlay ? attributes : {})} 
        {...(!isOverlay ? listeners : {})} 
        className={cn(
          "absolute top-1 left-1/2 -translate-x-1/2 z-30 cursor-grab active:cursor-grabbing p-1 rounded hover:bg-accent transition-opacity", 
          isOverlay ? "opacity-100 cursor-grabbing" : "opacity-0 group-hover/item:opacity-100",
          isActive && !isOverlay && "pointer-events-auto"
        )}
      >
        <GripVertical className="h-3 w-3 text-muted-foreground rotate-90" />
      </div>
      
      {showHandles && (<div className="absolute top-0 bottom-0 -left-2 w-4 z-40 cursor-col-resize flex items-center justify-center group/handle" onMouseDown={(e) => onResizeCol(e, leftLineIndex)} onPointerDown={(e) => e.stopPropagation()}><div className="h-full w-px bg-transparent group-hover/handle:bg-primary transition-colors group-hover/handle:w-1" /></div>)}
      {showHandles && (<div className="absolute top-0 bottom-0 -right-2 w-4 z-40 cursor-col-resize flex items-center justify-center group/handle" onMouseDown={(e) => onResizeCol(e, rightLineIndex)} onPointerDown={(e) => e.stopPropagation()}><div className="h-full w-px bg-transparent group-hover/handle:bg-primary transition-colors group-hover/handle:w-1" /></div>)}
      {showHandles && (<div className="absolute left-0 right-0 -top-2 h-4 z-40 cursor-row-resize flex items-center justify-center group/handle" onMouseDown={(e) => onResizeRow(e, topLineIndex)} onPointerDown={(e) => e.stopPropagation()}><div className="w-full h-px bg-transparent group-hover/handle:bg-primary transition-colors group-hover/handle:h-1" /></div>)}
      {showHandles && (<div className="absolute left-0 right-0 -bottom-2 h-4 z-40 cursor-row-resize flex items-center justify-center group/handle" onMouseDown={(e) => onResizeRow(e, bottomLineIndex)} onPointerDown={(e) => e.stopPropagation()}><div className="w-full h-px bg-transparent group-hover/handle:bg-primary transition-colors group-hover/handle:h-1" /></div>)}
      
      <div className={cn("h-full", isOverlay && "pointer-events-none")}>
        {children}
      </div>
    </div>
  );
}

"use client";

import { useDroppable } from "@dnd-kit/core";
import { ArrowDownToLine, ArrowRightToLine } from "lucide-react";
import { cn } from "@/lib/utils";

export function DroppableGhostCell({ row, col }: { row: number; col: number }) {
  const { isOver, setNodeRef } = useDroppable({ id: `empty-${row}-${col}` });
  return (
    <div 
      ref={setNodeRef} 
      style={{ gridColumn: `${col} / span 1`, gridRow: `${row} / span 1` }} 
      className={cn("border-b border-r border-dashed border-border/50 transition-colors min-h-25", isOver ? "bg-primary/5" : "bg-transparent")} 
    />
  );
}

export function BottomDropZone({ colSpan, visible }: { colSpan: number, visible: boolean }) {
  const { isOver, setNodeRef } = useDroppable({ id: "grid-bottom-drop-zone" });
  if (!visible) return null;
  return (
    <div 
      ref={setNodeRef} 
      className={cn("col-span-full transition-all duration-200 ease-in-out border-dashed border-2 border-transparent rounded-md m-2 flex items-center justify-center gap-2 text-muted-foreground", isOver ? "h-24 bg-primary/5 border-primary/20 text-primary shadow-inner" : "h-4 hover:bg-accent/50")} 
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

export function RightDropZone({ visible }: { visible: boolean }) {
  const { isOver, setNodeRef } = useDroppable({ id: "grid-right-drop-zone" });
  if (!visible) return null;
  return (
    <div 
      ref={setNodeRef} 
      className={cn("w-12 transition-all duration-200 ease-in-out border-dashed border-2 border-transparent rounded-md m-2 flex flex-col items-center justify-center gap-2 text-muted-foreground", isOver ? "w-24 bg-primary/5 border-primary/20 text-primary shadow-inner" : "w-4 hover:bg-accent/50")}
    >
      {isOver && (
        <div className="flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-200 text-xs text-center">
          <ArrowRightToLine className="h-5 w-5" />
          <span className="font-medium writing-mode-vertical">New Column</span>
        </div>
      )}
    </div>
  );
}

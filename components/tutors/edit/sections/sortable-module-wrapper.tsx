"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

import type { Module } from "@/lib/tutors/sections/types";
import { ModuleEditor } from "@/components/tutors/edit/sections/module-editor";

interface SortableModuleWrapperProps {
  module: Module;
  updateModule: (m: Module) => void;
  deleteModule: () => void;
  isOverlay?: boolean;
}

export function SortableModuleWrapper({
  module,
  updateModule,
  deleteModule,
  isOverlay = false,
}: SortableModuleWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = isOverlay ? {
    cursor: "grabbing",
    zIndex: 999,
  } : {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.3 : 1,
    position: "relative" as const,
  };

  const innerContent = (
    <div
      className={cn(
        "group relative",
        isOverlay ? "shadow-2xl ring-2 ring-violet-500/20 rounded-lg overflow-hidden bg-background" : ""
      )}
    >
      <div
        {...(!isOverlay ? attributes : {})}
        {...(!isOverlay ? listeners : {})}
        className={cn(
          "absolute -top-3 left-1/2 -translate-x-1/2 z-20",
          "flex items-center gap-1",
          "p-1 px-3 rounded-full",
          "bg-background border border-border shadow-sm",
          "hover:bg-accent hover:text-accent-foreground",
          "transition-all duration-200",
          isOverlay 
            ? "cursor-grabbing opacity-100" 
            : "cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 focus-within:opacity-100"
        )}
      >
        <GripHorizontal className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className={cn(isOverlay && "pointer-events-none opacity-80")}>
        <ModuleEditor
          module={module}
          updateModule={updateModule}
          deleteModule={deleteModule}
        />
      </div>
    </div>
  );

  if (isOverlay) {
    return <div style={style}>{innerContent}</div>;
  }

  return (
    <div ref={setNodeRef} style={style}>
      {innerContent}
    </div>
  );
}
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
}

export function SortableModuleWrapper({
  module,
  updateModule,
  deleteModule,
}: SortableModuleWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    position: "relative" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn("group relative", isDragging && "opacity-50")}
    >
      <div
        {...attributes}
        {...listeners}
        className={cn(
          "absolute -top-3 left-1/2 -translate-x-1/2 z-20",
          "cursor-grab active:cursor-grabbing",
          "flex items-center gap-1",
          "p-1 px-3 rounded-full",
          "bg-background border border-border shadow-sm",
          "hover:bg-accent hover:text-accent-foreground",
          "transition-all duration-200",
          "opacity-0 group-hover:opacity-100 focus-within:opacity-100"
        )}
      >
        <GripHorizontal className="h-4 w-4 text-muted-foreground" />
      </div>

      <ModuleEditor
        module={module}
        updateModule={updateModule}
        deleteModule={deleteModule}
      />
    </div>
  );
}
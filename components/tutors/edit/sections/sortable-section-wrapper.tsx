"use client";

import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { GripVertical, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import type { Section, Module } from "@/lib/tutors/sections/types";
import { AddModuleMenu } from "@/components/tutors/edit/sections/add-module-menu";
import { SortableModuleWrapper } from "./sortable-module-wrapper";
import { ModuleEditor } from "./module-editor";

interface SortableSectionWrapperProps {
  section: Section;
  sensors: any;
  handleModuleDragEnd: (event: DragEndEvent, sectionId: string) => void;
  deleteSection: (id: string) => void;
  updateModule: (sId: string, mId: string, m: Module) => void;
  deleteModule: (sId: string, mId: string) => void;
  addModule: (sId: string, type: Module["type"]) => void;
  isOverlay?: boolean;
}

export function SortableSectionWrapper({
  section,
  sensors,
  handleModuleDragEnd,
  deleteSection,
  updateModule,
  deleteModule,
  addModule,
  isOverlay = false,
}: SortableSectionWrapperProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = isOverlay ? {
    cursor: "grabbing",
    zIndex: 999,
  } : {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : "auto",
    opacity: isDragging ? 0.3 : 1,
    position: "relative" as const,
  };

  const innerContent = (
    <Card className={cn("border-violet-200 dark:border-violet-500/30", isOverlay && "shadow-2xl border-violet-500 ring-2 ring-violet-500/20")}>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div
            {...(!isOverlay ? attributes : {})}
            {...(!isOverlay ? listeners : {})}
            className={cn("p-1.5 rounded text-muted-foreground transition-colors", isOverlay ? "cursor-grabbing" : "cursor-grab active:cursor-grabbing hover:bg-muted")}
          >
            <GripVertical className="h-5 w-5" />
          </div>
          <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
             <Layers className="h-4 w-4 text-violet-500" />
             Section: {section.id}
          </CardTitle>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => deleteSection(section.id)}
          className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-3"
          disabled={isOverlay}
        >
          Delete Section
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {isOverlay ? (
          <div className="space-y-4 pointer-events-none opacity-80">
            {section.modules.map((module) => (
              <div key={module.id} className="relative p-4 min-w-0 overflow-hidden border-b border-r border-dashed border-border/50 bg-background/80 rounded-lg">
                <ModuleEditor module={module} updateModule={()=>{}} deleteModule={()=>{}} />
              </div>
            ))}
          </div>
        ) : (
          <DndContext
            id={`dnd-section-${section.id}`}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={(e) => handleModuleDragEnd(e, section.id)}
          >
            <SortableContext
              items={section.modules.map((m) => m.id)}
              strategy={verticalListSortingStrategy}
            >
              {section.modules.map((module) => (
                <SortableModuleWrapper
                  key={module.id}
                  module={module}
                  updateModule={(newMod) => updateModule(section.id, module.id, newMod)}
                  deleteModule={() => deleteModule(section.id, module.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}

        {!isOverlay && (
          <div className="pt-4 border-t border-dashed border-border flex justify-center">
            <AddModuleMenu onAdd={(type) => addModule(section.id, type)} includeGrid={true} />
          </div>
        )}
      </CardContent>
    </Card>
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
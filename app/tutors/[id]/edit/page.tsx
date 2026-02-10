"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, GripHorizontal, GripVertical } from "lucide-react";
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
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { Tutor } from "@/components/tutors/types";
import { tutor as defaultTutor } from "../tutor-template";
import type { Section, Module } from "@/lib/tutors/sections/types";
import { createModule } from "@/lib/tutors/sections/utils";
import { ModuleEditor } from "@/components/tutors/sections/module-editor";
import { AddModuleMenu } from "@/components/tutors/sections/add-module-menu";

export default function EditTutorPage() {
  return (
    <Suspense fallback={<div>Loading Editor...</div>}>
      <EditTutorContent />
    </Suspense>
  );
}

function EditTutorContent() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const tutorId = params?.id ?? "1";

  const [tutor, setTutor] = useState<Tutor>(defaultTutor);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleSectionDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tutor.sections.findIndex((s) => s.id === active.id);
      const newIndex = tutor.sections.findIndex((s) => s.id === over.id);

      const newSections = arrayMove(tutor.sections, oldIndex, newIndex);

      setTutor((prev) => ({
        ...prev,
        sections: newSections,
      }));
    }
  }

  function handleModuleDragEnd(event: DragEndEvent, sectionId: string) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const section = tutor.sections.find((s) => s.id === sectionId);
      if (!section) return;

      const oldIndex = section.modules.findIndex((m) => m.id === active.id);
      const newIndex = section.modules.findIndex((m) => m.id === over.id);

      const newModules = arrayMove(section.modules, oldIndex, newIndex);

      const newSection = { ...section, modules: newModules };
      updateSection(sectionId, newSection);
    }
  }

  function addSection() {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      modules: [],
    };

    setTutor((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  }

  function addModule(sectionId: string, type: Module["type"]) {
    const section = tutor.sections.find((s) => s.id === sectionId);
    if (!section) return;

    const newModule = createModule(type);

    const newSection: Section = {
      ...section,
      modules: [...section.modules, newModule],
    };
    updateSection(sectionId, newSection);
  }

  function updateSection(sectionId: string, newSection: Section) {
    setTutor((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === sectionId ? newSection : s)),
    }));
  }

  function updateModule(
    sectionId: string,
    moduleId: string,
    newModule: Module
  ) {
    const section = tutor.sections.find((s) => s.id === sectionId);
    if (!section) return;

    const newSection: Section = {
      ...section,
      modules: section.modules.map((m) => (m.id === moduleId ? newModule : m)),
    };
    updateSection(sectionId, newSection);
  }

  function deleteModule(sectionId: string, moduleId: string) {
    const section = tutor.sections.find((s) => s.id === sectionId);
    if (!section) return;

    const newSection: Section = {
      ...section,
      modules: section.modules.filter((m) => m.id !== moduleId),
    };
    updateSection(sectionId, newSection);
  }

  function deleteSection(sectionId: string) {
    setTutor((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }));
  }

  function preview() {
    const encoded = encodeURIComponent(JSON.stringify(tutor));
    router.push(`/tutors/${tutorId}?preview=1&tutor=${encoded}`);
  }

  function save() {
    preview();
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Edit tutor profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Changes are not saved until you click the Save button. You can also
            preview your changes before saving.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/tutors/${tutorId}`}>Back to profile</Link>
          </Button>
          <Button variant="outline" onClick={preview}>
            Preview
          </Button>
          <Button onClick={save}>Save</Button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        <DndContext
          id="dnd-sections-root"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleSectionDragEnd}
        >
          <SortableContext
            items={tutor.sections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            {tutor.sections.map((section) => (
              <SortableSectionWrapper
                key={section.id}
                section={section}
                sensors={sensors}
                handleModuleDragEnd={handleModuleDragEnd}
                deleteSection={deleteSection}
                updateModule={updateModule}
                deleteModule={deleteModule}
                addModule={addModule}
              />
            ))}
          </SortableContext>
        </DndContext>

        <Button
          variant="outline"
          className="w-full border-dashed py-8"
          onClick={addSection}
        >
          <Plus className="h-3.5 w-3.5" /> Add New Section
        </Button>
      </div>
    </main>
  );
}

function SortableSectionWrapper({
  section,
  sensors,
  handleModuleDragEnd,
  deleteSection,
  updateModule,
  deleteModule,
  addModule,
}: {
  section: Section;
  sensors: any;
  handleModuleDragEnd: (event: DragEndEvent, sectionId: string) => void;
  deleteSection: (id: string) => void;
  updateModule: (sId: string, mId: string, m: Module) => void;
  deleteModule: (sId: string, mId: string) => void;
  addModule: (sId: string, type: Module["type"]) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : "auto",
    position: "relative" as const,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("relative", isDragging && "opacity-50")}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded text-muted-foreground"
            >
              <GripVertical className="h-5 w-5" />
            </div>
            <CardTitle className="text-sm font-medium opacity-50 uppercase tracking-wider">
              Section: {section.id}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteSection(section.id)}
            className="text-destructive hover:bg-destructive/10"
          >
            Delete Section
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
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
                  updateModule={(newMod) =>
                    updateModule(section.id, module.id, newMod)
                  }
                  deleteModule={() => deleteModule(section.id, module.id)}
                />
              ))}
            </SortableContext>
          </DndContext>

          <div className="pt-4 border-t border-dashed flex justify-center">
            <AddModuleMenu
              onAdd={(type) => addModule(section.id, type)}
              includeGrid={true}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SortableModuleWrapper({
  module,
  updateModule,
  deleteModule,
}: {
  module: Module;
  updateModule: (m: Module) => void;
  deleteModule: () => void;
}) {
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
        className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 cursor-grab active:cursor-grabbing p-1 px-3 rounded-full bg-white border shadow-sm hover:bg-gray-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
      >
        <GripHorizontal className="h-4 w-4 text-gray-400" />
      </div>

      <ModuleEditor
        module={module}
        updateModule={updateModule}
        deleteModule={deleteModule}
      />
    </div>
  );
}
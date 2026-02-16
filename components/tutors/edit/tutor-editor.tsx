"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Layers, Loader2, GripHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

import type { TutorProfile } from "@/lib/types";
import type { Section, Module } from "@/lib/tutors/sections/types";
import { createModule } from "@/lib/tutors/sections/utils";
import { ProfileHeaderEditor } from "@/components/tutors/edit/profile-header-editor";
import { ModuleEditor } from "@/components/tutors/edit/sections/module-editor";
import { AddModuleMenu } from "@/components/tutors/edit/sections/add-module-menu";
import { ReviewsEditor } from "@/components/tutors/edit/reviews-editor";

interface TutorEditorProps {
  tutorId: string;
  initialTutor: TutorProfile;
}

export function TutorEditor({ tutorId, initialTutor }: TutorEditorProps) {
  const router = useRouter();
  const [tutor, setTutor] = useState<TutorProfile>(initialTutor);
  const [isSaving, setIsSaving] = useState(false);

  async function save() {
    setIsSaving(true);
    const supabase = createClient();

    const dbPayload = {
      firstname: tutor.header.firstname,
      lastname: tutor.header.lastname,
      title: tutor.header.title,
      subtitle: tutor.header.subtitle,
      image_url: tutor.header.image_url,
      hourly_rate: tutor.header.hourly_rate,
      badge_text: tutor.header.badge_text,
      
      show_rating: tutor.stats.show_rating,
      show_return_rate: tutor.stats.show_return_rate,

      sections: tutor.sections,
      is_public: tutor.is_public,
    };

    const { error } = await supabase
      .from("tutors")
      .update(dbPayload)
      .eq("id", tutorId);

    setIsSaving(false);

    if (error) {
      alert("Error saving profile: " + error.message);
    } else {
      router.refresh();
      alert("Profile updated successfully!");
    }
  }

  function handleSectionDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = tutor.sections.findIndex((s) => s.id === active.id);
      const newIndex = tutor.sections.findIndex((s) => s.id === over.id);
      setTutor((prev) => ({ ...prev, sections: arrayMove(prev.sections, oldIndex, newIndex) }));
    }
  }

  function handleModuleDragEnd(event: DragEndEvent, sectionId: string) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const section = tutor.sections.find((s) => s.id === sectionId);
      if (!section) return;
      const oldIndex = section.modules.findIndex((m) => m.id === active.id);
      const newIndex = section.modules.findIndex((m) => m.id === over.id);
      const newSection = { ...section, modules: arrayMove(section.modules, oldIndex, newIndex) };
      updateSection(sectionId, newSection);
    }
  }

  function updateSection(sectionId: string, newSection: Section) {
    setTutor((prev) => ({
      ...prev,
      sections: prev.sections.map((s) => (s.id === sectionId ? newSection : s)),
    }));
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile Editor</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Editing {tutor.header.firstname}&apos;s profile. Don&apos;t forget to save.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/tutors/${tutorId}`}>Cancel</Link>
          </Button>
          <Button onClick={save} disabled={isSaving} className="bg-violet-600 hover:bg-violet-700">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="mt-8 space-y-10">
        <ProfileHeaderEditor tutor={tutor} updateTutor={setTutor} />

        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase tracking-widest">
            <span className="bg-background px-4 text-muted-foreground font-bold">
              Content Sections
            </span>
          </div>
        </div>

        <DndContext
          id="dnd-sections-root"
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleSectionDragEnd}
        >
          <SortableContext items={tutor.sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-6">
              {tutor.sections.map((section) => (
                <SortableSectionWrapper
                  key={section.id}
                  section={section}
                  sensors={sensors}
                  handleModuleDragEnd={handleModuleDragEnd}
                  deleteSection={(id) => setTutor(prev => ({ ...prev, sections: prev.sections.filter(s => s.id !== id)}))}
                  updateModule={(sId, mId, newMod) => {
                    const section = tutor.sections.find(s => s.id === sId);
                    if (!section) return;
                    updateSection(sId, {
                      ...section,
                      modules: section.modules.map(m => m.id === mId ? newMod : m)
                    });
                  }}
                  deleteModule={(sId, mId) => {
                    const section = tutor.sections.find(s => s.id === sId);
                    if (!section) return;
                    updateSection(sId, {
                      ...section,
                      modules: section.modules.filter(m => m.id !== mId)
                    });
                  }}
                  addModule={(sId, type) => {
                    const section = tutor.sections.find(s => s.id === sId);
                    if (!section) return;
                    updateSection(sId, {
                      ...section,
                      modules: [...section.modules, createModule(type)]
                    });
                  }}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        <Button
          variant="outline"
          className="w-full border-dashed border-violet-200 dark:border-violet-800/50 py-10 hover:bg-violet-50 dark:hover:bg-violet-900/10"
          onClick={() => setTutor(prev => ({ ...prev, sections: [...prev.sections, { id: `section-${Date.now()}`, modules: [] }]}))}
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Layout Section
        </Button>
        
        <ReviewsEditor tutor={tutor} updateTutor={setTutor} />
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
      <Card className="border-violet-200 dark:border-violet-500/30">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="flex items-center gap-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing p-1.5 hover:bg-muted rounded text-muted-foreground transition-colors"
            >
              <GripVertical className="h-5 w-5" />
            </div>
            <CardTitle className="text-sm font-medium uppercase tracking-wider flex items-center gap-2">
               <Layers className="h-4 w-4 text-violet-500" />
               Section: {section.id}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteSection(section.id)}
            className="text-destructive hover:bg-destructive/10 hover:text-destructive h-8 px-3"
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

          <div className="pt-4 border-t border-dashed border-border flex justify-center">
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
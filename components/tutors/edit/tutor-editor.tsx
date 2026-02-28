// components/tutors/edit/tutor-editor.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import { Plus, Loader2, Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  defaultDropAnimationSideEffects
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import type { TutorProfile } from "@/lib/types";
import type { Section } from "@/lib/tutors/sections/types";
import { createModule } from "@/lib/tutors/sections/utils";

import { ProfileHeaderEditor } from "@/components/tutors/edit/profile-header-editor";
import { TagsEditor } from "@/components/tutors/edit/tags-editor";
import { ReviewsEditor } from "@/components/tutors/edit/reviews-editor";
import { TutorProfileContent } from "@/components/tutors/tutor-profile-content";
import { SortableSectionWrapper } from "@/components/tutors/edit/sections/sortable-section-wrapper";

interface TutorEditorProps {
  tutorId: string;
  initialTutor: TutorProfile;
}

export function TutorEditor({ tutorId, initialTutor }: TutorEditorProps) {
  const router = useRouter();
  const [tutor, setTutor] = useState<TutorProfile>(initialTutor);
  const [isSaving, setIsSaving] = useState(false);
  
  const [isDraft, setIsDraft] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const activeSection = tutor.sections.find(s => s.id === activeSectionId);

  useEffect(() => {
    setIsMounted(true);
    const savedDraft = localStorage.getItem(`tutor-draft-${tutorId}`);
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (JSON.stringify(parsed) !== JSON.stringify(initialTutor)) {
          setTutor(parsed);
          setIsDraft(true);
          toast.info("Unsaved draft recovered.", { icon: "📝" });
        }
      } catch (e) {
        console.error("Failed to parse local draft", e);
      }
    }
  }, [tutorId, initialTutor]);

  useEffect(() => {
    if (!isMounted) return;
    
    const currentString = JSON.stringify(tutor);
    const initialString = JSON.stringify(initialTutor);

    if (currentString !== initialString) {
      localStorage.setItem(`tutor-draft-${tutorId}`, currentString);
      setIsDraft(true);
    } else {
      localStorage.removeItem(`tutor-draft-${tutorId}`);
      setIsDraft(false);
    }
  }, [tutor, tutorId, initialTutor, isMounted]);

  function discardDraft() {
    if (confirm("Are you sure you want to discard your unsaved changes? This will revert to your live profile.")) {
      localStorage.removeItem(`tutor-draft-${tutorId}`);
      setTutor(initialTutor);
      setIsDraft(false);
      toast.success("Draft discarded.");
    }
  }

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

      tags: tutor.tags,
      sections: tutor.sections,
      is_public: tutor.is_public,
    };

    const { error } = await supabase
      .from("tutors")
      .update(dbPayload)
      .eq("id", tutorId);

    setIsSaving(false);

    if (error) {
      toast.error("Failed to save profile", {
        description: error.message,
      });
    } else {
      localStorage.removeItem(`tutor-draft-${tutorId}`);
      setIsDraft(false);
      router.refresh();
      toast.success("Profile updated successfully!");
    }
  }

  function handleSectionDragStart(event: DragStartEvent) {
    setActiveSectionId(event.active.id as string);
  }

  function handleSectionDragEnd(event: DragEndEvent) {
    setActiveSectionId(null);
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
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
            Profile Editor
            {isDraft && (
              <span className="text-[10px] font-bold uppercase tracking-widest bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-0.5 rounded-full animate-pulse">
                Unsaved Draft
              </span>
            )}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Editing {tutor.header.firstname}&apos;s profile. Don&apos;t forget to save.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isDraft && (
            <Button 
              variant="ghost" 
              onClick={discardDraft}
              className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 mr-1"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Discard Draft
            </Button>
          )}

          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className="text-violet-600 border-violet-200 hover:bg-violet-50 dark:border-violet-800 dark:hover:bg-violet-900/20"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-full sm:max-w-full w-screen h-dvh flex flex-col p-0 overflow-hidden border-0 rounded-none sm:rounded-none [&>button]:z-60 [&>button]:text-white [&>button]:top-3 [&>button]:right-4 [&>button]:opacity-100 hover:[&>button]:bg-white/20 [&>button]:p-1 [&>button]:rounded-md">
              <DialogTitle className="sr-only">
                Live Preview of Unsaved Changes
              </DialogTitle>
              
              <div className="bg-violet-600 text-white text-xs font-semibold h-10 flex items-center justify-center gap-2 shrink-0 w-full pr-12 shadow-md relative z-50">
                <Eye className="h-3.5 w-3.5" />
                You are viewing a live preview of your unsaved changes.
              </div>
              <div className="flex-1 overflow-y-auto relative bg-background">
                <TutorProfileContent tutor={tutor} />
              </div>
            </DialogContent>
          </Dialog>

          <Button onClick={save} disabled={isSaving || !isDraft} className="bg-violet-600 hover:bg-violet-700 text-white">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="mt-8 space-y-10">
        <ProfileHeaderEditor tutor={tutor} updateTutor={setTutor} />

        <TagsEditor 
          tags={tutor.tags || []} 
          updateTags={(newTags) => setTutor((prev) => ({ ...prev, tags: newTags }))} 
        />

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
          onDragStart={handleSectionDragStart}
          onDragEnd={handleSectionDragEnd}
          onDragCancel={() => setActiveSectionId(null)}
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
                    updateSection(sId, { ...section, modules: section.modules.map(m => m.id === mId ? newMod : m) });
                  }}
                  deleteModule={(sId, mId) => {
                    const section = tutor.sections.find(s => s.id === sId);
                    if (!section) return;
                    updateSection(sId, { ...section, modules: section.modules.filter(m => m.id !== mId) });
                  }}
                  addModule={(sId, type) => {
                    const section = tutor.sections.find(s => s.id === sId);
                    if (!section) return;
                    updateSection(sId, { ...section, modules: [...section.modules, createModule(type)] });
                  }}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay dropAnimation={{ sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }) }}>
            {activeSection ? (
              <SortableSectionWrapper
                section={activeSection}
                sensors={sensors}
                handleModuleDragEnd={() => {}}
                deleteSection={() => {}}
                updateModule={() => {}}
                deleteModule={() => {}}
                addModule={() => {}}
                isOverlay={true}
              />
            ) : null}
          </DragOverlay>

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

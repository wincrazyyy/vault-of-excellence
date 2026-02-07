// app/tutors/[id]/edit/page.tsx
"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Type, Image as ImageIcon, CreditCard, Minus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Tutor } from "@/components/tutors/types";
import { tutor as defaultTutor } from "../tutor-template";
import type { Section, Module } from "@/lib/sections/types";
import { ModuleEditor } from "@/components/sections/module-editor";

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

  function addSection() {
    const newSection: Section = {
      id: `section-${Date.now()}`, 
      modules: []
    };

    setTutor((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
  }

  function addModule(sectionId: string, type: Module["type"]) {
    const section = tutor.sections.find((s) => s.id === sectionId);
    if (!section) return;

    const newModule: Module = {
      id: `module-${Date.now()}`,
      type: type,
      ...(type === "rte" && { content: { doc: { type: "doc", content: [] } } }),
      ...(type === "image" && { content: { src: "", alt: "" } }),
      ...(type === "miniCard" && { content: { kind: "value", title: "New Card", value: "" } }),
      ...(type === "divider" && { content: { variant: "line" } }),
    } as Module;

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

  function updateModule(sectionId: string, moduleId: string, newModule: Module) {
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
    // Template: replace with Supabase update later
    preview();
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Edit tutor profile</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Changes are not saved until you click the Save button. You can also preview your changes before saving.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/tutors/${tutorId}`}>
              Back to profile
            </Link>
          </Button>
          <Button variant="outline" onClick={preview}>
            Preview
          </Button>
          <Button onClick={save}>
            Save
          </Button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {tutor.sections.map((section) => (
          <Card key={section.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium opacity-50 uppercase tracking-wider">
                Section: {section.id}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => deleteSection(section.id)} className="text-destructive hover:bg-destructive/10">
                Delete Section
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              {section.modules.map((module) => (
                <ModuleEditor
                  key={module.id}
                  module={module}
                  updateModule={(newMod) => updateModule(section.id, module.id, newMod)}
                  deleteModule={() => deleteModule(section.id, module.id)}
                />
              ))}

              <div className="pt-4 border-t border-dashed flex justify-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Module
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-48">
                    <DropdownMenuItem onClick={() => addModule(section.id, "rte")}>
                      <Type className="mr-2 h-4 w-4" /> Rich Text
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addModule(section.id, "image")}>
                      <ImageIcon className="mr-2 h-4 w-4" /> Image
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addModule(section.id, "miniCard")}>
                      <CreditCard className="mr-2 h-4 w-4" /> Mini Card
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => addModule(section.id, "divider")}>
                      <Minus className="mr-2 h-4 w-4" /> Divider
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button 
          variant="outline" 
          className="w-full border-dashed py-8" 
          onClick={addSection}
        >
          + Add New Section
        </Button>
      </div>
    </main>
  );
}
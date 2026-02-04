// app/tutors/[id]/edit/page.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { Tutor } from "@/components/tutors/types";
import { tutor as defaultTutor } from "../tutor-template";
import type { Section, Module } from "@/lib/sections/types";
import { ModuleEditor } from "@/components/sections/module-editor";

export default function EditTutorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const tutorId = params?.id ?? "1";

  const [tutor, setTutor] = React.useState<Tutor>(defaultTutor);

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
            Template editor. Wire this to Supabase later.
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
        {tutor.sections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle>Section {section.id}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.modules.map((module) => (
                <ModuleEditor
                  key={module.id}
                  module={module}
                  updateModule={(newModule) => updateModule(section.id, module.id, newModule)}
                />
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
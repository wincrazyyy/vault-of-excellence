import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import { getTutorProfile } from "@/lib/tutors/getTutor";
import { TutorEditor } from "@/components/tutors/edit/tutor-editor";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTutorPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="p-10 text-center animate-pulse">Loading Editor...</div>}>
      <EditorDataLoader params={params} />
    </Suspense>
  );
}

async function EditorDataLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return redirect("/auth/login");
  }

  if (user.id !== id) {
    console.warn(`User ${user.id} attempted to edit tutor profile ${id}`);
    return notFound(); 
  }

  const tutor = await getTutorProfile(id);

  if (!tutor) {
    return notFound();
  }

  return <TutorEditor tutorId={id} initialTutor={tutor} />;
}

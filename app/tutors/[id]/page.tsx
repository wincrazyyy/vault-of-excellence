import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTutorProfile } from "@/lib/tutors/getTutor";
import { TutorProfileContent } from "@/components/tutors/tutor-profile-content";
import { ProfileNotVerified, ProfileNotPublic } from "@/components/tutors/profile-alerts";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TutorProfilePage({ params }: PageProps) {
  return (
    <Suspense 
      fallback={
        <div className="flex min-h-[50vh] items-center justify-center text-muted-foreground animate-pulse">
          Loading Tutor Profile...
        </div>
      }
    >
      <TutorDataLoader params={params} />
    </Suspense>
  );
}

async function TutorDataLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tutor = await getTutorProfile(id);

  if (!tutor) {
    notFound();
  }

  if (!tutor.header.is_verified) {
    return <ProfileNotVerified />;
  }

  if (!tutor.is_public) { 
    return <ProfileNotPublic />;
  }

  return <TutorProfileContent tutor={tutor} />;
}

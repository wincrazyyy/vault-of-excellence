import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTutorProfile } from "@/lib/tutors/getTutor";
import { TutorProfileContent } from "@/components/tutors/tutor-profile-content";
import { Button } from "@/components/ui/button";
import { ShieldAlert, EyeOff } from "lucide-react";

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
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
          <ShieldAlert className="h-8 w-8 text-amber-600 dark:text-amber-400" />
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Profile Not Verified</h1>
        <p className="mb-6 max-w-md text-muted-foreground">
          This tutor profile has not been verified yet. If this is your profile, please complete the verification application to make it active.
        </p>
        <Button asChild className="bg-violet-600 hover:bg-violet-700 text-white">
          <Link href="/apply">Apply for Verification</Link>
        </Button>
      </div>
    );
  }

  if (!tutor.is_public) { 
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <EyeOff className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="mb-2 text-2xl font-bold tracking-tight">Profile Not Public</h1>
        <p className="mb-6 max-w-md text-muted-foreground">
          This profile is currently hidden. If this is your profile, you can change your visibility settings from your dashboard.
        </p>
        <Button asChild variant="outline">
          <Link href="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    );
  }

  return <TutorProfileContent tutor={tutor} />;
}

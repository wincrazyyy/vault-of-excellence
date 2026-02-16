import { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";

import { getTutorProfile } from "@/lib/tutors/getTutor";

import { ShareCard } from "@/components/dashboard/share-card";
import { ProfileStatusCard } from "@/components/dashboard/profile-status-card";
import { PerformanceCard } from "@/components/dashboard/performance-card";
import { MilestonesCard } from "@/components/dashboard/milestones-card";

export default async function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return redirect("/auth/login");

  const tutor = await getTutorProfile(user.id);

  if (!tutor) {
    return (
      <div className="p-10 text-center text-muted-foreground">
        <h3 className="text-lg font-semibold">Profile not found</h3>
        <p>Please contact support or try refreshing the page.</p>
      </div>
    );
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {tutor.header.firstname}. Here is an overview of your profile.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/tutors/${user.id}`} target="_blank">
              <Eye className="mr-2 h-4 w-4" />
              View Public Page
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/tutors/${user.id}/edit`}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Profile
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
           <ProfileStatusCard tutor={tutor} />
           <PerformanceCard tutor={tutor} />
        </div>

        <div className="space-y-6 lg:col-span-1">
             <MilestonesCard tutor={tutor} />
             <ShareCard tutorId={user.id} />
        </div>
      </div>
    </main>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10 space-y-8">
       <div className="flex justify-between items-center">
         <div className="space-y-2">
           <div className="h-8 w-48 bg-muted animate-pulse rounded" />
           <div className="h-4 w-64 bg-muted animate-pulse rounded" />
         </div>
       </div>
       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         <div className="md:col-span-2 h-64 bg-muted animate-pulse rounded-xl" />
         <div className="h-64 bg-muted animate-pulse rounded-xl" />
       </div>
    </div>
  );
}

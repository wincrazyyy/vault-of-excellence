import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Loader2, Info } from "lucide-react";
import { ScheduleCalendar } from "@/components/dashboard/schedule/schedule-calendar";

export default async function SchedulePage() {
  return (
    <Suspense fallback={<ScheduleSkeleton />}>
      <ScheduleContent />
    </Suspense>
  );
}

async function ScheduleContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/auth/login");

  const { data: availability, error } = await supabase
    .from("tutor_availability")
    .select("id, day_of_week, start_time, end_time")
    .eq("tutor_id", user.id);

  if (error) {
    console.error("Error fetching availability:", error);
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Schedule</h1>
          <p className="text-muted-foreground mt-2">
            Click and drag on the calendar to set your weekly availability.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 px-4 py-2 rounded-md text-sm border border-blue-200 dark:border-blue-800/50">
          <Info className="h-4 w-4" />
          <span>Google Calendar sync coming soon.</span>
        </div>
      </div>

      <ScheduleCalendar initialData={availability || []} />
    </main>
  );
}

function ScheduleSkeleton() {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="h-8 w-64 bg-muted animate-pulse rounded" />
        <div className="h-4 w-96 bg-muted animate-pulse rounded mt-2" />
      </div>
      <div className="h-187.5 w-full bg-muted/30 rounded-xl flex items-center justify-center border border-dashed">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </main>
  );
}

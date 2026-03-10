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

  const { data: availability, error: availError } = await supabase
    .from("tutor_availability")
    .select("id, day_of_week, start_time, end_time")
    .eq("tutor_id", user.id);

  if (availError) console.error("Error fetching availability:", availError);

  const { data: rawEngagements, error: engError } = await supabase
    .from("engagements")
    .select(`
      id, 
      status, 
      scheduled_start, 
      scheduled_end, 
      guest_name,
      students (firstname, lastname)
    `)
    .eq("tutor_id", user.id)
    .not("scheduled_start", "is", null); 

  if (engError) console.error("Error fetching engagements:", engError);

  const formattedEngagements = (rawEngagements || []).map((eng: any) => ({
    id: eng.id,
    status: eng.status,
    scheduled_start: eng.scheduled_start,
    scheduled_end: eng.scheduled_end,
    guest_name: eng.guest_name,
    students: Array.isArray(eng.students) ? eng.students[0] : eng.students
  }));

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Master Calendar</h1>
          <p className="text-muted-foreground mt-2">
            Manage your recurring availability and view your upcoming lessons.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 px-4 py-2 rounded-md text-sm border border-blue-200 dark:border-blue-800/50">
          <Info className="h-4 w-4" />
          <span>Google Calendar sync coming soon.</span>
        </div>
      </div>

      <ScheduleCalendar 
        initialData={availability || []} 
        engagements={formattedEngagements} 
      />
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

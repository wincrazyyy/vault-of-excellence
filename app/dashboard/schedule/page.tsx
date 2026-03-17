import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Loader2, Info, CheckCircle2 } from "lucide-react";
import { ScheduleCalendar } from "@/components/dashboard/schedule/schedule-calendar";
import { google } from "googleapis";

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

  const { data: availability } = await supabase
    .from("tutor_availability")
    .select("id, day_of_week, start_time, end_time")
    .eq("tutor_id", user.id);

  const { data: rawEngagements } = await supabase
    .from("engagements")
    .select(`id, status, scheduled_start, scheduled_end, guest_name, students (firstname, lastname)`)
    .eq("tutor_id", user.id)
    .not("scheduled_start", "is", null);

  const formattedEngagements = (rawEngagements || []).map((eng: any) => ({
    id: eng.id,
    status: eng.status,
    scheduled_start: eng.scheduled_start,
    scheduled_end: eng.scheduled_end,
    guest_name: eng.guest_name,
    students: Array.isArray(eng.students) ? eng.students[0] : eng.students
  }));

  const { data: integration } = await supabase
    .from("tutor_integrations")
    .select("google_access_token, google_refresh_token")
    .eq("tutor_id", user.id)
    .single();

  let googleEvents: any[] = [];
  const isConnected = !!integration?.google_refresh_token;

  if (isConnected) {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );

      oauth2Client.setCredentials({
        access_token: integration.google_access_token,
        refresh_token: integration.google_refresh_token,
      });

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });

      const timeMin = new Date();
      timeMin.setDate(timeMin.getDate() - 7);
      
      const timeMax = new Date();
      timeMax.setDate(timeMax.getDate() + 28);

      const res = await calendar.events.list({
        calendarId: "primary",
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
        orderBy: "startTime",
      });

      googleEvents = (res.data.items || []).map((item) => ({
        id: item.id,
        title: item.summary || "Busy",
        start: item.start?.dateTime || item.start?.date,
        end: item.end?.dateTime || item.end?.date,
      }));
      
    } catch (error) {
      console.error("Failed to fetch Google Events:", error);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Master Calendar</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2">
            Manage your recurring availability and view your upcoming lessons.
          </p>
        </div>

        {!isConnected ? (
          <a 
            href="/api/google/connect"
            className="flex w-full sm:w-auto justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 sm:py-2 rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
               <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
               <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
               <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
               <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Connect Google Calendar
          </a>
        ) : (
          <div className="flex w-full sm:w-auto justify-center items-center gap-2 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 px-4 py-2.5 sm:py-2 rounded-md text-sm border border-green-200 dark:border-green-800/50">
            <CheckCircle2 className="h-4 w-4" />
            <span>Google Calendar Sync Active</span>
          </div>
        )}
      </div>

      <ScheduleCalendar 
        initialData={availability || []} 
        engagements={formattedEngagements} 
        googleEvents={googleEvents}
      />
    </main>
  );
}

function ScheduleSkeleton() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-8">
        <h1 className="h-8 w-48 sm:w-64 bg-muted animate-pulse rounded" />
        <div className="h-4 w-full sm:w-96 bg-muted animate-pulse rounded mt-2" />
      </div>
      <div className="h-125 sm:h-187.5 w-full bg-muted/30 rounded-xl flex items-center justify-center border border-dashed">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    </main>
  );
}

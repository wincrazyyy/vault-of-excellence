import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Mail, MessageSquare, Calendar, Inbox, Clock } from "lucide-react";
import { EngagementActions } from "@/components/dashboard/engagements/engagement-actions";

export default async function EngagementsPage() {
  return (
    <Suspense fallback={<EngagementsSkeleton />}>
      <EngagementsContent />
    </Suspense>
  );
}

async function EngagementsContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/auth/login");

  const { data: tutor } = await supabase.from("tutors").select("is_verified").eq("id", user.id).single();
  if (!tutor?.is_verified) return redirect("/apply");

  const { data: engagements, error } = await supabase
    .from("engagements")
    .select(`
      *,
      students (
        firstname,
        lastname
      )
    `)
    .eq("tutor_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching engagements:", error);
  }

  const now = new Date();

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Lesson Requests</h1>
        <p className="text-muted-foreground mt-2">Manage your incoming messages and active students.</p>
      </div>

      {!engagements || engagements.length === 0 ? (
        <Card className="w-full bg-muted/20 border-dashed shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Inbox className="h-8 w-8 text-muted-foreground/70" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No lesson requests yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              When students or parents reach out to book a lesson with you, their messages will appear right here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {engagements.map((eng) => {
            const isGuest = !eng.student_id;
            const displayName = isGuest 
              ? eng.guest_name 
              : `${eng.students?.firstname} ${eng.students?.lastname}`;
            const displayEmail = eng.guest_email || "No email provided";

            const isExpired = eng.status === 'pending' && eng.scheduled_start && new Date(eng.scheduled_start) < now;

            return (
              <Card key={eng.id} className="w-full overflow-hidden border-violet-100 dark:border-violet-900/30">
                <CardHeader className="bg-muted/30 pb-4 border-b">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        {displayName}
                        {isExpired ? (
                          <Badge variant="secondary" className="bg-muted text-muted-foreground">Expired</Badge>
                        ) : eng.status === 'pending' ? (
                          <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">Pending</Badge>
                        ) : eng.status === 'active' ? (
                          <Badge variant="default" className="bg-green-600">Active</Badge>
                        ) : eng.status === 'completed' ? (
                          <Badge variant="outline">Completed</Badge>
                        ) : eng.status === 'cancelled' ? (
                          <Badge variant="destructive">Declined</Badge>
                        ) : null}

                        {!isGuest && <Badge variant="outline" className="border-violet-200 text-violet-600 dark:text-violet-400">Registered Student</Badge>}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {displayEmail}</span>
                        <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {new Date(eng.created_at).toLocaleDateString()}</span>
                        {eng.scheduled_start && (
                          <span className="flex items-center gap-1 text-violet-600 dark:text-violet-400 font-medium">
                            <Clock className="h-3.5 w-3.5" /> 
                            Requested: {new Date(eng.scheduled_start).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        )}
                      </CardDescription>
                    </div>

                    {eng.status === 'pending' && !isExpired && (
                      <EngagementActions engagementId={eng.id} />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <div>
                    <p className="flex items-center gap-2 font-semibold text-muted-foreground mb-2">
                      <MessageSquare className="h-4 w-4" /> Message
                    </p>
                    <div className="bg-muted/50 p-4 rounded-md text-foreground whitespace-pre-wrap text-sm border shadow-inner">
                      {eng.initial_message || "No message provided."}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}

function EngagementsSkeleton() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-6 sm:mb-8">
        <div className="h-8 w-48 sm:w-64 bg-muted animate-pulse rounded" />
        <div className="h-4 w-64 sm:w-96 bg-muted animate-pulse rounded mt-2" />
      </div>
      <div className="space-y-4 sm:space-y-6">
        <Card className="w-full overflow-hidden border-violet-100 dark:border-violet-900/30">
          <CardHeader className="bg-muted/30 pb-4 border-b p-4 sm:p-6">
            <div className="h-6 w-48 sm:w-64 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-32 sm:w-48 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-4 sm:pt-4">
            <div className="h-4 w-24 bg-muted animate-pulse rounded mb-3 sm:mb-4" />
            <div className="h-20 w-full bg-muted/50 animate-pulse rounded-md" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

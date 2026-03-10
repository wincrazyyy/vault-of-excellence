import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { approveApplication, rejectApplication } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function AdminDashboard() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <AdminContent />
    </Suspense>
  );
}

async function AdminContent() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect("/auth/login");

  const { data: tutor } = await supabase
    .from("tutors")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!tutor?.is_admin) {
    return redirect("/");
  }

  const { data: applications, error } = await supabase
    .from("tutor_applications")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching applications:", error);
  }

  return (
    <main className="min-h-screen bg-muted/20 py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Review pending tutor applications.</p>
        </div>

        {applications?.length === 0 ? (
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="flex flex-col items-center justify-center h-40 text-muted-foreground">
              <p>No pending applications to review!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {applications?.map((app) => (
              <Card key={app.id}>
                <CardHeader className="pb-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">
                        {app.firstname} {app.lastname}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {app.email} • {app.phone || "No phone provided"}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <form action={rejectApplication.bind(null, app.id)}>
                        <Button variant="destructive" size="sm">Reject</Button>
                      </form>
                      <form action={approveApplication.bind(null, app.id, app.tutor_id)}>
                        <Button className="bg-green-600 hover:bg-green-700 text-white" size="sm">
                          Approve Tutor
                        </Button>
                      </form>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-sm">
                  
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-muted-foreground mb-1">Education</p>
                      <p>{app.degree} in {app.major}</p>
                      <p className="text-muted-foreground">{app.university} (Class of {app.graduation_year})</p>
                    </div>
                    <div>
                      <p className="font-semibold text-muted-foreground mb-1">Teaching Details</p>
                      <p>Subject: {app.teaching_subject}</p>
                      <p>Experience: {app.teaching_experience_years} Years</p>
                      <p>Intent: {app.tutoring_intent}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-muted-foreground mb-2">Self Introduction</p>
                    <div className="bg-muted p-3 rounded-md text-foreground whitespace-pre-wrap">
                      {app.self_intro}
                    </div>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function AdminSkeleton() {
  return (
    <main className="min-h-screen bg-muted/20 py-10 px-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-transparent bg-muted animate-pulse w-fit rounded">Admin Dashboard</h1>
          <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
        </div>
        <Card className="h-40 flex items-center justify-center opacity-80">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </Card>
      </div>
    </main>
  );
}

// app/apply/page.tsx
import { Suspense } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ApplyForm } from "@/components/apply/apply-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Loader2 } from "lucide-react";

export default function ApplyPage() {
  return (
    <Suspense fallback={<ApplySkeleton />}>
      <ApplyContent />
    </Suspense>
  );
}

async function ApplyContent() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  const { data: tutor } = await supabase
    .from("tutors")
    .select("is_verified")
    .eq("id", user.id)
    .single();

  if (!tutor) {
    redirect("/dashboard");
  }

  if (tutor.is_verified) {
    redirect("/dashboard");
  }

  const { data: app } = await supabase
    .from("tutor_applications")
    .select("status")
    .eq("tutor_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (app?.status === "pending") {
    return (
      <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center p-4 bg-muted/20">
        <Card className="max-w-md w-full text-center py-8 border-violet-100 dark:border-violet-900/50 shadow-lg">
          <CardHeader>
            <div className="mx-auto bg-violet-100 dark:bg-violet-900/30 p-4 rounded-full mb-4 w-fit">
              <Clock className="h-10 w-10 text-violet-600 dark:text-violet-400 animate-pulse" />
            </div>
            <CardTitle className="text-2xl">Application Under Review</CardTitle>
            <CardDescription className="pt-3 text-base">
              Thank you for applying! Our team is currently reviewing your profile. We will notify you via email once you are approved.
            </CardDescription>
            <div className="mt-8">
              <Button asChild variant="outline" className="w-full">
                <Link href="/">Return to Homepage</Link>
              </Button>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const userFirstName = user.user_metadata?.first_name || "";
  const userLastName = user.user_metadata?.last_name || "";

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Become a Verified Tutor</h1>
          <p className="mt-2 text-muted-foreground">
            Tell us about your experience and qualifications to join the team.
          </p>
        </div>
        
        <ApplyForm 
          userEmail={user.email || ""} 
          initialFirstName={userFirstName}
          initialLastName={userLastName}
        />
      </div>
    </div>
  );
}

function ApplySkeleton() {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center p-4 bg-muted/20">
      <Card className="max-w-md w-full text-center py-12 opacity-80">
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
          <p className="text-sm text-muted-foreground">Loading application...</p>
        </CardContent>
      </Card>
    </div>
  );
}

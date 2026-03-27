import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ReviewsManager } from "@/components/dashboard/reviews/reviews-manager";

export default async function ReviewsDashboardPage() {
  return (
    <Suspense fallback={<ReviewsSkeleton />}>
      <ReviewsContent />
    </Suspense>
  );
}

async function ReviewsContent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return redirect("/auth/login");

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("tutor_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reviews:", error);
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <ReviewsManager initialReviews={reviews || []} />
    </main>
  );
}

function ReviewsSkeleton() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-6 sm:mb-8 flex justify-between">
        <div>
          <div className="h-8 w-48 sm:w-64 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 sm:w-96 bg-muted animate-pulse rounded mt-2" />
        </div>
        <div className="h-8 w-32 bg-muted animate-pulse rounded" />
      </div>
      <div className="space-y-4 mt-8">
        <Card className="w-full border-border">
          <CardHeader className="bg-muted/30 pb-4 border-b p-4 sm:p-6">
            <div className="flex justify-between">
              <div className="space-y-2">
                <div className="h-6 w-48 bg-muted animate-pulse rounded" />
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
              </div>
              <div className="h-8 w-24 bg-muted animate-pulse rounded" />
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-4">
            <div className="h-12 w-full bg-muted/50 animate-pulse rounded-md" />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

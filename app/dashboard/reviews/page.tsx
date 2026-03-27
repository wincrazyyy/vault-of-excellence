import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquareQuote, Calendar, ShieldCheck, AlertCircle } from "lucide-react";
import { ReviewActions } from "@/components/dashboard/reviews/review-actions";
import { cn } from "@/lib/utils";

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

  const pendingReviews = reviews?.filter(r => !r.is_visible && !r.is_legacy) || [];
  const processedReviews = reviews?.filter(r => r.is_visible || r.is_legacy) || [];

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Reviews</h1>
          <p className="text-muted-foreground mt-2">Approve incoming testimonials and manage your public reputation.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 py-1.5">
            <Star className="h-3.5 w-3.5 mr-1 fill-current" />
            {reviews?.filter(r => r.is_visible && !r.is_legacy).length || 0} Official Reviews
          </Badge>
        </div>
      </div>

      {(!reviews || reviews.length === 0) ? (
        <Card className="w-full bg-muted/20 border-dashed shadow-none">
          <CardContent className="flex flex-col items-center justify-center py-24 text-center">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <MessageSquareQuote className="h-8 w-8 text-muted-foreground/70" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No reviews yet</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              When students leave a review on your profile, it will appear here for your approval.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-10">
          {pendingReviews.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-amber-600 dark:text-amber-500">
                <AlertCircle className="h-5 w-5" />
                Action Required: Pending Approval ({pendingReviews.length})
              </h2>
              <div className="grid gap-4">
                {pendingReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          )}

          {processedReviews.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                Live & Processed Reviews
              </h2>
              <div className="grid gap-4 opacity-90">
                {processedReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            </div>
          )}
          
        </div>
      )}
    </main>
  );
}

function ReviewCard({ review }: { review: any }) {
  const displayName = review.guest_firstname ? `${review.guest_firstname} ${review.guest_lastname}` : "Anonymous Student";
  
  return (
    <Card className={cn(
      "w-full overflow-hidden transition-all duration-200",
      !review.is_visible && !review.is_legacy ? "border-amber-200 dark:border-amber-900/50 shadow-md ring-1 ring-amber-500/10" : "border-border shadow-sm",
      !review.is_visible && review.is_legacy ? "grayscale-[0.5] opacity-70" : ""
    )}>
      <CardHeader className={cn(
        "pb-4 border-b",
        !review.is_visible && !review.is_legacy ? "bg-amber-50/50 dark:bg-amber-900/10" : "bg-muted/30"
      )}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              {displayName}
              
              {!review.is_visible && !review.is_legacy ? (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-400">Needs Approval</Badge>
              ) : review.is_visible ? (
                <Badge variant="default" className="bg-green-600">Published</Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">Hidden</Badge>
              )}

              {review.is_legacy && (
                <Badge variant="secondary" className="text-[10px] uppercase bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">Legacy Import</Badge>
              )}
            </CardTitle>
            
            <CardDescription className="flex items-center gap-4 mt-2">
              {review.rating && !review.is_legacy && (
                <span className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "h-3.5 w-3.5",
                        i < review.rating ? "fill-orange-400 text-orange-400" : "text-muted-foreground/30"
                      )}
                    />
                  ))}
                </span>
              )}
              {review.guest_school_name && (
                <span className="text-muted-foreground font-medium">• {review.guest_school_name}</span>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 ml-1" /> 
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </CardDescription>
          </div>
          
          <ReviewActions reviewId={review.id} isVisible={review.is_visible} />
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-foreground whitespace-pre-wrap italic leading-relaxed">
          "{review.comment || (review.is_legacy ? "No text provided." : "Rating only.")}"
        </p>
      </CardContent>
    </Card>
  );
}

function ReviewsSkeleton() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 sm:px-6 py-6 sm:py-10">
      <div className="mb-6 sm:mb-8">
        <div className="h-8 w-48 sm:w-64 bg-muted animate-pulse rounded" />
        <div className="h-4 w-64 sm:w-96 bg-muted animate-pulse rounded mt-2" />
      </div>
      <div className="space-y-4">
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

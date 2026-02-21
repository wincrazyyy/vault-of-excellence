import { TutorProfile, Review } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, MessageSquareQuote } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewsProps {
  tutor: TutorProfile;
  reviews: Review[];
}

export function Reviews({ tutor, reviews }: ReviewsProps) {
  const visibleReviews = reviews.filter((r) => r.is_visible);
  const hasVisibleReviews = visibleReviews.length > 0;

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0 pb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Student Reviews
              {hasVisibleReviews && (
                <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {visibleReviews.length}
                </span>
              )}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              What students say about their experience with {tutor.header.firstname}.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hidden sm:flex">
              View all
            </Button>
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700">
              Leave a review
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        {hasVisibleReviews ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {visibleReviews.map((r) => {
              const studentName = `${r.firstname} ${r.lastname}`;
              
              return (
                <Card
                  key={r.id}
                  className="bg-muted/30 border-none shadow-sm hover:bg-muted/50 transition-colors"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-foreground">
                          {studentName}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                          {new Date(r.created_at).toLocaleDateString(undefined, {
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3 w-3",
                              i < r.rating 
                                ? "fill-orange-400 text-orange-400" 
                                : "text-muted-foreground/30"
                            )}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="relative">
                      <MessageSquareQuote className="absolute -top-2 -left-2 h-8 w-8 text-violet-500/10 -z-10" />
                      <p className="text-sm leading-relaxed text-muted-foreground italic">
                        "{r.comment || "Student left a rating without a comment."}"
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed rounded-2xl bg-muted/20">
            <div className="p-3 bg-background rounded-full mb-4 shadow-sm">
              <Star className="h-6 w-6 text-muted-foreground/40" />
            </div>
            <h3 className="font-medium text-foreground">No reviews yet</h3>
            <p className="text-sm text-muted-foreground max-w-62.5 mt-1">
              Be the first student to share your experience!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

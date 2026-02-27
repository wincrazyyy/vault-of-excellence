"use client";

import Image from "next/image";
import { TutorProfile, Review } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Star, MessageSquareQuote, User2, Info } from "lucide-react";
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
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
              Leave a review
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-0">
        {hasVisibleReviews ? (
          <div className="grid gap-6 sm:grid-cols-2">
            <TooltipProvider delayDuration={300}>
              {visibleReviews.map((r) => {
                const studentName = `${r.firstname} ${r.lastname}`;
                const initials = `${r.firstname?.[0] || ""}${r.lastname?.[0] || ""}`;
                
                return (
                  <Card
                    key={r.id}
                    className="bg-muted/30 border-none shadow-sm hover:bg-muted/50 transition-colors"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4 gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                            {r.image_url ? (
                              <Image
                                src={r.image_url}
                                alt={studentName}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <span className="text-xs font-bold text-violet-700 dark:text-violet-300 uppercase">
                                {initials || <User2 className="h-5 w-5 opacity-50" />}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-col min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-bold text-foreground truncate max-w-30 sm:max-w-40">
                                {studentName}
                              </span>
                              {r.is_legacy && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge 
                                      variant="secondary" 
                                      className="text-[9px] px-1.5 py-0 h-4 uppercase tracking-wider bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300 cursor-help flex items-center gap-1"
                                    >
                                      Imported
                                      <Info className="h-2.5 w-2.5 opacity-70" />
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="text-xs max-w-50 text-center">
                                    <p>This testimonial was imported from an external source by the tutor.</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                            <span className="text-[11px] text-muted-foreground font-medium truncate">
                              {r.school_name ? `${r.school_name} • ` : ""}
                              {new Date(r.created_at).toLocaleDateString(undefined, {
                                month: 'short',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>

                        {!r.is_legacy && r.rating && (
                          <div className="flex gap-0.5 shrink-0 pt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  "h-3.5 w-3.5",
                                  i < r.rating! 
                                    ? "fill-orange-400 text-orange-400" 
                                    : "text-muted-foreground/30"
                                )}
                              />
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="relative mt-2">
                        <MessageSquareQuote className="absolute -top-2 -left-2 h-8 w-8 text-violet-500/10 -z-10" />
                        <p className="text-sm leading-relaxed text-muted-foreground italic relative z-10">
                          "{r.comment || (r.is_legacy ? "No text provided." : "Student left a rating without a comment.")}"
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </TooltipProvider>
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

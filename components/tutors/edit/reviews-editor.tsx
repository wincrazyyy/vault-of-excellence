"use client";

import { MessageSquareQuote, Star } from "lucide-react";
import type { TutorProfile } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ReviewsEditorProps {
  tutor: TutorProfile;
  updateTutor: (tutor: TutorProfile) => void;
}

export function ReviewsEditor({ tutor, updateTutor }: ReviewsEditorProps) {
  const { reviews } = tutor;

  const toggleReviewVisibility = (reviewId: string, isVisible: boolean) => {
    const updatedReviews = reviews.map((r) =>
      r.id === reviewId ? { ...r, is_visible: isVisible } : r
    );

    updateTutor({
      ...tutor,
      reviews: updatedReviews,
    });
  };

  const totalReviews = reviews.length;
  const visibleCount = reviews.filter((r) => r.is_visible).length;

  return (
    <Card className="border-violet-200 dark:border-violet-500/30">
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
          <MessageSquareQuote className="h-4 w-4 text-violet-500" />
          Review Management
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 space-y-4">
            <div className="rounded-xl border border-dashed border-violet-200 dark:border-violet-800 p-6 bg-violet-50/30 dark:bg-violet-900/10">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Star className="h-4 w-4 text-orange-400 fill-orange-400" />
                Moderation Policy
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Reviews are written by students and cannot be edited. You can, however, 
                choose to hide specific reviews if you feel they are no longer relevant 
                or to curate your public profile.
              </p>
              <div className="mt-4 pt-4 border-t border-violet-100 dark:border-violet-800">
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tight">
                  Pro Tip:
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Keeping a mix of reviews shows authenticity and builds higher trust with new students.
                </p>
              </div>
            </div>
          </div>

          <div className="flex-2 space-y-4 min-w-[50%]">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold uppercase text-muted-foreground">
                Your Reviews
              </Label>
              <Badge variant="secondary" className="font-mono text-[10px]">
                VISIBLE: {visibleCount} / {totalReviews}
              </Badge>
            </div>

            <div className="rounded-lg border bg-card max-h-100 overflow-y-auto custom-scrollbar">
              {reviews.length > 0 ? (
                <div className="divide-y divide-border">
                  {reviews.map((review) => {
                    const studentName = `${review.firstname} ${review.lastname}`;
                    
                    return (
                      <div
                        key={review.id}
                        className={cn(
                          "flex items-start justify-between gap-4 p-4 transition-all",
                          !review.is_visible && "bg-muted/50 grayscale-[0.5]"
                        )}
                      >
                        <div className="space-y-1.5 min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-sm truncate">
                              {studentName}
                            </span>
                            {review.is_legacy && (
                              <Badge variant="secondary" className="text-[9px] px-1.5 py-0 h-4 uppercase tracking-wider">
                                Imported
                              </Badge>
                            )}

                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "h-2.5 w-2.5",
                                    i < review.rating 
                                      ? "fill-orange-400 text-orange-400" 
                                      : "text-muted-foreground/20"
                                  )}
                                />
                              ))}
                            </div>
                            {!review.is_visible && (
                              <Badge variant="outline" className="h-4 px-1 text-[8px] uppercase border-red-200 text-red-600 bg-red-50 dark:bg-red-900/20">
                                Hidden
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-xs text-muted-foreground italic line-clamp-2 leading-normal">
                            "{review.comment || "Rating only."}"
                          </p>
                          <p className="text-[9px] text-muted-foreground uppercase font-medium">
                            {new Date(review.created_at).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center self-center shrink-0">
                          <Switch
                            checked={review.is_visible}
                            onCheckedChange={(checked) =>
                              toggleReviewVisibility(review.id, checked)
                            }
                            aria-label={`Toggle review visibility`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <MessageSquareQuote className="h-8 w-8 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    You haven&apos;t received any reviews yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

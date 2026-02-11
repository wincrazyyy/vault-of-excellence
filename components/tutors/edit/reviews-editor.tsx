"use client";

import { MessageSquareQuote } from "lucide-react";
import type { Tutor } from "@/lib/tutors/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ReviewsEditorProps {
  tutor: Tutor;
  updateTutor: (tutor: Tutor) => void;
}

export function ReviewsEditor({ tutor, updateTutor }: ReviewsEditorProps) {
  const handleTextChange = (field: "title" | "description", value: string) => {
    updateTutor({
      ...tutor,
      reviews: {
        ...tutor.reviews,
        [field]: value,
      },
    });
  };

  const toggleReviewVisibility = (index: number, isVisible: boolean) => {
    const newItems = [...tutor.reviews.items];
    newItems[index] = {
      ...newItems[index],
      visible: isVisible,
    };

    updateTutor({
      ...tutor,
      reviews: {
        ...tutor.reviews,
        items: newItems,
      },
    });
  };

  const totalReviews = tutor.reviews.items.length;
  const visibleReviews = tutor.reviews.items.filter((r) => r.visible).length;

  return (
    <Card className="border-violet-200 dark:border-violet-500/30">
      <CardHeader>
        <CardTitle className="text-sm font-medium uppercase tracking-wider flex items-center gap-2">
          <MessageSquareQuote className="h-4 w-4 text-violet-500" />
          Reviews Section
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="review-title">Section Title</Label>
              <Input
                id="review-title"
                value={tutor.reviews.title}
                onChange={(e) => handleTextChange("title", e.target.value)}
                placeholder="e.g. What students say"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="review-desc">Description</Label>
              <Textarea
                id="review-desc"
                value={tutor.reviews.description}
                onChange={(e) => handleTextChange("description", e.target.value)}
                placeholder="e.g. Read reviews from verified students..."
                className="h-32 resize-none"
              />
            </div>

            <div className="rounded-md bg-muted p-4 text-xs text-muted-foreground">
              <p>
                <strong>Note:</strong> You cannot edit review text directly. 
                Use the toggles on the right to hide specific reviews from your public profile.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Manage Visibility</Label>
              <Badge variant="secondary" className="font-mono text-xs">
                Showing {visibleReviews} / {totalReviews}
              </Badge>
            </div>

            <div className="rounded-lg border bg-card max-h-100 overflow-y-auto">
              {tutor.reviews.items.length > 0 ? (
                <div className="divide-y">
                  {tutor.reviews.items.map((review, index) => (
                    <div
                      key={index}
                      className={cn(
                        "flex items-start justify-between gap-4 p-4 transition-colors",
                        !review.visible && "bg-muted/50 opacity-70"
                      )}
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm truncate">
                            {review.name}
                          </span>
                          {!review.visible && (
                            <Badge variant="outline" className="h-5 px-1.5 text-[10px] uppercase">
                              Hidden
                            </Badge>
                          )}
                        </div>
                        {review.subtitle && (
                          <div className="text-xs text-muted-foreground truncate">
                            {review.subtitle}
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          "{review.text}"
                        </p>
                      </div>

                      <div className="flex items-center pt-1">
                        <Switch
                          checked={review.visible}
                          onCheckedChange={(checked) =>
                            toggleReviewVisibility(index, checked)
                          }
                          aria-label={`Toggle review from ${review.name}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No reviews available to manage.
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
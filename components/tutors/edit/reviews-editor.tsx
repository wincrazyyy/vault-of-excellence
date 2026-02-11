"use client";

import { MessageSquareQuote } from "lucide-react";
import type { Tutor } from "@/components/tutors/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ReviewsEditorProps {
  tutor: Tutor;
  updateTutor: (tutor: Tutor) => void;
}

export function ReviewsEditor({ tutor, updateTutor }: ReviewsEditorProps) {
  const handleChange = (field: "title" | "description", value: string) => {
    updateTutor({
      ...tutor,
      reviews: {
        ...tutor.reviews,
        [field]: value,
      },
    });
  };

  const reviewCount = tutor.reviews.items.length;

  return (
    <Card className="border-violet-200 dark:border-violet-500/30">
      <CardHeader>
        <CardTitle className="text-sm font-medium uppercase tracking-wider flex items-center gap-2">
          <MessageSquareQuote className="h-4 w-4 text-violet-500" />
          Reviews Section
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="review-title">Section Title</Label>
              <Input
                id="review-title"
                value={tutor.reviews.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="e.g. What students say"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="review-desc">Description</Label>
              <Textarea
                id="review-desc"
                value={tutor.reviews.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="e.g. Read reviews from verified students..."
                className="h-24 resize-none"
              />
            </div>
          </div>

          <div className="rounded-lg border bg-muted/30 p-4">
            <h3 className="text-xs font-semibold uppercase text-muted-foreground mb-3">
              Data Summary
            </h3>
            <div className="flex items-center justify-between text-sm">
              <span>Total Reviews</span>
              <span className="font-mono font-medium">{reviewCount}</span>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <p>
                Individual reviews are managed automatically through the booking system and cannot be edited manually here to ensure authenticity.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
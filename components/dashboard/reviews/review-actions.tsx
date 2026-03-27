"use client";

import { useState } from "react";
import { toggleReviewVisibility } from "@/lib/actions/reviews";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ReviewActionsProps {
  reviewId: string;
  isVisible: boolean;
}

export function ReviewActions({ reviewId, isVisible }: ReviewActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  async function handleToggle() {
    setIsUpdating(true);
    const newVisibility = !isVisible;
    
    try {
      await toggleReviewVisibility(reviewId, newVisibility);
      toast.success(newVisibility ? "Review approved and published!" : "Review hidden from profile.");
      router.refresh(); 
    } catch (error: any) {
      toast.error("Failed to update review", { description: error.message });
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <Button 
      size="sm" 
      onClick={handleToggle}
      disabled={isUpdating}
      variant={isVisible ? "outline" : "default"}
      className={
        !isVisible 
          ? "bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-500/20" 
          : "text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 border-border"
      }
    >
      {isUpdating ? (
        <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
      ) : !isVisible ? (
        <CheckCircle2 className="mr-1.5 h-4 w-4" />
      ) : (
        <EyeOff className="mr-1.5 h-4 w-4" />
      )}
      {!isVisible ? "Approve & Publish" : "Hide Review"}
    </Button>
  );
}

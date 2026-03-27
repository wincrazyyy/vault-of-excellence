"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Star, Loader2, MessageSquareQuote } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { submitGuestReview } from "@/lib/actions/reviews";

interface LeaveReviewModalProps {
  tutorId: string;
  tutorName: string;
}

export function LeaveReviewModal({ tutorId, tutorName }: LeaveReviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    school_name: "",
    comment: ""
  });

  const handleSubmit = async () => {
    if (!formData.firstname.trim() || !formData.lastname.trim()) {
      toast.error("Please provide your first and last name.");
      return;
    }

    if (!formData.comment.trim()) {
      toast.error("Please write a short testimonial.");
      return;
    }

    setIsSubmitting(true);

    try {
      await submitGuestReview({
        tutor_id: tutorId,
        guest_firstname: formData.firstname,
        guest_lastname: formData.lastname,
        guest_school_name: formData.school_name,
        rating: rating,
        comment: formData.comment,
      });

      toast.success("Review submitted!", {
        description: "Your review has been sent to the tutor for approval."
      });
      setFormData({ firstname: "", lastname: "", school_name: "", comment: "" });
      setRating(5);
      setIsOpen(false);
    } catch (error: any) {
      toast.error("Failed to submit review", { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
          Leave a review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125 p-0 overflow-hidden border-violet-200 dark:border-violet-800">
        
        <div className="bg-violet-50/50 dark:bg-violet-900/10 p-6 border-b border-violet-100 dark:border-violet-800">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <MessageSquareQuote className="h-5 w-5 text-violet-500" />
              Review {tutorName}
            </DialogTitle>
            <DialogDescription>
              Share your experience to help other students find the perfect tutor. Your review will be publicly visible once approved.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2 flex flex-col items-center justify-center py-2">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Overall Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(null)}
                  className="p-1 transition-transform hover:scale-110 active:scale-95 focus:outline-none"
                >
                  <Star 
                    className={cn(
                      "h-8 w-8 transition-colors",
                      (hoveredStar !== null ? star <= hoveredStar : star <= rating)
                        ? "fill-orange-400 text-orange-400"
                        : "text-muted-foreground/20"
                    )} 
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">First Name *</Label>
              <Input 
                placeholder="e.g. Sarah" 
                value={formData.firstname} 
                onChange={e => setFormData({...formData, firstname: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Last Name *</Label>
              <Input 
                placeholder="e.g. M." 
                value={formData.lastname} 
                onChange={e => setFormData({...formData, lastname: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-xs">School Name (Optional)</Label>
            <Input 
              placeholder="e.g. Oxford University" 
              value={formData.school_name} 
              onChange={e => setFormData({...formData, school_name: e.target.value})}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Testimonial *</Label>
            <Textarea 
              placeholder={`How did ${tutorName} help you achieve your goals?`} 
              value={formData.comment} 
              onChange={e => setFormData({...formData, comment: e.target.value})}
              className="min-h-24 resize-none"
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting} 
            className="w-full bg-violet-600 hover:bg-violet-700 text-white"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            {isSubmitting ? "Submitting..." : "Submit Review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

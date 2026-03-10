"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader2, CheckCircle2, CalendarPlus } from "lucide-react";
import { toast } from "sonner";

interface BookLessonModalProps {
  tutorId: string;
  tutorName: string;
}

export function BookLessonModal({ tutorId, tutorName }: BookLessonModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<"form" | "success">("form");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const payload = {
      tutor_id: tutorId,
      guest_name: formData.get("name") as string,
      guest_email: formData.get("email") as string,
      initial_message: formData.get("message") as string,
      status: "pending",
    };

    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    
    const finalPayload = user 
        ? { ...payload, student_id: user.id } 
        : payload;

    const { error } = await supabase
      .from("engagements")
      .insert(finalPayload);

    setIsSubmitting(false);

    if (error) {
      if (error.code === '23505') {
        toast.error("You already have a pending request with this tutor!");
      } else {
        toast.error("Failed to send request", { description: error.message });
      }
    } else {
      setStage("success");
    }
  }

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => setStage("form"), 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white shadow-md">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Book a Lesson
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-106.25">
        {stage === "form" ? (
          <>
            <DialogHeader>
              <DialogTitle>Book a Lesson with {tutorName}</DialogTitle>
              <DialogDescription>
                Fill out the details below. {tutorName} will receive your request and get back to you shortly.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={onSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" name="name" required placeholder="John Doe" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" name="email" type="email" required placeholder="john@example.com" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">What do you need help with?</Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  required 
                  className="min-h-25"
                  placeholder="E.g., I am looking for help preparing for my upcoming A-Level Mathematics exams..." 
                />
              </div>
              
              <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white mt-2" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? "Sending Request..." : "Send Request"}
              </Button>
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-xl">Request Sent!</DialogTitle>
            <DialogDescription className="text-base">
              Your message has been sent to <strong>{tutorName}</strong>. You will receive an email as soon as they respond to your request.
            </DialogDescription>
            <Button onClick={() => setIsOpen(false)} variant="outline" className="w-full mt-4">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
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
import { Loader2, CheckCircle2, CalendarPlus, ArrowLeft, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { getTutorPublicSchedule, requestLessonAction } from "@/lib/actions/booking";

import "@/components/dashboard/schedule/schedule-calendar.css";

interface BookLessonModalProps {
  tutorId: string;
  tutorName: string;
}

export function BookLessonModal({ tutorId, tutorName }: BookLessonModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<"calendar" | "form" | "success">("calendar");

  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [scheduleData, setScheduleData] = useState<{ availability: any[]; busy: any[] }>({ availability: [], busy: [] });
  const [selectedTime, setSelectedTime] = useState<{ start: Date; end: Date } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && stage === "calendar") {
      setIsLoadingSchedule(true);
      getTutorPublicSchedule(tutorId).then((data) => {
        setScheduleData(data);
        setIsLoadingSchedule(false);
      });
    }
  }, [isOpen, tutorId, stage]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setTimeout(() => {
        setStage("calendar");
        setSelectedTime(null);
      }, 300);
    }
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedTime) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const result = await requestLessonAction({
      tutorId,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
      scheduled_start: selectedTime.start.toISOString(),
      scheduled_end: selectedTime.end.toISOString(),
    });

    setIsSubmitting(false);

    if (!result.success) {
      toast.error(result.message);
    } else {
      setStage("success");
    }
  }

  const availabilityEvents = scheduleData.availability.map((slot, index) => ({
    id: `avail-${index}`,
    groupId: "availableForBooking",
    daysOfWeek: [slot.day_of_week],
    startTime: slot.start_time,
    endTime: slot.end_time,
    display: "background",
    backgroundColor: "hsl(var(--primary) / 0.1)",
  }));

  const busyEvents = scheduleData.busy.map((event, index) => ({
    id: `busy-${index}`,
    start: event.scheduled_start || event.start,
    end: event.scheduled_end || event.end,
    display: "background",
    backgroundColor: "hsl(var(--destructive) / 0.2)",
    overlap: false,
  }));

  const allEvents = [...availabilityEvents, ...busyEvents];

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white shadow-md">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Book a Lesson
        </Button>
      </DialogTrigger>
      <DialogContent className={stage === "calendar" ? "sm:max-w-4xl" : "sm:max-w-106.25"}>
        
        {stage === "calendar" && (
          <>
            <DialogHeader>
              <DialogTitle>Select a Time</DialogTitle>
              <DialogDescription>
                Click and drag on the green areas to select your preferred lesson time.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2 relative">
              {isLoadingSchedule ? (
                <div className="h-125 w-full bg-muted/30 rounded-xl flex items-center justify-center border border-dashed">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <div className="h-125 schedule-calendar-wrapper border rounded-lg overflow-hidden p-2">
                  <FullCalendar
                    plugins={[timeGridPlugin, interactionPlugin]}
                    initialView="timeGridWeek"
                    headerToolbar={{
                      left: 'prev,next',
                      center: 'title',
                      right: 'today'
                    }}
                    events={allEvents}
                    selectable={true}
                    selectMirror={true}
                    unselectAuto={false}
                    selectConstraint="availableForBooking"
                    height="100%"
                    allDaySlot={false}
                    slotMinTime="06:00:00"
                    slotMaxTime="23:00:00"
                    select={(info) => {
                      setSelectedTime({ start: info.start, end: info.end });
                    }}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm font-medium text-muted-foreground">
                {selectedTime ? (
                  <span className="text-foreground flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-violet-600" />
                    {selectedTime.start.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })} 
                    {" - "} 
                    {selectedTime.end.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                  </span>
                ) : (
                  "Please select a time slot on the calendar."
                )}
              </div>
              <Button 
                onClick={() => setStage("form")} 
                disabled={!selectedTime}
                className="bg-violet-600 hover:bg-violet-700 text-white"
              >
                Continue
              </Button>
            </div>
          </>
        )}

        {stage === "form" && selectedTime && (
          <>
            <DialogHeader>
              <DialogTitle>Add Your Details</DialogTitle>
              <DialogDescription>
                You requested <strong>{selectedTime.start.toLocaleString([], { weekday: 'long', month: 'long', day: 'numeric' })}</strong> at <strong>{selectedTime.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>.
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
              
              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setStage("calendar")} className="w-full">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 text-white" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {isSubmitting ? "Sending..." : "Send Request"}
                </Button>
              </div>
            </form>
          </>
        )}

        {stage === "success" && (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-xl">Booking Requested!</DialogTitle>
            <DialogDescription className="text-base">
              Your request for <strong>{selectedTime?.start.toLocaleString([], { weekday: 'long', month: 'short', day: 'numeric' })}</strong> has been sent to <strong>{tutorName}</strong>. You will receive an email as soon as they respond.
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

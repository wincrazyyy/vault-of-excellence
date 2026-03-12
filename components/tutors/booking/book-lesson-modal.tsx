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

  const [areaCode, setAreaCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

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
        setAreaCode("");
        setPhoneNumber("");
      }, 300);
    }
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedTime) return;

    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    let fullPhone = null;
    if (areaCode || phoneNumber) {
      fullPhone = `+${areaCode} ${phoneNumber}`.trim();
    }

    const firstName = formData.get("firstname") as string;
    const lastName = formData.get("lastname") as string;
    const fullName = `${firstName} ${lastName}`.trim();

    const result = await requestLessonAction({
      tutorId,
      name: fullName,
      email: formData.get("email") as string,
      phone: fullPhone,
      school: formData.get("school") as string || null,
      year: formData.get("year") as string || null,
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

  const businessHours = scheduleData.availability.map((slot) => ({
    daysOfWeek: [slot.day_of_week],
    startTime: slot.start_time,
    endTime: slot.end_time,
  }));

  const busyEvents = scheduleData.busy.map((event, index) => ({
    id: `busy-${index}`,
    start: event.scheduled_start || event.start,
    end: event.scheduled_end || event.end,
    display: "background",
    classNames: ["busy-event-bg"],
  }));

  const allEvents = [...busyEvents];

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white shadow-md">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Book a Lesson
        </Button>
      </DialogTrigger>
      
      <DialogContent className={
        stage === "calendar" ? "sm:max-w-4xl" : 
        stage === "form" ? "sm:max-w-2xl" : "sm:max-w-md"
      }>
        
        {stage === "calendar" && (
          <>
            <DialogHeader>
              <DialogTitle>Select a Time</DialogTitle>
              <DialogDescription>
                Click and drag on the available areas to select your preferred lesson time.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2 relative">
              {isLoadingSchedule ? (
                <div className="h-125 w-full bg-muted/30 rounded-xl flex items-center justify-center border border-dashed">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="h-125 booking-modal-calendar schedule-calendar-wrapper border rounded-lg overflow-hidden p-2 relative">
                    <FullCalendar
                      plugins={[timeGridPlugin, interactionPlugin]}
                      initialView="timeGridWeek"
                      headerToolbar={{
                        left: 'prev,next',
                        center: 'title',
                        right: 'today'
                      }}
                      events={allEvents}
                      businessHours={businessHours}
                      selectConstraint="businessHours"
                      selectable={true}
                      selectMirror={true}
                      unselectAuto={false}
                      height="100%"
                      allDaySlot={false}
                      slotMinTime="06:00:00"
                      slotMaxTime="23:00:00"
                      select={(info) => {
                        let finalEnd = info.end;
                        let isInvalid = false;

                        const sortedBusy = [...busyEvents].sort(
                          (a, b) => new Date(a.start as string).getTime() - new Date(b.start as string).getTime()
                        );

                        for (const event of sortedBusy) {
                          const eventStart = new Date(event.start as string);
                          const eventEnd = new Date(event.end as string);

                          if (info.start >= eventStart && info.start < eventEnd) {
                            isInvalid = true;
                            break;
                          }

                          if (info.start <= eventStart && finalEnd > eventStart) {
                            finalEnd = eventStart;
                            break;
                          }
                        }

                        if (isInvalid || finalEnd.getTime() === info.start.getTime()) {
                          info.view.calendar.unselect();
                          setSelectedTime(null);
                          if (isInvalid) toast.error("That time is already booked.");
                          return;
                        }

                        if (finalEnd.getTime() !== info.end.getTime()) {
                          info.view.calendar.select(info.start, finalEnd);
                        }

                        setSelectedTime({ start: info.start, end: finalEnd });
                      }}
                    />
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-3 px-1">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <div className="h-3 w-3 rounded-[2px] border border-border bg-background shadow-sm" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <div className="h-3 w-3 rounded-[2px] border border-border bg-muted/70" />
                      <span>Unavailable</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                      <div 
                        className="h-3 w-3 rounded-[2px] border border-border opacity-80" 
                        style={{ 
                          backgroundColor: "hsl(var(--muted))", 
                          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, hsl(var(--border)) 2px, hsl(var(--border)) 4px)" 
                        }} 
                      />
                      <span>Booked</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t gap-4">
              <div className="text-sm font-medium text-muted-foreground">
                {selectedTime ? (
                  <span className="text-foreground flex items-center gap-2 bg-violet-50 dark:bg-violet-900/20 px-3 py-1.5 rounded-md border border-violet-100 dark:border-violet-800">
                    <CalendarClock className="h-4 w-4 text-violet-600 dark:text-violet-400" />
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
                className="bg-violet-600 hover:bg-violet-700 text-white w-full sm:w-auto"
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
            
            <form onSubmit={onSubmit} className="space-y-6 mt-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="firstname">Student First Name <span className="text-red-500">*</span></Label>
                  <Input id="firstname" name="firstname" required placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastname">Student Last Name <span className="text-red-500">*</span></Label>
                  <Input id="lastname" name="lastname" required placeholder="Doe" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                  <Input id="email" name="email" type="email" required placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>WhatsApp Phone Number <span className="text-red-500">*</span></Label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex items-center w-24 shrink-0">
                      <span className="absolute left-3 text-muted-foreground text-sm font-medium">+</span>
                      <Input 
                        className="pl-7" 
                        placeholder="852" 
                        maxLength={4}
                        required
                        value={areaCode}
                        onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                    <Input 
                      className="flex-1" 
                      placeholder="12345678" 
                      maxLength={15}
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="school">Current School</Label>
                  <Input id="school" name="school" placeholder="e.g. King George V School" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year">Year Group</Label>
                  <Input id="year" name="year" placeholder="e.g. Year 12" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">What do you need help with? <span className="text-red-500">*</span></Label>
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

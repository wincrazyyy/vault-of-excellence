"use client";

import { useState, useEffect, useMemo } from "react";
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
import { Loader2, CheckCircle2, CalendarPlus, ArrowLeft, ArrowRight, CalendarClock } from "lucide-react";
import { toast } from "sonner";
import { getTutorPublicSchedule, requestLessonAction } from "@/lib/actions/booking";
import "@/components/dashboard/schedule/schedule-calendar.css";

interface BookLessonModalProps {
  tutorId: string;
  tutorName: string;
}

export function BookLessonModal({ tutorId, tutorName }: BookLessonModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<"calendar" | "contact" | "details" | "success">("calendar");

  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false);
  const [scheduleData, setScheduleData] = useState<{ availability: any[]; busy: any[] }>({ availability: [], busy: [] });
  const [selectedTime, setSelectedTime] = useState<{ start: Date; end: Date } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [areaCode, setAreaCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [school, setSchool] = useState("");
  const [yearGroup, setYearGroup] = useState("");
  const [message, setMessage] = useState("");

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const currentDayIndex = useMemo(() => new Date().getDay(), []);

  const nowBusyEvent = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);

    return {
      id: "busy-now-mask",
      start: startOfToday.toISOString(),
      end: now.toISOString(),
      display: "background",
      classNames: ["busy-event-bg"],
    };
  }, [isOpen, scheduleData]);

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
        setFirstName("");
        setLastName("");
        setEmail("");
        setAreaCode("");
        setPhoneNumber("");
        setSchool("");
        setYearGroup("");
        setMessage("");
      }, 300);
    }
  };

  const handleNextStep = () => {
    if (!firstName || !lastName || !email || !areaCode || !phoneNumber) {
      toast.error("Please fill in all required fields.");
      return;
    }
    
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setStage("details");
  };

  async function onSubmitFinal(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selectedTime) return;

    setIsSubmitting(true);

    let fullPhone = null;
    if (areaCode || phoneNumber) {
      fullPhone = `+${areaCode} ${phoneNumber}`.trim();
    }

    const fullName = `${firstName} ${lastName}`.trim();

    const result = await requestLessonAction({
      tutorId,
      name: fullName,
      email: email,
      phone: fullPhone,
      school: school || null,
      year: yearGroup || null,
      message: message,
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

  const allEvents = useMemo(() => [...busyEvents, nowBusyEvent], [busyEvents, nowBusyEvent]);

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto bg-violet-600 hover:bg-violet-700 text-white shadow-md transition-all active:scale-95">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Book a Lesson
        </Button>
      </DialogTrigger>
      <DialogContent className={[
        "w-[95vw] max-w-md sm:w-full p-4 sm:p-6 rounded-xl max-h-[90vh] overflow-y-auto custom-scrollbar",
        stage === "calendar" ? "sm:max-w-4xl" : "sm:max-w-2xl"
      ].join(" ")}>
        
        {stage === "calendar" && (
          <>
            <DialogHeader>
              <DialogTitle>Select a Time</DialogTitle>
              <DialogDescription className="text-sm">
                Click and drag on the available areas to select your preferred lesson time.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-2 relative">
              {isLoadingSchedule ? (
                <div className="h-[60vh] min-h-87.5 sm:h-125 w-full bg-muted/30 rounded-xl flex items-center justify-center border border-dashed">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : (
                <>
                  <div className="h-[60vh] min-h-87.5 sm:h-125 booking-modal-calendar schedule-calendar-wrapper border rounded-lg overflow-hidden p-1 sm:p-2 relative">
                    <FullCalendar
                      plugins={[timeGridPlugin, interactionPlugin]}
                      initialView="timeGridWeek"
                      headerToolbar={{
                        left: 'prev,next',
                        center: 'title',
                        right: 'today'
                      }}
                      firstDay={currentDayIndex}
                      validRange={{ start: todayStr }}
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
                      nowIndicator={true}
                      scrollTimeReset={false} 
                      select={(info) => {
                        let finalEnd = info.end;
                        let isInvalid = false;

                        if (info.start < new Date()) {
                          info.view.calendar.unselect();
                          toast.error("You cannot book a lesson in the past.");
                          return;
                        }

                        const sortedEvents = [...allEvents].sort(
                          (a, b) => new Date(a.start as string).getTime() - new Date(b.start as string).getTime()
                        );

                        for (const event of sortedEvents) {
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

                        if (isInvalid || finalEnd.getTime() <= info.start.getTime()) {
                          info.view.calendar.unselect();
                          setSelectedTime(null);
                          if (isInvalid) toast.error("That time is unavailable.");
                          return;
                        }

                        if (finalEnd.getTime() !== info.end.getTime()) {
                          info.view.calendar.select(info.start, finalEnd);
                        }

                        setSelectedTime({ start: info.start, end: finalEnd });
                      }}
                    />
                  </div>
                  {/* FIXED: Adjusted gap and text sizes for mobile legend */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 px-1 text-[10px] sm:text-xs">
                    <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                      <div className="h-3 w-3 rounded-[2px] border border-border bg-background shadow-sm" />
                      <span>Available</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                      <div className="h-3 w-3 rounded-[2px] border border-border bg-muted/70" />
                      <span>Unavailable</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
                      <div 
                        className="h-3 w-3 rounded-[2px] border border-border opacity-80" 
                        style={{ 
                          backgroundColor: "hsl(var(--muted))", 
                          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 2px, hsl(var(--border)) 2px, hsl(var(--border)) 4px)" 
                        }} 
                      />
                      <span>Booked / Past</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 pt-4 border-t gap-4">
              <div className="text-xs sm:text-sm font-medium text-muted-foreground text-center sm:text-left">
                {selectedTime ? (
                  <span className="text-foreground flex items-center justify-center sm:justify-start gap-2 bg-violet-50 dark:bg-violet-900/20 px-3 py-1.5 rounded-md border border-violet-100 dark:border-violet-800 animate-in fade-in zoom-in-95 duration-200">
                    <CalendarClock className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                    <span className="truncate">
                      {selectedTime.start.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })} 
                      {" - "} 
                      {selectedTime.end.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                    </span>
                  </span>
                ) : (
                  "Please select a time slot on the calendar."
                )}
              </div>
              <Button 
                onClick={() => setStage("contact")} 
                disabled={!selectedTime}
                className="bg-violet-600 hover:bg-violet-700 text-white w-full sm:w-auto"
              >
                Continue
              </Button>
            </div>
          </>
        )}

        {(stage === "contact" || stage === "details") && selectedTime && (
          <form onSubmit={onSubmitFinal} className="space-y-4 sm:space-y-6">
            
            <div className={stage === "contact" ? "block" : "hidden"}>
              <DialogHeader className="mb-4">
                <DialogTitle>Basic Information</DialogTitle>
                <DialogDescription>
                  Step 1 of 2: Please provide your contact and school details.
                </DialogDescription>
              </DialogHeader>

              {/* FIXED: Adjusted max height for mobile keyboards */}
              <div className="space-y-5 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="firstname">Student First Name <span className="text-red-500">*</span></Label>
                    <Input id="firstname" required placeholder="John" value={firstName} onChange={e => setFirstName(e.target.value)} className="text-base sm:text-sm" />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="lastname">Student Last Name <span className="text-red-500">*</span></Label>
                    <Input id="lastname" required placeholder="Doe" value={lastName} onChange={e => setLastName(e.target.value)} className="text-base sm:text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                    <Input id="email" type="email" required placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} className="text-base sm:text-sm" />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label>WhatsApp Phone Number <span className="text-red-500">*</span></Label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex items-center w-20 sm:w-24 shrink-0">
                        <span className="absolute left-3 text-muted-foreground text-sm font-medium">+</span>
                        <Input 
                          className="pl-7 text-base sm:text-sm" 
                          placeholder="852" 
                          maxLength={4}
                          required
                          value={areaCode}
                          onChange={(e) => setAreaCode(e.target.value.replace(/\D/g, ''))}
                        />
                      </div>
                      <Input 
                        className="flex-1 text-base sm:text-sm" 
                        placeholder="12345678" 
                        maxLength={15}
                        required
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="school">Current School</Label>
                    <Input id="school" placeholder="e.g. King George V School" value={school} onChange={e => setSchool(e.target.value)} className="text-base sm:text-sm" />
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="year">Year Group</Label>
                    <Input id="year" placeholder="e.g. Year 12" value={yearGroup} onChange={e => setYearGroup(e.target.value)} className="text-base sm:text-sm" />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 sm:gap-3 pt-4 border-t mt-4 sm:mt-6">
                <Button type="button" variant="outline" onClick={() => setStage("calendar")} className="flex-1">
                  <ArrowLeft className="mr-1.5 sm:mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="button" onClick={handleNextStep} className="flex-1 bg-violet-600 hover:bg-violet-700 text-white">
                  Next
                  <ArrowRight className="ml-1.5 sm:ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className={stage === "details" ? "block" : "hidden"}>
              <DialogHeader className="mb-4">
                <DialogTitle>Lesson Details</DialogTitle>
                <DialogDescription>
                  Step 2 of 2: Let {tutorName} know what you need help with.
                </DialogDescription>
              </DialogHeader>

              {/* FIXED: Adjusted max height for mobile keyboards */}
              <div className="space-y-5 max-h-[50vh] sm:max-h-[60vh] overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
                <div className="bg-violet-50 dark:bg-violet-900/20 p-3 sm:p-4 rounded-lg border border-violet-100 dark:border-violet-800/50">
                  <div className="text-xs sm:text-sm font-medium text-foreground mb-1">Time Requested:</div>
                  <div className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
                    <CalendarClock className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
                    <span className="truncate">
                      {selectedTime.start.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })} 
                      {" - "} 
                      {selectedTime.end.toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="message">What do you need help with? <span className="text-red-500">*</span></Label>
                  <Textarea 
                    id="message" 
                    required={stage === "details"} 
                    className="min-h-30 sm:min-h-37.5 resize-y text-base sm:text-sm"
                    placeholder="E.g., I am looking for help preparing for my upcoming exams..." 
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex gap-2 sm:gap-3 pt-4 border-t mt-4 sm:mt-6">
                <Button type="button" variant="outline" onClick={() => setStage("contact")} className="flex-1">
                  <ArrowLeft className="mr-1.5 sm:mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button type="submit" className="flex-1 bg-violet-600 hover:bg-violet-700 text-white" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-1.5 sm:mr-2 h-4 w-4 animate-spin" /> : null}
                  {isSubmitting ? "Sending..." : "Submit"}
                </Button>
              </div>
            </div>

          </form>
        )}

        {stage === "success" && (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2 animate-bounce">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <DialogTitle className="text-xl">Booking Requested!</DialogTitle>
            <DialogDescription className="text-sm sm:text-base px-2 sm:px-4">
              Your request for <strong>{selectedTime?.start.toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric' })}</strong> has been sent to <strong>{tutorName}</strong>.
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

"use client";

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { addAvailabilitySlot, deleteAvailabilitySlot } from "@/lib/actions/schedule";
import { useRouter } from 'next/navigation';
import { Clock, Users, Calendar as CalendarIcon } from 'lucide-react';
import '@/components/dashboard/schedule/schedule-calendar.css';

interface ScheduleCalendarProps {
  initialData: {
    id: string;
    day_of_week: number;
    start_time: string;
    end_time: string;
  }[];
  engagements: {
    id: string;
    status: string;
    scheduled_start: string;
    scheduled_end: string;
    guest_name: string | null;
    students: { firstname: string; lastname: string } | null;
  }[];
  googleEvents?: {
    id: string;
    title: string;
    start: string;
    end: string;
  }[];
}

const extractLocalTime = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

function renderEventContent(eventInfo: any) {
  const { event } = eventInfo;
  const type = event.extendedProps.type;

  return (
    <div className="w-full h-full p-1.5 flex flex-col overflow-hidden rounded-md transition-all hover:brightness-95">
      <div className="flex items-center gap-1.5 mb-0.5">
        {type === 'availability' && <Clock className="w-3 h-3 opacity-70 shrink-0" />}
        {type === 'engagement' && <Users className="w-3 h-3 opacity-70 shrink-0" />}
        {type === 'google_event' && <CalendarIcon className="w-3 h-3 opacity-70 shrink-0" />}
        <span className="text-xs font-semibold leading-tight truncate">
          {event.title}
        </span>
      </div>
      <div className="text-[10px] font-medium opacity-80 leading-none truncate">
        {eventInfo.timeText}
      </div>
    </div>
  );
}

export function ScheduleCalendar({ initialData, engagements, googleEvents = [] }: ScheduleCalendarProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const availabilityEvents = initialData.map((slot) => ({
    id: slot.id,
    daysOfWeek: [slot.day_of_week],
    startTime: slot.start_time,
    endTime: slot.end_time,
    title: "Available",
    backgroundColor: "var(--event-avail-bg)", 
    borderColor: "var(--event-avail-border)",
    textColor: "var(--event-avail-text)",
    extendedProps: { type: 'availability' }
  }));

  const engagementEvents = engagements.map((eng) => {
    const isGuest = !eng.students;
    const name = isGuest ? eng.guest_name : `${eng.students?.firstname} ${eng.students?.lastname}`;
    const isPending = eng.status === 'pending';
    
    return {
      id: `eng-${eng.id}`, 
      start: eng.scheduled_start,
      end: eng.scheduled_end,
      title: `${isPending ? 'Pending: ' : ''}${name}`,
      backgroundColor: isPending ? "var(--event-pending-bg)" : "var(--event-active-bg)", 
      borderColor: isPending ? "var(--event-pending-border)" : "var(--event-active-border)",
      textColor: isPending ? "var(--event-pending-text)" : "var(--event-active-text)",
      extendedProps: { type: 'engagement', rawId: eng.id }
    };
  });

  const externalEvents = googleEvents.map((event) => ({
    id: `gcal-${event.id}`,
    start: event.start,
    end: event.end,
    title: event.title,
    backgroundColor: "var(--event-google-bg)",
    borderColor: "var(--event-google-border)",
    textColor: "var(--event-google-text)",
    extendedProps: { type: 'google_event' }
  }));

  const allEvents = [...availabilityEvents, ...engagementEvents, ...externalEvents];

  const handleDateSelect = async (selectInfo: any) => {
    if (isProcessing) return;
    selectInfo.view.calendar.unselect(); 

    const dayOfWeek = selectInfo.start.getDay();
    const startTime = extractLocalTime(selectInfo.start);
    const endTime = extractLocalTime(selectInfo.end);

    setIsProcessing(true);
    const toastId = toast.loading("Adding availability...");

    try {
      await addAvailabilitySlot(dayOfWeek, startTime, endTime);
      toast.success("Time slot added!", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Failed to add time slot", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEventClick = async (clickInfo: any) => {
    if (isProcessing) return;

    const eventType = clickInfo.event.extendedProps.type;

    if (eventType === 'google_event') {
      toast.info("This is an external event from Google Calendar.");
      return;
    }

    if (eventType === 'engagement') {
      toast.info(`Go to your Lesson Requests inbox to manage this lesson.`);
      router.push("/dashboard/engagements");
      return;
    }

    const eventId = clickInfo.event.id;
    if (confirm("Remove this recurring availability slot?")) {
      setIsProcessing(true);
      const toastId = toast.loading("Removing slot...");

      try {
        await deleteAvailabilitySlot(eventId);
        toast.success("Slot removed!", { id: toastId });
      } catch (error: any) {
        toast.error(error.message || "Failed to remove time slot", { id: toastId });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <Card className="border-border overflow-hidden shadow-sm relative">
      {isProcessing && (
        <div className="absolute inset-0 bg-background/50 z-50 flex items-center justify-center backdrop-blur-[1px]">
          <div className="bg-background border shadow-lg px-4 py-2 rounded-full text-sm font-medium text-muted-foreground animate-pulse">
            Syncing...
          </div>
        </div>
      )}

      <CardContent className="p-0">
        <div className="p-4 bg-background text-sm schedule-calendar-wrapper">
          <FullCalendar
            plugins={[timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridWeek,timeGridDay'
            }}
            events={allEvents}
            eventContent={renderEventContent}
            selectable={true}
            selectMirror={true}
            height="750px"
            allDaySlot={false}
            slotMinTime="06:00:00"
            slotMaxTime="23:00:00"
            select={handleDateSelect}
            eventClick={handleEventClick}
            editable={false} 
            nowIndicator={true}
          />
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { addAvailabilitySlot, deleteAvailabilitySlot } from "@/lib/actions/schedule";
import { useRouter } from 'next/navigation';

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
}

const extractLocalTime = (date: Date) => {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export function ScheduleCalendar({ initialData, engagements }: ScheduleCalendarProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const availabilityEvents = initialData.map((slot) => ({
    id: slot.id,
    daysOfWeek: [slot.day_of_week],
    startTime: slot.start_time,
    endTime: slot.end_time,
    title: "Available",
    backgroundColor: "#8b5cf6",
    borderColor: "#7c3aed",
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
      title: `${isPending ? '[Pending] ' : ''}Lesson: ${name}`,
      backgroundColor: isPending ? "#f59e0b" : "#10b981",
      borderColor: isPending ? "#d97706" : "#059669",
      extendedProps: { type: 'engagement', rawId: eng.id }
    };
  });

  const allEvents = [...availabilityEvents, ...engagementEvents];

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

    if (eventType === 'engagement') {
      toast.info(`Go to your Lesson Requests inbox to manage this lesson.`);
      router.push("/dashboard/engagements");
      return;
    }

    const eventId = clickInfo.event.id;
    if (confirm("Are you sure you want to delete this recurring availability slot?")) {
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
    <Card className="border-violet-100 dark:border-violet-900/30 overflow-hidden shadow-md relative">
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
            selectable={true}
            selectMirror={true}
            height="750px"
            allDaySlot={false}
            slotMinTime="06:00:00"
            slotMaxTime="23:00:00"
            select={handleDateSelect}
            eventClick={handleEventClick}
            editable={false} 
          />
        </div>
      </CardContent>
    </Card>
  );
}

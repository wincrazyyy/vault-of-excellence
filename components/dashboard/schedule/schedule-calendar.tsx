"use client";

import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addAvailabilitySlot, deleteAvailabilitySlot, clearAllAvailability } from "@/lib/actions/schedule";
import { useRouter } from 'next/navigation';
import { Clock, Users, Calendar as CalendarIcon, Trash2, AlertTriangle, Undo2, Redo2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

type Action = {
  type: 'add' | 'delete';
  id?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
};

function renderEventContent(eventInfo: any) {
  const { event } = eventInfo;
  const type = event.extendedProps.type;

  return (
    <div className="w-full h-full p-1 sm:p-1.5 flex flex-col overflow-hidden rounded-md transition-all hover:brightness-95">
      <div className="flex items-center gap-1.5 mb-0.5">
        {type === 'availability' && <Clock className="w-3 h-3 opacity-70 shrink-0 hidden sm:block" />}
        {type === 'engagement' && <Users className="w-3 h-3 opacity-70 shrink-0 hidden sm:block" />}
        {type === 'google_event' && <CalendarIcon className="w-3 h-3 opacity-70 shrink-0 hidden sm:block" />}
        <span className="text-[10px] sm:text-xs font-semibold leading-tight truncate">
          {event.title}
        </span>
      </div>
      <div className="text-[9px] sm:text-[10px] font-medium opacity-80 leading-none truncate">
        {eventInfo.timeText}
      </div>
    </div>
  );
}

export function ScheduleCalendar({ initialData, engagements, googleEvents = [] }: ScheduleCalendarProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<Action[]>([]);
  const [redoStack, setRedoStack] = useState<Action[]>([]);
  const router = useRouter();

  const extractLocalTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const performAction = async (action: Action, isUndoRedo = false) => {
    setIsProcessing(true);
    let success = false;
    
    try {
      if (action.type === 'add') {
        await addAvailabilitySlot(action.dayOfWeek, action.startTime, action.endTime);
        success = true;
      } else {
        const currentTargetId = initialData.find(s =>
          s.day_of_week === action.dayOfWeek &&
          s.start_time.startsWith(action.startTime) && 
          s.end_time.startsWith(action.endTime)
        )?.id || action.id;

        if (!currentTargetId) throw new Error("Could not find this slot. It may have already been removed.");
        
        await deleteAvailabilitySlot(currentTargetId);
        success = true;
      }
      if (success && !isUndoRedo) {
        setHistory(prev => [...prev, action]);
        setRedoStack([]); 
      }
    } catch (error: any) {
      toast.error(error.message || "Action failed");
    } finally {
      setIsProcessing(false);
    }
    
    return success;
  };

  const handleUndo = async () => {
    if (history.length === 0 || isProcessing) return;
    const lastAction = history[history.length - 1];
    
    const inverse: Action = {
      ...lastAction,
      type: lastAction.type === 'add' ? 'delete' : 'add'
    };

    const success = await performAction(inverse, true);
    if (success) {
      setHistory(prev => prev.slice(0, -1));
      setRedoStack(prev => [...prev, lastAction]);
      toast.info("Action undone");
    }
  };

  const handleRedo = async () => {
    if (redoStack.length === 0 || isProcessing) return;
    const nextAction = redoStack[redoStack.length - 1];
    
    const success = await performAction(nextAction, true);
    if (success) {
      setRedoStack(prev => prev.slice(0, -1));
      setHistory(prev => [...prev, nextAction]);
      toast.info("Action redone");
    }
  };

  const handleDateSelect = async (selectInfo: any) => {
    if (isProcessing) return;
    selectInfo.view.calendar.unselect(); 

    const action: Action = {
      type: 'add',
      dayOfWeek: selectInfo.start.getDay(),
      startTime: extractLocalTime(selectInfo.start),
      endTime: extractLocalTime(selectInfo.end),
    };

    const toastId = toast.loading("Adding slot...");
    const success = await performAction(action);
    if (success) toast.success("Time slot added!", { id: toastId });
  };

  const handleEventClick = async (clickInfo: any) => {
    if (isProcessing) return;
    const eventType = clickInfo.event.extendedProps.type;

    if (eventType === 'google_event' || eventType === 'engagement') {
      toast.info(eventType === 'google_event' ? "Google event" : "Lesson request");
      return;
    }

    const action: Action = {
      type: 'delete',
      id: clickInfo.event.id,
      dayOfWeek: clickInfo.event.extendedProps.dayOfWeek,
      startTime: clickInfo.event.extendedProps.startTime,
      endTime: clickInfo.event.extendedProps.endTime,
    };

    const toastId = toast.loading("Removing slot...");
    const success = await performAction(action);
    if (success) toast.success("Slot removed!", { id: toastId });
  };

  const onConfirmClearAll = async () => {
    setIsProcessing(true);
    const toastId = toast.loading("Clearing all...");
    try {
      await clearAllAvailability();
      setHistory([]); 
      setRedoStack([]);
      toast.success("Schedule wiped", { id: toastId });
    } catch (error: any) {
      toast.error(error.message || "Failed to clear", { id: toastId });
    } finally {
      setIsProcessing(false);
    }
  };

  const availabilityEvents = initialData.map((slot) => ({
    id: slot.id,
    daysOfWeek: [slot.day_of_week],
    startTime: slot.start_time,
    endTime: slot.end_time,
    title: "Available",
    backgroundColor: "var(--event-avail-bg)", 
    borderColor: "var(--event-avail-border)",
    textColor: "var(--event-avail-text)",
    extendedProps: { 
      type: 'availability',
      dayOfWeek: slot.day_of_week,
      startTime: slot.start_time,
      endTime: slot.end_time
    }
  }));

  const engagementEvents = engagements.map((eng) => ({
    id: `eng-${eng.id}`, 
    start: eng.scheduled_start,
    end: eng.scheduled_end,
    title: `${eng.status === 'pending' ? 'Pending: ' : ''}${eng.guest_name || 'Lesson'}`,
    backgroundColor: eng.status === 'pending' ? "var(--event-pending-bg)" : "var(--event-active-bg)", 
    borderColor: eng.status === 'pending' ? "var(--event-pending-border)" : "var(--event-active-border)",
    textColor: eng.status === 'pending' ? "var(--event-pending-text)" : "var(--event-active-text)",
    extendedProps: { type: 'engagement', rawId: eng.id }
  }));

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

  return (
    <div className="flex flex-col gap-4">
      <Card className="border-border overflow-hidden shadow-sm relative">
        {isProcessing && (
          <div className="absolute inset-0 bg-background/50 z-50 flex items-center justify-center backdrop-blur-[1px]">
            <div className="bg-background border shadow-lg px-4 py-2 rounded-full text-sm font-medium text-muted-foreground animate-pulse">
              Syncing...
            </div>
          </div>
        )}
        <CardContent className="p-0">
          <div className="p-2 sm:p-4 bg-background text-sm schedule-calendar-wrapper">
            <FullCalendar
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{ 
                left: 'prev,next', 
                center: 'title', 
                right: 'timeGridWeek,timeGridDay' 
              }}
              events={allEvents}
              eventContent={renderEventContent}
              selectable={true}
              selectMirror={true}
              contentHeight="auto"
              allDaySlot={false}
              slotMinTime="06:00:00"
              slotMaxTime="23:00:00"
              select={handleDateSelect}
              eventClick={handleEventClick}
              editable={false} 
              nowIndicator={true}
              stickyHeaderDates={true}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 px-1">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleUndo} 
            disabled={history.length === 0 || isProcessing}
            className="flex-1 sm:flex-none h-10 sm:h-8 px-3"
          >
            <Undo2 className="h-4 w-4 mr-1.5" />
            Undo
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRedo} 
            disabled={redoStack.length === 0 || isProcessing}
            className="flex-1 sm:flex-none h-10 sm:h-8 px-3"
          >
            <Redo2 className="h-4 w-4 mr-1.5" />
            Redo
          </Button>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full sm:w-auto text-muted-foreground hover:text-destructive hover:bg-destructive/5 transition-colors border-dashed h-10 sm:h-8"
              disabled={isProcessing || initialData.length === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Availability
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="w-[95vw] sm:w-full rounded-xl">
            <AlertDialogHeader>
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertTriangle className="h-5 w-5" />
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              </div>
              <AlertDialogDescription>
                This will delete every recurring availability slot. This action will reset your history stack.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col sm:flex-row gap-2 mt-4">
              <AlertDialogCancel className="w-full sm:w-auto mt-0">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onConfirmClearAll} className="w-full sm:w-auto bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                Clear Everything
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

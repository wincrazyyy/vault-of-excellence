import { TutorProfile } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { BookLessonModal } from "@/components/tutors/booking/book-lesson-modal"; 

export function BookingCard({ tutor }: { tutor: TutorProfile }) {
  const { hourly_rate, firstname } = tutor.header;

  return (
    <Card className="border-violet-200 dark:border-violet-800/50 shadow-sm overflow-hidden">
      <div className="h-1 w-full bg-linear-to-r from-violet-500 to-fuchsia-500" />
      <CardContent className="p-4 lg:p-6 flex flex-row lg:flex-col items-center lg:items-start justify-between gap-4 lg:gap-0">
        <div>
          <div className="text-[9px] lg:text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
            Hourly Rate
          </div>

          <div className="mt-0 lg:mt-1 flex items-baseline gap-1 text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
            <span className="text-base lg:text-lg font-medium text-muted-foreground">HKD $</span>
            {hourly_rate}
            <span className="text-xs lg:text-sm font-medium text-muted-foreground ml-1">/ hr</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-auto lg:w-full lg:mt-6 shrink-0">
          <BookLessonModal tutorId={tutor.id} tutorName={firstname} />

          <p className="hidden lg:block text-[11px] text-center text-muted-foreground">
            No payment required until the tutor accepts.
          </p>
        </div>
        
      </CardContent>
    </Card>
  );
}
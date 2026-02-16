import { TutorProfile } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function BookingCard({ tutor }: { tutor: TutorProfile }) {
  const { hourly_rate } = tutor.header;

  return (
    <Card className="border-violet-200 dark:border-violet-800/50 shadow-sm overflow-hidden">
      <div className="h-1 w-full bg-linear-to-r from-violet-500 to-fuchsia-500" />

      <CardContent className="p-6">
        <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/80">
          Hourly Rate
        </div>

        <div className="mt-1 flex items-baseline gap-1 text-3xl font-bold tracking-tight text-foreground">
          <span className="text-lg font-medium text-muted-foreground">HKD $</span>
          {hourly_rate}
          <span className="text-sm font-medium text-muted-foreground ml-1">/ hr</span>
        </div>

        <div className="mt-6 grid gap-3">
          <Button 
            className="h-12 bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-500/10 transition-all active:scale-95" 
            size="lg"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Request a lesson
          </Button>

          <p className="text-[11px] text-center text-muted-foreground">
            No payment required until the tutor accepts.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

import type { Tutor } from "@/lib/tutors/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function BookingCard({ tutor }: { tutor: Tutor }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-xs text-muted-foreground">From</div>

        <div className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          HKD ${tutor.profile.price}{" "}
          <span className="text-sm font-medium text-muted-foreground">/ hour</span>
        </div>

        <div className="mt-5 grid gap-3">
          <Button className="h-11" size="lg">
            Request a lesson
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

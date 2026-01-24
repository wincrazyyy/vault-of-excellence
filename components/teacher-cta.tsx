// components/teacher-cta.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function TeacherCTA() {
  return (
    <Card className="mt-10">
      <CardContent className="p-6">
        <div className="text-xs font-medium text-foreground">For teachers</div>

        <div className="mt-1 text-lg font-semibold text-foreground">
          Teach on a premium marketplace
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          Create a profile, list subjects, and connect with students who value
          high-quality tutoring.
        </p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button asChild>
            <Link href="/signup">Teacher sign up</Link>
          </Button>

          <Button variant="outline" asChild>
            <Link href="/login">Teacher log in</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

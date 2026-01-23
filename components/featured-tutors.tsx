// components/featured-tutors.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function FeaturedTutors() {
  return (
    <div className="mt-4">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold text-foreground">Featured tutors</h1>

        <Button variant="link" className="h-auto p-0" asChild>
          <Link href="/tutors">View all</Link>
        </Button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="rounded-3xl shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-violet-200/80 dark:bg-violet-500/20 ring-1 ring-border" />
                <div>
                  <div className="text-sm font-semibold text-foreground">
                    Tutor Name {i}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Subject • Level
                  </div>
                </div>
              </div>

              <p className="mt-3 text-sm text-muted-foreground">
                Short bio goes here. Calm, structured teaching with clear feedback.
              </p>

              <div className="mt-4 flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="rounded-full border-violet-200/70 bg-violet-50/80 px-2.5 py-1 text-xs font-medium dark:border-violet-500/30 dark:bg-violet-500/10"
                >
                  Online
                </Badge>

                <Badge
                  variant="secondary"
                  className="rounded-full px-2.5 py-1 text-xs font-medium text-foreground/80"
                >
                  4.9 ★
                </Badge>
              </div>

              <Button className="mt-5 h-10 w-full rounded-2xl" asChild>
                <Link href={`/tutors/${i}`}>View profile</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

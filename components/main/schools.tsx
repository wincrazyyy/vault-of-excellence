// components/schools.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function Schools() {
  const schools = [
    "School Name A",
    "School Name B",
    "School Name C",
    "School Name D",
    "School Name E",
    "School Name F",
    "School Name G",
    "School Name H",
    "School Name I",
    "School Name J",
    "School Name K",
  ];

  return (
    <div className="mt-10 border-t border-border pt-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Tutors from top schools
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            A quick look at where our tutors teach or graduated from.
          </p>
        </div>

        <Button variant="link" asChild>
          <Link href="/schools">View all</Link>
        </Button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {schools.map((name) => (
          <Card key={name}>
            <CardContent className="flex h-14 items-center gap-3 px-4 py-0">
              {/* Placeholder rectangular logo image (logo+name would be 1 image later) */}
              <div className="h-8 w-24 bg-violet-200/80 dark:bg-violet-500/20 ring-1 ring-border" />
              <div className="text-sm font-medium text-foreground">{name}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

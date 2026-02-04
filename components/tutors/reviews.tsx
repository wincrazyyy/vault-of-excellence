import type { Tutor, Review } from "@/components/tutors/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Reviews({ tutor, reviews }: { tutor: Tutor; reviews: Review[] }) {
  return (
    <Card>
      <CardHeader className="p-6 sm:p-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">
              {tutor.reviews.title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {tutor.reviews.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
            <Button variant="outline" className="h-10">
              View all
            </Button>

            <Button className="h-10">Leave a review</Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 sm:px-8 sm:pb-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.map((r) => (
            <Card key={`${r.name}-${r.text.slice(0, 16)}`} className="bg-muted/40">
              <CardContent className="p-5">
                <div className="text-sm font-semibold text-foreground">{r.name}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {r.text}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

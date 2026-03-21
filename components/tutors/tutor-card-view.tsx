import Image from "next/image";
import Link from "next/link";
import { TutorCard } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShieldCheck, Trophy } from "lucide-react";

export function TutorCardView({ tutor }: { tutor: TutorCard }) {
  const fullName = `${tutor.firstname} ${tutor.lastname}`;
  const initials = `${tutor.firstname?.[0] || ""}${tutor.lastname?.[0] || ""}`;

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border-violet-200/50 dark:border-violet-800/20 flex flex-col h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start gap-4">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
            {tutor.image_url ? (
              <Image
                src={tutor.image_url}
                alt={fullName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-violet-100 text-violet-600 font-bold uppercase">
                {initials}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <div className="truncate text-base font-semibold">
                {fullName}
              </div>
              {tutor.is_verified && (
                <ShieldCheck className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
              )}
            </div>
            <div className="truncate text-sm text-muted-foreground">
              {tutor.title || "Tutor"}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 items-start content-start">
          <Badge variant="secondary" className="bg-muted text-muted-foreground gap-1">
            <Trophy className="h-3 w-3" />
            Level {tutor.level}
          </Badge>
          {tutor.badge_text && (
            <Badge variant="outline" className="border-dashed">
              {tutor.badge_text}
            </Badge>
          )}
        </div>

        <div className="mt-auto pt-6">
          <div className="flex items-center gap-2 mb-4">
            {tutor.rating_avg > 0 ? (
              <Badge
                variant="outline"
                className="gap-1 border-orange-200 text-orange-600"
              >
                <Star className="h-3 w-3 fill-current" />
                {Number(tutor.rating_avg).toFixed(1)}
              </Badge>
            ) : (
              <Badge variant="outline" className="text-muted-foreground">
                New
              </Badge>
            )}
            <span className="ml-auto text-sm font-medium">
              ${tutor.hourly_rate}/hr
            </span>
          </div>

          <Button
            className="w-full bg-violet-600 text-white hover:bg-violet-700"
            asChild
          >
            <Link href={`/tutors/${tutor.id}`}>View Profile</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

import { getTutorCards } from "@/lib/tutors/getTutor";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ShieldCheck, Trophy } from "lucide-react";

import { FeaturedTutorsSkeleton } from "@/components/main/featured-tutors-skeleton";

export function FeaturedTutors() {
  return (
    <div className="mt-4">
      <Suspense fallback={<FeaturedTutorsSkeleton />}>
        <TutorList />
      </Suspense>
    </div>
  );
}
async function TutorList() {
  const { exact, related } = await getTutorCards(3);

  const tutors = [...exact, ...related].slice(0, 3);

  if (tutors.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        Check back soon for our featured tutors!
      </div>
    );
  }

  return (
    <>
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Featured Tutors
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Expert mentors ready to help you excel.
          </p>
        </div>

        <Button variant="link" asChild className="hidden sm:flex">
          <Link href="/tutors">View all</Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {tutors.map((tutor) => {
          const displayName = `${tutor.firstname} ${tutor.lastname}`;
          const initials = `${tutor.firstname[0]}${tutor.lastname[0]}`;

          return (
            <Card
              key={tutor.id}
              className="group overflow-hidden transition-all hover:shadow-md border-violet-200/50 dark:border-violet-800/20"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                    {tutor.image_url ? (
                      <Image
                        src={tutor.image_url}
                        alt={displayName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300">
                        <span className="font-semibold text-sm">
                          {initials}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold text-foreground flex items-center gap-1">
                      {displayName}
                      {tutor.is_verified && (
                        <ShieldCheck className="h-4 w-4 text-violet-500" />
                      )}
                    </div>
                    <div className="truncate text-sm text-muted-foreground">
                      {tutor.title || "Tutor"}
                    </div>
                  </div>
                </div>

                <p className="mt-4 line-clamp-2 text-sm text-muted-foreground h-10">
                  {tutor.badge_text
                    ? `Recognized as a ${tutor.badge_text} within our community.`
                    : "Passionate about teaching and helping students achieve their goals."}
                </p>

                <div className="mt-4 flex items-center gap-2 flex-wrap">
                  <Badge
                    variant="secondary"
                    className="bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 gap-1"
                  >
                    <Trophy className="h-3 w-3" />
                    Lvl {tutor.level}
                  </Badge>

                  {tutor.rating_avg > 0 && (
                    <Badge
                      variant="outline"
                      className="gap-1 border-orange-200 text-orange-600 dark:border-orange-900/50 dark:text-orange-400"
                    >
                      <Star className="h-3 w-3 fill-current" />
                      {Number(tutor.rating_avg).toFixed(1)}
                      <span className="text-xs opacity-70">
                        ({tutor.rating_count})
                      </span>
                    </Badge>
                  )}

                  {tutor.hourly_rate > 0 && (
                    <span className="ml-auto text-sm font-medium">
                      ${tutor.hourly_rate}/hr
                    </span>
                  )}
                </div>

                <Button
                  className="mt-5 w-full bg-violet-600 hover:bg-violet-700 text-white"
                  asChild
                >
                  <Link href={`/tutors/${tutor.id}`}>View Profile</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-6 flex justify-center sm:hidden">
        <Button variant="outline" asChild>
          <Link href="/tutors">View all tutors</Link>
        </Button>
      </div>
    </>
  );
}

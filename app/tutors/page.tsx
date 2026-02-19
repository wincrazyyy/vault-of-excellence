import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { getTutorCards } from "@/lib/tutors/getTutor";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Search, ShieldCheck, Trophy } from "lucide-react";

type Props = {
  searchParams: Promise<{ query?: string }>;
};

export default function TutorsPage({ searchParams }: Props) {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto w-full max-w-5xl px-6 pt-10">
        <Suspense
          fallback={
            <div className="space-y-6">
              <div className="h-10 w-64 bg-muted animate-pulse rounded" />
              <div className="p-10 text-center text-muted-foreground">
                Loading results...
              </div>
            </div>
          }
        >
          <ResultsContent searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

async function ResultsContent({
  searchParams,
}: {
  searchParams: Promise<{ query?: string }>;
}) {
  const { query } = await searchParams;
  const searchTerm = query || "";

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-6">
        {searchTerm ? `Results for "${searchTerm}"` : "All Tutors"}
      </h1>
      <TutorResults query={searchTerm} />
    </>
  );
}

async function TutorResults({ query }: { query: string }) {
  const tutors = await getTutorCards(50, query);

  if (!tutors || tutors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Search className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium">No tutors found</h3>
        <p className="text-muted-foreground max-w-sm mt-2">
          We couldn't find any tutors matching "{query}". Try searching for a
          different subject or keyword.
        </p>
        <Button variant="outline" className="mt-6" asChild>
          <Link href="/tutors">Clear Search</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {tutors.map((tutor) => {
        const fullName = `${tutor.firstname} ${tutor.lastname}`;
        const initials = `${tutor.firstname?.[0] || ""}${tutor.lastname?.[0] || ""}`;

        return (
          <Card
            key={tutor.id}
            className="overflow-hidden transition-all hover:shadow-md border-violet-200/50 dark:border-violet-800/20"
          >
            <CardContent className="p-6">
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

              <div className="mt-4 flex flex-wrap gap-2 h-10 items-start content-start">
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

              <div className="mt-4 flex items-center gap-2">
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
                className="mt-5 w-full bg-violet-600 text-white hover:bg-violet-700"
                asChild
              >
                <Link href={`/tutors/${tutor.id}`}>View Profile</Link>
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

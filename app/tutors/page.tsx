import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Search } from "lucide-react";

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
  const supabase = await createClient();

  let dbQuery = supabase.from("tutors").select("*");

  if (query) {
    dbQuery = dbQuery.or(
      `name.ilike.%${query}%,title.ilike.%${query}%,subtitle.ilike.%${query}%`
    );
  }

  const { data: tutors } = await dbQuery.order("rating", { ascending: false });

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
      {tutors.map((tutor) => (
        <Card
          key={tutor.id}
          className="overflow-hidden transition-all hover:shadow-md border-violet-200/50 dark:border-violet-800/20"
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
                {tutor.image_src ? (
                  <Image
                    src={tutor.image_src}
                    alt={tutor.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-violet-100 text-violet-600 font-bold">
                    {tutor.name[0]}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="truncate text-base font-semibold">
                  {tutor.name}
                </div>
                <div className="truncate text-sm text-muted-foreground">
                  {tutor.title || "Tutor"}
                </div>
              </div>
            </div>

            <p className="mt-4 line-clamp-2 text-sm text-muted-foreground h-10">
              {tutor.subtitle}
            </p>

            <div className="mt-4 flex items-center gap-2">
              {tutor.rating > 0 && (
                <Badge
                  variant="outline"
                  className="gap-1 border-orange-200 text-orange-600"
                >
                  <Star className="h-3 w-3 fill-current" />
                  {Number(tutor.rating).toFixed(1)}
                </Badge>
              )}
              <span className="ml-auto text-sm font-medium">
                ${tutor.price}/hr
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
      ))}
    </div>
  );
}

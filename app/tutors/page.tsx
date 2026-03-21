import { Suspense } from "react";
import Link from "next/link";
import { getTutorCards } from "@/lib/tutors/getTutor";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { TutorCardView } from "@/components/tutors/tutor-card-view";

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
  const { exact, related } = await getTutorCards(50, query);

  if (exact.length === 0 && related.length === 0) {
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
    <div className="space-y-12">
      {exact.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {exact.map((tutor) => (
            <TutorCardView key={tutor.id} tutor={tutor} />
          ))}
        </div>
      )}

      {related.length > 0 && (
        <div>
          {query && (
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px bg-border flex-1" />
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                {exact.length === 0 ? "Similar Tutors" : "Other Related Tutors"}
              </h3>
              <div className="h-px bg-border flex-1" />
            </div>
          )}
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((tutor) => (
              <TutorCardView key={tutor.id} tutor={tutor} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { Suspense } from "react";
import { Metadata } from "next";
import { getTutorCards } from "@/lib/tutors/getTutor";
import { TutorCardView } from "@/components/tutors/tutor-card-view";

type Props = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const formattedTitle = category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return {
    title: `Best ${formattedTitle} Tutors Online | Vault of Excellence`,
    description: `Find top-rated ${formattedTitle} tutors for private online lessons.`,
  };
}

export default function CategoryPage({ params }: Props) {
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto w-full max-w-5xl px-6 pt-10">
        <Suspense 
          fallback={
            <div className="animate-pulse space-y-4">
              <div className="h-10 w-64 bg-muted rounded" />
              <div className="h-4 w-96 bg-muted rounded" />
              <div className="mt-8 h-64 bg-muted rounded-xl" />
            </div>
          }
        >
          <CategoryHeaderAndResults params={params} />
        </Suspense>
      </div>
    </div>
  );
}

// 3. Move the async logic into this child component
async function CategoryHeaderAndResults({ params }: Props) {
  const { category } = await params;
  const formattedTitle = category.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight mb-2">
        {formattedTitle} Tutors
      </h1>
      <p className="text-muted-foreground mb-8">
        Browse our verified experts in {formattedTitle} and book a lesson today.
      </p>

      <Suspense fallback={<div className="animate-pulse h-32 bg-muted rounded-xl" />}>
        <CategoryResults category={formattedTitle} />
      </Suspense>
    </>
  );
}

async function CategoryResults({ category }: { category: string }) {
  const { exact, related } = await getTutorCards(50, category);

  if (exact.length === 0 && related.length === 0) {
    return <p className="text-muted-foreground py-10">No tutors found for this category yet.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {exact.map((tutor) => (
        <TutorCardView key={tutor.id} tutor={tutor} />
      ))}
      {related.map((tutor) => (
        <TutorCardView key={tutor.id} tutor={tutor} />
      ))}
    </div>
  );
}

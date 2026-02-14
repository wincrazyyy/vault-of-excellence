import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import { ProfileHeader } from "@/components/tutors/profile-header";
import { Reviews } from "@/components/tutors/reviews";
import { SectionView } from "@/components/tutors/sections/section";

import { Tutor } from "@/lib/tutors/types";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TutorProfilePage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading Tutor Profile...</div>}>
      <TutorDataLoader params={params} />
    </Suspense>
  );
}

async function TutorDataLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const supabase = await createClient();

  const { data: rawData, error } = await supabase
    .from("tutors")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !rawData) {
    console.error("Error fetching tutor:", error);
    notFound();
  }

  const tutor: Tutor = {
    profile: {
      name: rawData.name,
      title: rawData.title,
      subtitle: rawData.subtitle,
      imageSrc: rawData.image_src,
      price: rawData.price,
      rating: rawData.rating,
      ratingCount: rawData.rating_count,
      returnRate: rawData.return_rate,
      verified: rawData.verified,
      showRating: rawData.show_rating,
      showReturnRate: rawData.show_return_rate,
      badgeText: rawData.badge_text,
    },
    sections: rawData.sections || [],
    reviews: rawData.reviews || { title: "Reviews", description: "", items: [] },
  };

  return <TutorProfileContent tutor={tutor} />;
}

function TutorProfileContent({ tutor }: { tutor: Tutor }) {
  return (
    <main className="min-h-screen">
      <section className="mx-auto w-full max-w-5xl px-6 py-10">
        <ProfileHeader tutor={tutor} />

        <div className="mt-6">
          <div className="space-y-6">
            {tutor.sections.map((section) => (
              <SectionView key={section.id} section={section} />
            ))}
            {tutor.reviews?.items && (
              <Reviews tutor={tutor} reviews={tutor.reviews.items} />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
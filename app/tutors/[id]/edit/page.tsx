import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { TutorEditor } from "@/components/tutors/edit/tutor-editor";
import type { Tutor } from "@/lib/tutors/types";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditTutorPage({ params }: PageProps) {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading Editor...</div>}>
      <EditorDataLoader params={params} />
    </Suspense>
  );
}

async function EditorDataLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();

  const { data: rawData, error } = await supabase
    .from("tutors")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !rawData) {
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

  return <TutorEditor tutorId={id} initialTutor={tutor} />;
}
import { createClient } from "@/lib/supabase/server";
import { TutorProfile, TutorCard } from "@/lib/types";

export async function getTutorProfile(tutorId: string): Promise<TutorProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tutors")
    .select(`
      *,
      tutor_progression ( level, current_xp ),
      reviews ( 
        id, 
        student_name, 
        rating, 
        comment, 
        created_at 
      )
    `)
    .eq("id", tutorId)
    .single();

  if (error || !data) {
    console.error("Error fetching tutor profile:", error);
    return null;
  }

  const profile: TutorProfile = {
    id: data.id,
    is_public: data.is_public,

    header: {
      name: data.name,
      title: data.title,
      subtitle: data.subtitle,
      image_url: data.image_url,
      badge_text: data.badge_text,
      is_verified: data.is_verified,
      hourly_rate: data.hourly_rate,
    },

    stats: {
      rating_avg: data.rating_avg,
      rating_count: data.rating_count,
      return_rate: data.return_rate,
      show_rating: data.show_rating,
      show_return_rate: data.show_return_rate,
    },

    progression: {
      level: data.tutor_progression?.level ?? 1,
      current_xp: data.tutor_progression?.current_xp ?? 0,
    },
    sections: data.sections || [],
    reviews: data.reviews || [],
  };

  return profile;
}

export async function getTutorCards(limit = 50): Promise<TutorCard[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tutors")
    .select(`
      id,
      name,
      title,
      image_url,
      hourly_rate,
      rating_avg,
      rating_count,
      return_rate,
      badge_text,
      is_verified,
      tutor_progression ( level )
    `)
    .eq("is_public", true)
    .limit(limit);

  if (error || !data) {
    console.error("Error fetching tutor cards:", error);
    return [];
  }

  return data.map((tutor: any) => ({
    id: tutor.id,
    name: tutor.name,
    title: tutor.title,
    image_url: tutor.image_url,
    hourly_rate: tutor.hourly_rate,
    
    rating_avg: tutor.rating_avg,
    rating_count: tutor.rating_count,
    return_rate: tutor.return_rate,
    
    badge_text: tutor.badge_text,
    is_verified: tutor.is_verified,

    level: tutor.tutor_progression?.level ?? 1,
  }));
}
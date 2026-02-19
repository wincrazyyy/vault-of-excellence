import { createClient } from "@/lib/supabase/server";
import { TutorProfile, TutorCard } from "@/lib/types";

export async function getTutorProfile(tutorId: string): Promise<TutorProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("tutors")
    .select(`
      *,
      tutor_progression ( level, current_xp ),
      tutor_quests ( quest_id ),
      reviews (
        id,
        rating,
        comment,
        is_visible,
        created_at,
        students (
          firstname,
          lastname
        )
      )
    `)
    .eq("id", tutorId)
    .single();

  if (error || !data) {
    console.error("Error fetching tutor profile:", error);
    return null;
  }

  const currentLevel = data.tutor_progression?.level ?? 1;

  const { data: levelData } = await supabase
    .from("levels")
    .select("xp_required")
    .eq("level", currentLevel + 1)
    .single();

  const nextLevelXP = levelData?.xp_required ?? 99999;

  const profile: TutorProfile = {
    id: data.id,
    is_public: data.is_public,

    header: {
      firstname: data.firstname,
      lastname: data.lastname,
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
      level: currentLevel,
      current_xp: data.tutor_progression?.current_xp ?? 0,
      next_level_xp: nextLevelXP,
    },

    claimed_quests: data.tutor_quests?.map((q: any) => q.quest_id) || [],
    
    sections: data.sections || [],
    
    reviews: data.reviews?.map((r: any) => ({
      id: r.id,
      student_firstname: r.students?.firstname || "Anonymous",
      student_lastname: r.students?.lastname || "Student",
      rating: r.rating,
      comment: r.comment,
      is_visible: r.is_visible,
      created_at: r.created_at
    })) || [],
  };

  return profile;
}

export async function getTutorCards(limit = 50, searchQuery?: string): Promise<TutorCard[]> {
  const supabase = await createClient();

  let queryBuilder = supabase
    .from("tutors")
    .select(`
      id,
      firstname,
      lastname,
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
    .eq("is_public", true);

  if (searchQuery && searchQuery.trim() !== "") {
    const exact = searchQuery.trim();
    const words = exact.split(/\s+/);
    const orConditions: string[] = [];

    orConditions.push(`firstname.ilike.%${exact}%`);
    orConditions.push(`lastname.ilike.%${exact}%`);
    orConditions.push(`title.ilike.%${exact}%`);

    if (words.length > 1) {
      words.forEach(word => {
        orConditions.push(`firstname.ilike.%${word}%`);
        orConditions.push(`lastname.ilike.%${word}%`);
        orConditions.push(`title.ilike.%${word}%`);
      });
    }

    queryBuilder = queryBuilder.or(orConditions.join(','));
  }

  const { data, error } = await queryBuilder.limit(limit);

  if (error || !data) {
    console.error("Error fetching tutor cards:", error);
    return [];
  }

  return data.map((tutor: any) => ({
    id: tutor.id,
    firstname: tutor.firstname,
    lastname: tutor.lastname,
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

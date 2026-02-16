import { Section } from "@/lib/tutors/sections/types";

// ==========================================
// SHARED / PRIMITIVE TYPES
// ==========================================

export type LevelDefinition = {
  level: number;
  xp_required: number;
};

export type Progression = {
  level: number;
  current_xp: number;
  next_level_xp?: number; 
};

export type Review = {
  id: string;
  student_firstname: string;
  student_lastname: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

// ==========================================
// TUTOR CARD (Lightweight)
// ==========================================
export type TutorCard = {
  id: string;
  firstname: string;
  lastname: string;
  title: string;
  image_url: string | null;
  hourly_rate: number;
  rating_avg: number;
  rating_count: number;
  badge_text?: string;
  is_verified: boolean;
  level: number;
};

// ==========================================
// FULL PROFILE (Heavy)
// ==========================================
export type TutorProfile = {
  id: string;
  is_public: boolean;

  header: {
    firstname: string;
    lastname: string;
    title?: string;
    subtitle?: string;
    image_url: string | null;
    badge_text?: string;
    is_verified: boolean;
    hourly_rate: number;
  };

  stats: {
    rating_avg: number;
    rating_count: number;
    return_rate: number;
    show_rating: boolean;
    show_return_rate: boolean;
  };

  progression: Progression;
  sections: Section[];
  reviews: Review[];
};

// ==========================================
// STUDENT TYPES
// ==========================================

export type Student = {
  id: string;
  firstname: string;
  lastname: string;
  image_url: string | null;
  progression: Progression;
};

// ==========================================
// ENGAGEMENT TYPES
// ==========================================

export type EngagementStatus = 'active' | 'completed' | 'cancelled';

export type Engagement = {
  id: string;
  student_id: string;
  tutor_id: string;
  status: EngagementStatus;
  created_at: string;
};

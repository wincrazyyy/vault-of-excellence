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
  next_level_xp: number;
};

export type ClaimedQuest = {
  quest_id: string;
  claimed_at: string;
  xp_gained: number;
};

export type Review = {
  id: string;

  firstname: string;
  lastname: string;
  school_name?: string | null;
  image_url?: string | null;

  is_legacy: boolean;
  rating: number | null;
  comment: string | null;
  is_visible: boolean;
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
  total_reviews: number;
  badge_text?: string;
  is_verified: boolean;
  level: number;
  tags: string[];
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
    total_reviews: number;
    return_rate: number;
    show_rating: boolean;
    show_return_rate: boolean;
  };

  progression: Progression;
  claimed_quests: string[];

  tags: string[];

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
  school_name: string | null;
  progression: Progression;
};

// ==========================================
// ENGAGEMENT TYPES
// ==========================================

export type EngagementStatus = 'pending' | 'active' | 'completed' | 'cancelled';

export type Engagement = {
  id: string;
  student_id: string | null;
  tutor_id: string;
  status: EngagementStatus;

  guest_name?: string | null; 
  guest_email?: string | null;
  initial_message?: string | null;
  
  created_at: string;
};

// ==========================================
// TUTOR APPLICATION
// ==========================================

export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export type TutorApplication = {
  id: string;
  tutor_id: string;
  firstname: string;
  lastname: string;
  gender?: string | null;
  phone?: string | null;
  email: string;
  university?: string | null;
  degree?: string | null;
  major?: string | null;
  tutoring_intent?: string | null;
  graduation_year?: string | null;
  teaching_experience_years?: number | null;
  teaching_subject?: string | null;
  self_intro?: string | null;
  status: ApplicationStatus;
  created_at: string;
};

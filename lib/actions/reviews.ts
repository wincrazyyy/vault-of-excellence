"use server";

import { createClient } from "@/lib/supabase/server";

export interface GuestReviewPayload {
  tutor_id: string;
  guest_firstname: string;
  guest_lastname: string;
  guest_school_name?: string | null;
  rating: number;
  comment?: string | null;
}

export async function submitGuestReview(payload: GuestReviewPayload) {
  if (!payload.tutor_id || !payload.guest_firstname || !payload.guest_lastname || !payload.rating) {
    throw new Error("Missing required fields for review.");
  }

  if (payload.rating < 1 || payload.rating > 5) {
    throw new Error("Rating must be between 1 and 5.");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("reviews")
    .insert({
      tutor_id: payload.tutor_id,
      guest_firstname: payload.guest_firstname.trim(),
      guest_lastname: payload.guest_lastname.trim(),
      guest_school_name: payload.guest_school_name?.trim() || null,
      rating: payload.rating,
      comment: payload.comment?.trim() || null,
      is_legacy: false,
      is_visible: false, 
    });

  if (error) {
    console.error("Failed to submit guest review:", error);
    throw new Error("Failed to submit review. Please try again.");
  }

  return { success: true };
}

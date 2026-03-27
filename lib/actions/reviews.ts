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

export async function toggleReviewVisibility(reviewId: string, isVisible: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("reviews")
    .update({ is_visible: isVisible })
    .eq("id", reviewId)
    .eq("tutor_id", user.id);

  if (error) throw new Error(error.message);
  return { success: true };
}

export async function deleteLegacyReview(reviewId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("reviews")
    .delete()
    .eq("id", reviewId)
    .eq("tutor_id", user.id)
    .eq("is_legacy", true);

  if (error) throw new Error(error.message);
  return { success: true };
}

export interface UpdateLegacyReviewPayload {
  guest_firstname: string;
  guest_lastname: string;
  guest_school_name?: string | null;
  guest_image_url?: string | null;
  comment?: string | null;
}

export async function updateLegacyReview(reviewId: string, updates: UpdateLegacyReviewPayload) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("reviews")
    .update(updates)
    .eq("id", reviewId)
    .eq("tutor_id", user.id)
    .eq("is_legacy", true); 

  if (error) throw new Error(error.message);
  return { success: true };
}

export interface AddLegacyReviewPayload {
  firstname: string;
  lastname: string;
  school_name?: string | null;
  image_url?: string | null;
  comment?: string | null;
}

export async function addLegacyReview(payload: AddLegacyReviewPayload) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      tutor_id: user.id,
      guest_firstname: payload.firstname.trim(),
      guest_lastname: payload.lastname.trim(),
      guest_school_name: payload.school_name?.trim() || null,
      guest_image_url: payload.image_url || null, 
      rating: null,
      comment: payload.comment?.trim() || null,
      is_legacy: true,
      is_visible: true
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return { success: true, data };
}

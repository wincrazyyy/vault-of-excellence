// lib/actions/booking.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function requestLessonAction(tutorId: string, message: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: "You must be logged in to request a lesson." };
  }

  if (user.id === tutorId) {
    return { success: false, message: "You cannot book a lesson with yourself!" };
  }

  const { error } = await supabase
    .from("engagements")
    .insert({
      student_id: user.id,
      tutor_id: tutorId,
      status: "active"
    });

  if (error) {
    if (error.code === '23505') {
      return { success: false, message: "You already have an active or pending engagement with this tutor." };
    }
    console.error("Booking error:", error);
    return { success: false, message: "Failed to send request. Please try again." };
  }

  return { success: true };
}

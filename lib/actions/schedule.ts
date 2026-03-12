"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addAvailabilitySlot(dayOfWeek: number, startTime: string, endTime: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  if (startTime >= endTime) {
    throw new Error("Start time must be before end time.");
  }

  const { data, error } = await supabase
    .from("tutor_availability")
    .insert({
      tutor_id: user.id,
      day_of_week: dayOfWeek,
      start_time: startTime,
      end_time: endTime,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding slot:", error.message);
    throw new Error("Failed to add availability slot.");
  }

  revalidatePath("/dashboard/schedule");
  return data; 
}

export async function deleteAvailabilitySlot(slotId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("tutor_availability")
    .delete()
    .eq("id", slotId)
    .eq("tutor_id", user.id);

  if (error) {
    console.error("Error removing slot:", error.message);
    throw new Error("Failed to remove availability slot.");
  }

  revalidatePath("/dashboard/schedule");
}

export async function clearAllAvailability() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("tutor_availability")
    .delete()
    .eq("tutor_id", user.id);

  if (error) throw new Error(error.message);
  
  revalidatePath("/dashboard/schedule");
}

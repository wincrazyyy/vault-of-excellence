"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateEngagementStatus(engagementId: string, newStatus: 'active' | 'cancelled' | 'completed') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("engagements")
    .update({ status: newStatus })
    .eq("id", engagementId)
    .or(`tutor_id.eq.${user.id},student_id.eq.${user.id}`)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Engagement not found or unauthorized.");
  }

  revalidatePath("/dashboard/engagements");
}

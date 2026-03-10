"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateEngagementStatus(engagementId: string, newStatus: 'active' | 'cancelled' | 'completed') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("engagements")
    .update({ status: newStatus })
    .eq("id", engagementId)
    .eq("tutor_id", user.id);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard/engagements");
}
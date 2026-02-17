"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function claimQuestAction(questId: string, xpAmount: number) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.rpc('claim_tutor_xp', {
    p_tutor_id: user.id,
    p_quest_id: questId,
    p_xp_points: xpAmount
  });

  if (error) {
    console.error("Quest claim error:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { evaluateQuestRules } from "@/lib/quests/engine";

export async function claimQuestAction(questId: string) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: quest } = await supabase
    .from("quests")
    .select("xp_reward, requirements")
    .eq("id", questId)
    .single();

  if (!quest) return { success: false, message: "Quest not found." };

  const { data: tutor } = await supabase
    .from("tutors")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!tutor) return { success: false, message: "Tutor profile not found." };

  const isMet = evaluateQuestRules(quest.requirements?.rules || [], tutor);

  if (!isMet) {
    return { success: false, message: "You have not met the requirements for this quest yet." };
  }

  const { error } = await supabase.rpc('claim_tutor_xp', {
    p_tutor_id: user.id,
    p_quest_id: questId,
    p_xp_points: quest.xp_reward
  });

  if (error) {
    console.error("Quest claim error:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

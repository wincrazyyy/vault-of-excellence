"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function approveApplication(applicationId: string, tutorId: string) {
  const supabase = await createClient();

  const { error: appError } = await supabase
    .from("tutor_applications")
    .update({ status: "approved" })
    .eq("id", applicationId);

  if (appError) throw new Error(appError.message);

  const { error: tutorError } = await supabase
    .from("tutors")
    .update({ is_verified: true })
    .eq("id", tutorId);

  if (tutorError) throw new Error(tutorError.message);

  revalidatePath("/admin");
}

export async function rejectApplication(applicationId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("tutor_applications")
    .update({ status: "rejected" })
    .eq("id", applicationId);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
}
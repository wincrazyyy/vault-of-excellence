"use server";

import { createClient } from "@/lib/supabase/server";
import { google } from "googleapis";

export async function getTutorPublicSchedule(tutorId: string) {
  const supabase = await createClient();

  const { data: availability } = await supabase
    .from("tutor_availability")
    .select("day_of_week, start_time, end_time")
    .eq("tutor_id", tutorId);

  const { data: engagements } = await supabase
    .from("engagements")
    .select("scheduled_start, scheduled_end")
    .eq("tutor_id", tutorId)
    .not("scheduled_start", "is", null);

  let googleEvents: any[] = [];
  const { data: integration } = await supabase
    .from("tutor_integrations")
    .select("google_access_token, google_refresh_token")
    .eq("tutor_id", tutorId)
    .single();

  if (integration?.google_refresh_token) {
    try {
      const oauth2Client = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
      );
      
      oauth2Client.setCredentials({
        access_token: integration.google_access_token,
        refresh_token: integration.google_refresh_token,
      });

      const calendar = google.calendar({ version: "v3", auth: oauth2Client });
      
      const timeMax = new Date();
      timeMax.setDate(timeMax.getDate() + 28);

      const res = await calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        timeMax: timeMax.toISOString(),
        singleEvents: true,
      });

      googleEvents = (res.data.items || []).map((item) => ({
        start: item.start?.dateTime || item.start?.date,
        end: item.end?.dateTime || item.end?.date,
      }));
    } catch (error) {
      console.error("Failed to fetch public Google Events:", error);
    }
  }

  return {
    availability: availability || [],
    busy: [...(engagements || []), ...googleEvents],
  };
}

interface BookingPayload {
  tutorId: string;
  name: string;
  email: string;
  phone: string | null;
  school: string | null;
  year: string | null;
  message: string;
  scheduled_start: string;
  scheduled_end: string;
}

export async function requestLessonAction(payload: BookingPayload) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user && user.id === payload.tutorId) {
    return { success: false, message: "You cannot book a lesson with yourself!" };
  }

  const { error } = await supabase
    .from("engagements")
    .insert({
      tutor_id: payload.tutorId,
      student_id: user ? user.id : null,
      guest_name: payload.name,
      guest_email: payload.email,
      guest_phone: payload.phone,
      guest_school: payload.school,
      guest_year: payload.year,
      initial_message: payload.message,
      scheduled_start: payload.scheduled_start,
      scheduled_end: payload.scheduled_end,
      status: "pending"
    });

  if (error) {
    if (error.code === '23505') {
      return { success: false, message: "You already have a pending request with this tutor." };
    }
    console.error("Booking error:", error);
    return { success: false, message: "Failed to send request. Please try again." };
  }

  return { success: true };
}

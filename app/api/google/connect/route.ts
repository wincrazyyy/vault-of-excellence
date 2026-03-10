import { NextResponse } from "next/server";
import { google } from "googleapis";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
  const redirectUri = new URL("/api/google/callback", baseUrl).toString();

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline", 
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/calendar.readonly"],
  });

  return NextResponse.redirect(url);
}
import { NextResponse } from "next/server";
import { google } from "googleapis";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard/schedule?error=NoCode", req.url));
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || url.origin;
  const redirectUri = new URL("/api/google/callback", baseUrl).toString();

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );

  try {
    const { tokens } = await oauth2Client.getToken(code);
    
    const { error } = await supabase
      .from("tutor_integrations")
      .upsert({
        tutor_id: user.id,
        google_access_token: tokens.access_token,
        ...(tokens.refresh_token && { google_refresh_token: tokens.refresh_token }),
        updated_at: new Date().toISOString()
      }, { onConflict: 'tutor_id' });

    if (error) throw new Error(error.message);

    return NextResponse.redirect(new URL("/dashboard/schedule?success=calendar_connected", req.url));

  } catch (error) {
    console.error("Google Auth Error:", error);
    return NextResponse.redirect(new URL("/dashboard/schedule?error=OAuthFailed", req.url));
  }
}

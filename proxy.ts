import { updateSession } from "@/lib/supabase/proxy";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // --- MAINTENANCE MODE SETTING ---
  // Change this to 'false' and push your code to bring the site back online
  const isMaintenanceMode = true; 

  // If maintenance mode is ON, and the user is not already on the maintenance page...
  if (isMaintenanceMode && !request.nextUrl.pathname.startsWith('/maintenance')) {
    const maintenanceUrl = request.nextUrl.clone();
    maintenanceUrl.pathname = '/maintenance';
    
    // REMOVED the { status: 503 } so Next.js will actually render your page UI
    return NextResponse.rewrite(maintenanceUrl);
  }

  // If maintenance mode is OFF (or they are viewing the maintenance page), 
  // proceed with your normal Supabase authentication logic.
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - api/admin/cleanup-images (Allow Cron Jobs to bypass middleware)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/admin/cleanup-images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
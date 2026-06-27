import { updateSession } from "@/lib/supabase/proxy";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Set to 'false' to bring your site back online
  const isMaintenanceMode = true; 

  // If maintenance mode is ON and they aren't on the maintenance page...
  if (isMaintenanceMode && !request.nextUrl.pathname.startsWith('/maintenance')) {
    const maintenanceUrl = request.nextUrl.clone();
    maintenanceUrl.pathname = '/maintenance';
    
    // CHANGED: Use a temporary redirect to bypass the 404 rewrite bug
    return NextResponse.redirect(maintenanceUrl);
  }

  // Proceed normally if maintenance is off or they are already on /maintenance
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/admin/cleanup-images|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Set this to false when you want your site back online
  const isMaintenanceMode = true;

  // If maintenance mode is ON, and the user isn't already ON the maintenance page...
  if (isMaintenanceMode && !req.nextUrl.pathname.startsWith('/maintenance')) {
    // Clone the URL and redirect them to the maintenance page
    const maintenanceUrl = req.nextUrl.clone();
    maintenanceUrl.pathname = '/maintenance';
    
    // Return a 503 status for SEO protection
    return NextResponse.rewrite(maintenanceUrl, { status: 503 });
  }

  return NextResponse.next();
}

export const config = {
  // This tells the middleware to run on EVERY path EXCEPT static files and images
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
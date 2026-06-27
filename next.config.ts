import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Catch all routes EXCEPT the maintenance page itself, API routes, and static Next.js files
        source: '/((?!maintenance|_next/static|_next/image|favicon.ico|api).*)',
        destination: '/maintenance',
      },
    ];
  },
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "nisrcasjzwjfcvpvwuxh.supabase.co", 
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
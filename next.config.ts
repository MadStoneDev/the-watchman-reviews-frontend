import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/t/p/**",
        search: "",
      },
      {
        protocol: "https",
        hostname: "supabase.justreel.app",
        port: "",
        pathname: "/storage/v1/object/public/**",
        search: "",
      },
    ],
  },

  // FIX: Increase header size limit for Supabase auth tokens
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // This doesn't directly fix 431 but helps with large requests
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;

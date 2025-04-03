/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
        port: "",
        pathname: "/t/p/**",
      },
    ],
  },

  async redirects() {
    return [
      {
        source: "/login",
        destination: "/auth/portal",
        permanent: true,
      },
      {
        source: "/register",
        destination: "/auth/portal",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/auth/portal",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

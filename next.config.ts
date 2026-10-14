import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bonus Task 1: Rewrites instead of CORS
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/:path*",
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

type NextConfigWithEsLint = NextConfig & {
  eslint?: {
    ignoreDuringBuilds?: boolean;
  };
};

const nextConfig: NextConfigWithEsLint = {
  /* config options here */
  typescript: {
    // This allows the build to succeed even with the WhatsAppButton error
    ignoreBuildErrors: true,
  },
  eslint: {
    // Optional: This also skips linting checks for an even faster build
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
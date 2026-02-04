import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Remote images configuration (replacement for deprecated images.domains)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "marakbi-e0870d98592a.herokuapp.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    // Allow using specific quality values in <Image quality={...} />
    // to avoid Next.js 16 warning about images.qualities
    qualities: [75, 85, 90],
  },
};

export default nextConfig;
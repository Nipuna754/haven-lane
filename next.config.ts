import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Photos uploaded in Sanity Studio
      new URL("https://cdn.sanity.io/images/**"),
      // Sample photos from Pexels (sized with ?w=…, so the query string must be allowed)
      { protocol: "https", hostname: "images.pexels.com", pathname: "/photos/**" },
    ],
  },
};

export default nextConfig;

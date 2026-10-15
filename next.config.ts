import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cache Components keeps visited pages mounted (hidden) for instant back/forward.
  // Both homepages share section ids (#services, #quote...), so a hidden copy would
  // swallow anchor links. Plain navigation keeps one page in the DOM at a time.
  cacheComponents: false,
  devIndicators: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    // The first two homepages now live under the Variations tab.
    return [
      { source: "/home-page-1", destination: "/variations/home-page-1", permanent: false },
      { source: "/home-page-2", destination: "/variations/home-page-2", permanent: false },
    ];
  },
};

export default nextConfig;

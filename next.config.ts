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
    return [{ source: "/", destination: "/home-page-1", permanent: false }];
  },
};

export default nextConfig;

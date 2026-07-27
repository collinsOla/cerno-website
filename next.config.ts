import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages can only serve static files, so emit the site into `out/`.
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

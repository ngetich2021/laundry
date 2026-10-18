import type { NextConfig } from "next";

// Fully static website: `npm run build` writes plain HTML/CSS/JS to /out,
// which the GitHub Action uploads to the server. No Node server, no database.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  devIndicators: false,
};

export default nextConfig;

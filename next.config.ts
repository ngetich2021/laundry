import path from "node:path";
import type { NextConfig } from "next";

// Fully static website: `npm run build` writes plain HTML/CSS/JS to /out,
// which the GitHub Action uploads to the server. No Node server, no database.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  devIndicators: false,
  // This project lives inside /opt/lampp/htdocs next to other projects;
  // pin the root so Next.js never treats the parent folder as the project.
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;

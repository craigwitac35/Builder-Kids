import type { NextConfig } from "next";

// output: "export" produces a fully static build — required later for
// wrapping the game in an app shell (Capacitor etc.) with no rewrite.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;

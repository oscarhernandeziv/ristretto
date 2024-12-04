import type { NextConfig } from "next";

import "./src/env/server.ts";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;

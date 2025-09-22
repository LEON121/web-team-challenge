import type { NextConfig } from "next";
import pkg from "./package.json";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_CHALLENGE_VERSION: pkg.version,
  },
};

export default nextConfig;
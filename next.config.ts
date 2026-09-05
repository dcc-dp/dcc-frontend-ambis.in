import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "localhost",
    "localhost:3001",
    "127.0.0.1",
    "127.0.0.1:3001",
    "host.docker.internal",
    "host.docker.internal:3001",
  ],
};

export default nextConfig;

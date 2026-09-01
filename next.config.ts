import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ['*.trycloudflare.com'],
  devIndicators: {
    position: 'bottom-right',
  },
};

export default nextConfig;

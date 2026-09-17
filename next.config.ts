import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Inject headers untuk Cross-Origin Isolation (Wajib untuk FFmpeg Multi-threading)
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
  
  // Tambahkan ini untuk membungkam error Turbopack di mode development
  turbopack: {},

  // Biarkan webpack config ini untuk production build (npm run build)
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "sharp$": false,
      "onnxruntime-node$": false,
    };
    return config;
  },
};

export default nextConfig;
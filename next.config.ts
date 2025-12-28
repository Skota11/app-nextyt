import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Turbopack で MDX を解釈させる
    mdxRs: true,
    turbo: {
      rules: {
        "*.mdx": {
          loaders: ["@mdx-js/loader"],
        },
      },
    },
  },
  pageExtensions: ["ts", "tsx", "mdx"],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        {
          loader: "@mdx-js/loader",
          options: {
            providerImportSource: "@mdx-js/react",
          },
        },
      ],
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'yt3.ggpht.com',
      }
    ],
  }
};

export default withBundleAnalyzer(nextConfig);
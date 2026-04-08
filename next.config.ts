import bundleAnalyzer from '@next/bundle-analyzer';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'unload=()',
          },
        ],
      },
    ];
  },
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-popover',
      '@radix-ui/react-slot',
      '@tanstack/react-query',
      'date-fns',
      'framer-motion',
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tdpigwjkpkeybdnxxbgr.supabase.co',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'image.mux.com',
      },
    ],
    // 우선 렌더링 되야 하는것들
    formats: ['image/avif', 'image/webp'],
    // 실제 사용되는 디바이스 크기들
    deviceSizes: [375, 414, 640, 744, 768, 1024, 1344, 1440, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    minimumCacheTTL: 31536000,
  },
  webpack(config) {
    // 기존 SVG 규칙 찾기 및 제거
    const fileLoaderRule = config.module.rules.find((rule: { test?: RegExp }) =>
      rule.test?.test?.('.svg'),
    );

    if (fileLoaderRule && 'exclude' in fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    // SVG를 React 컴포넌트로 변환
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

const withAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
});

export default withAnalyzer(nextConfig);

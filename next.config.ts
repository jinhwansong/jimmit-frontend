import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from 'next';

// 개발 환경에서 서버 사이드 MSW 시작
if (process.env.NODE_ENV === 'development') {
  require('./src/mocks/server-start'); // eslint-disable-line @typescript-eslint/no-require-imports
}

const nextConfig: NextConfig = {
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

export default withSentryConfig(nextConfig, {
  org: 'jimmit-fz',

  project: 'javascript-nextjs',

  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',

  webpack: {
    automaticVercelMonitors: true,

    treeshake: {
      removeDebugLogging: true,
    },
  },
});

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
        hostname: 'aws-1-ap-northeast-2.pooler.supabase.com',
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
  experimental: {
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  webpack(config) {
    // 일반 웹팩 모드에서도 동작하도록
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};

export default withSentryConfig(nextConfig, {
  org: 'jimmit',
  project: 'javascript-nextjs',

  silent: !process.env.CI,

  widenClientFileUpload: true,
  tunnelRoute: '/monitoring',

  disableLogger: true,
  automaticVercelMonitors: true,
});

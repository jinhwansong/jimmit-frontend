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

  // CI 환경이 아닐 때는 로그를 숨깁니다.
  silent: !process.env.CI,

  // 클라이언트 측 소스 맵 업로드 범위 확장
  widenClientFileUpload: true,

  // Sentry가 엣지/미들웨어에서 Node.js 전용 모듈을 찾지 않도록 차단
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
  },

  // 엣지 런타임에서 문제를 일으키는 로거와 터널 설정을 더 안전하게 관리
  disableLogger: true,

  // 터널링 주소 (이게 때때로 엣지 환경에서 충돌을 줍니다)
  tunnelRoute: '/monitoring',

  // 자동 모니터링 활성화
  automaticVercelMonitors: true,
});

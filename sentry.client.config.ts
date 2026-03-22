// This file configures the initialization of Sentry on the client.
// The added config here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn:
    process.env.NEXT_PUBLIC_SENTRY_DSN ||
    'https://13c31c43a99e0caa84cfed7f32e5ae19@o4510748957278208.ingest.us.sentry.io/4510748958064640',

  // Session Replay 제거 - 초기 번들/네트워크 부담 감소 (필요 시 replayIntegration() 재추가)
  // integrations: [Sentry.replayIntegration()],

  // 트레이싱 샘플 10% - LCP/번들 부담 감소
  tracesSampleRate: 0.1,

  debug: false,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;

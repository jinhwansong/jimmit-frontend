import { setupWorker } from 'msw/browser';
import { gatheringsHandlers } from '@/mocks/handlers/gatherings';
import { authHandlers } from '@/mocks/handlers/auth';
import { userHandlers } from '@/mocks/handlers/user';
import { reviewHandlers } from '@/mocks/handlers/review';

// 브라우저에서 MSW 실행
export const worker = setupWorker(
  ...gatheringsHandlers,
  ...authHandlers,
  ...userHandlers,
  ...reviewHandlers,
);

console.log('MSW 핸들러 등록됨:', {
  gatherings: gatheringsHandlers.length,
  auth: authHandlers.length,
  user: userHandlers.length,
  review: reviewHandlers.length,
});

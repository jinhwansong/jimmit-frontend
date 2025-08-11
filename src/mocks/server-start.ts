import { server } from './server';

if (process.env.NODE_ENV === 'development') {
  console.log('MSW 서버 사이드 시작');
  server.listen({ onUnhandledRequest: 'bypass' });
}

import { http, HttpResponse } from 'msw';
import { MOCK_TOKENS, MOCK_USER } from '../data/auth';

export const authHandlers = [
  // 로그인
  http.post('*/login', async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string };
    const { email, password } = body;

    if (email === 'test@example.com' && password === 'password') {
      return HttpResponse.json({
        success: true,
        result: {
          accessToken: 'mock-access-token',
          refreshToken: 'mock-refresh-token',
          user: MOCK_USER,
        },
      });
    }

    return new HttpResponse(null, { status: 401 });
  }),

  // 이메일 중복 확인
  http.get('*/user/exists', ({ request }) => {
    const url = new URL(request.url);
    const email = url.searchParams.get('email');

    if (email === 'test@example.com') {
      return HttpResponse.json({ exists: true });
    }

    return HttpResponse.json({ exists: false });
  }),

  // 회원가입
  http.post('*/user', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      result: {
        ...MOCK_USER,
        ...body,
      },
    });
  }),

  // 이메일 인증 코드 발송
  http.post('*/auth/email/send-code', async () => {
    return HttpResponse.json({
      success: true,
      result: { message: '인증 코드가 발송되었습니다.' },
    });
  }),

  // 이메일 인증 코드 확인
  http.post('*/auth/email/verify-code', async ({ request }) => {
    const body = (await request.json()) as { code: string };
    const { code } = body;

    if (code === '123456') {
      return HttpResponse.json({
        success: true,
        result: { message: '인증이 완료되었습니다.' },
      });
    }

    return new HttpResponse(null, { status: 400 });
  }),

  // 토큰 갱신
  http.post('*/auth/refresh', async ({ request }) => {
    const body = (await request.json()) as { refreshToken: string };
    const { refreshToken } = body;

    // refreshToken 유효성 검사
    if (refreshToken && refreshToken.includes('mock')) {
      return HttpResponse.json({
        success: true,
        result: {
          accessToken: MOCK_TOKENS.accessToken,
        },
      });
    }

    return new HttpResponse(null, { status: 401 });
  }),
];

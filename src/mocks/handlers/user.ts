import { http, HttpResponse } from 'msw';
import { MOCK_USER_PROFILE, MOCK_UPLOADED_IMAGES } from '../data/user';

export const userHandlers = [
  // 내 정보 조회
  http.get('*/user', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 토큰 확인
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token.includes('mock')) {
      return new HttpResponse(null, { status: 401 });
    }

    return HttpResponse.json(MOCK_USER_PROFILE);
  }),

  // 프로필 수정
  http.put('*/user', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 토큰 확인
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token.includes('mock')) {
      return new HttpResponse(null, { status: 401 });
    }

    const body = (await request.json()) as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      result: {
        ...MOCK_USER_PROFILE,
        ...body,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // 프로필 이미지 수정
  http.put('*/user/image', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 토큰 확인
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token.includes('mock')) {
      return new HttpResponse(null, { status: 401 });
    }

    const body = (await request.json()) as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      result: {
        ...MOCK_USER_PROFILE,
        profileImagePath: body.profileImagePath as string,
        updatedAt: new Date().toISOString(),
      },
    });
  }),

  // 프로필 이미지 업로드
  http.post('*/user/:userId/profile-image', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 토큰 확인
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token.includes('mock')) {
      return new HttpResponse(null, { status: 401 });
    }

    // FormData 처리 (실제 파일 업로드 시뮬레이션)
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new HttpResponse(null, { status: 400 });
    }

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return new HttpResponse(null, { status: 413 });
    }

    // 허용된 파일 타입 체크
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return new HttpResponse(null, { status: 415 });
    }

    // 랜덤하게 업로드된 이미지 경로 선택
    const randomImage =
      MOCK_UPLOADED_IMAGES[
        Math.floor(Math.random() * MOCK_UPLOADED_IMAGES.length)
      ];

    // 실제 코드가 기대하는 형식: result에 profileImagePath 문자열만 반환
    return HttpResponse.json({
      success: true,
      result: randomImage,
    });
  }),
];

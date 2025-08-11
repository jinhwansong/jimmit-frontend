import { http, HttpResponse } from 'msw';
import {
  MOCK_REVIEW_STATISTICS,
  MOCK_RECEIVED_REVIEWS,
  MOCK_WRITTEN_REVIEWS,
  MOCK_REVIEWS_TO_WRITE,
} from '../data/review';
import { PostReviewRequest } from '../../types/review';

export const reviewHandlers = [
  // 받은 리뷰 통계
  http.get('*/review/received/statistics', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 토큰 확인
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token.includes('mock')) {
      return new HttpResponse(null, { status: 401 });
    }

    return HttpResponse.json(MOCK_REVIEW_STATISTICS);
  }),

  // 받은 리뷰 목록
  http.get('*/review/received', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 토큰 확인
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token.includes('mock')) {
      return new HttpResponse(null, { status: 401 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '8');

    // 페이지네이션
    const totalElements = MOCK_RECEIVED_REVIEWS.length;
    const totalPage = Math.ceil(totalElements / size);
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedReviews = MOCK_RECEIVED_REVIEWS.slice(startIndex, endIndex);

    return HttpResponse.json({
      content: paginatedReviews,
      page,
      size,
      totalElements,
      totalPages: totalPage,
      last: page >= totalPage - 1,
    });
  }),

  // 작성한 리뷰 목록
  http.get('*/review/written', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 토큰 확인
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token.includes('mock')) {
      return new HttpResponse(null, { status: 401 });
    }

    return HttpResponse.json(MOCK_WRITTEN_REVIEWS);
  }),

  // 작성할 리뷰 목록
  http.get('*/review/unwritten', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 토큰 확인
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token.includes('mock')) {
      return new HttpResponse(null, { status: 401 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '8');

    // 페이지네이션
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedGatherings = MOCK_REVIEWS_TO_WRITE.result
      .slice(startIndex, endIndex)
      .map((gathering) => ({
        ...gathering,
        status: 'COMPLETED', // 완료된 모임 상태 추가
      }));

    return HttpResponse.json({
      ...MOCK_REVIEWS_TO_WRITE,
      result: paginatedGatherings,
    });
  }),

  // 작성할 리뷰 목록 (상대 경로)
  http.get('/review/unwritten', ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 토큰 확인
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token.includes('mock')) {
      return new HttpResponse(null, { status: 401 });
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '8');

    // 페이지네이션
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedGatherings = MOCK_REVIEWS_TO_WRITE.result
      .slice(startIndex, endIndex)
      .map((gathering) => ({
        ...gathering,
        status: 'COMPLETED', // 완료된 모임 상태 추가
      }));

    return HttpResponse.json({
      ...MOCK_REVIEWS_TO_WRITE,
      result: paginatedGatherings,
    });
  }),

  // 리뷰 작성
  http.post('*/review', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 토큰 확인
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token.includes('mock')) {
      return new HttpResponse(null, { status: 401 });
    }

    const body = (await request.json()) as PostReviewRequest;

    // 필수 필드 검증
    if (!body?.gatheringId || !body?.revieweeId || !body?.content) {
      return new HttpResponse(null, { status: 400 });
    }

    // 리뷰 작성 성공
    return HttpResponse.json({
      success: true,
      result: {
        id: Math.floor(Math.random() * 1000) + 100,
        ...body,
        createdAt: new Date().toISOString(),
      },
    });
  }),

  // 리뷰 상세 조회
  http.get('*/review/:id', ({ request, params }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 토큰 확인
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token.includes('mock')) {
      return new HttpResponse(null, { status: 401 });
    }

    const { id } = params;
    const reviewId = parseInt(id as string);

    // 리뷰 찾기
    const review = [...MOCK_RECEIVED_REVIEWS, ...MOCK_WRITTEN_REVIEWS].find(
      (r) => r.id === reviewId,
    );

    if (!review) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({
      success: true,
      result: review,
    });
  }),

  // 특정 참가자 리뷰 조회
  http.get(
    '*/review/:gatheringId/participants/:userId/reviews',
    async ({ request, params }) => {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new HttpResponse(null, { status: 401 });
      }

      const token = authHeader.replace('Bearer ', '');
      if (!token.includes('mock')) {
        return new HttpResponse(null, { status: 401 });
      }

      const gatheringId = parseInt(params.gatheringId as string);
      const userId = parseInt(params.userId as string);

      // URL 파라미터에서 페이지 정보 추출
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '0');
      const size = parseInt(url.searchParams.get('size') || '10');

      // 해당 모임의 해당 참가자에 대한 리뷰들 필터링
      const allReviews = [...MOCK_RECEIVED_REVIEWS, ...MOCK_WRITTEN_REVIEWS];

      const filteredReviews = allReviews.filter(
        (review) =>
          review.gatheringId === gatheringId && review.reviewerId === userId,
      );

      // 페이지네이션 적용
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

      const totalElements = filteredReviews.length;
      const totalPages = Math.ceil(totalElements / size);
      const last = page >= totalPages - 1;

      return HttpResponse.json({
        content: paginatedReviews,
        page,
        size,
        totalElements,
        totalPages,
        last,
      });
    },
  ),

  // 특정 참가자 리뷰 조회 (상대 경로)
  http.get(
    '/review/:gatheringId/participants/:userId/reviews',
    async ({ request, params }) => {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new HttpResponse(null, { status: 401 });
      }

      const token = authHeader.replace('Bearer ', '');
      if (!token.includes('mock')) {
        return new HttpResponse(null, { status: 401 });
      }

      const gatheringId = parseInt(params.gatheringId as string);
      const userId = parseInt(params.userId as string);

      // URL 파라미터에서 페이지 정보 추출
      const url = new URL(request.url);
      const page = parseInt(url.searchParams.get('page') || '0');
      const size = parseInt(url.searchParams.get('size') || '10');

      // 해당 모임의 해당 참가자에 대한 리뷰들 필터링
      const allReviews = [...MOCK_RECEIVED_REVIEWS, ...MOCK_WRITTEN_REVIEWS];

      const filteredReviews = allReviews.filter(
        (review) =>
          review.gatheringId === gatheringId && review.reviewerId === userId,
      );

      // 페이지네이션 적용
      const startIndex = page * size;
      const endIndex = startIndex + size;
      const paginatedReviews = filteredReviews.slice(startIndex, endIndex);

      const totalElements = filteredReviews.length;
      const totalPages = Math.ceil(totalElements / size);
      const last = page >= totalPages - 1;

      return HttpResponse.json({
        content: paginatedReviews,
        page,
        size,
        totalElements,
        totalPages,
        last,
      });
    },
  ),
];

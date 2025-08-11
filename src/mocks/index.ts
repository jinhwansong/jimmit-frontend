export async function initMocks() {
  console.log('MSW 초기화 시작');

  // MSW 비활성화 플래그 확인
  if (process.env.NEXT_PUBLIC_DISABLE_MSW === 'true') {
    console.log('MSW 비활성화됨 (환경변수)');
    return;
  }

  // 개발 환경이 아니라면 실행 X
  if (process.env.NODE_ENV !== 'development') {
    console.log('MSW 비활성화됨 (개발 환경 아님)');
    return;
  }

  if (typeof window === 'undefined') {
    // 서버 사이드
    console.log('MSW 서버 사이드 초기화');
    const { server } = await import('./server');
    server.listen();
  } else {
    // 클라이언트 사이드
    console.log('MSW 클라이언트 사이드 초기화');
    const { worker } = await import('./browser');
    await worker.start({
      onUnhandledRequest: 'bypass', // 처리되지 않은 요청은 무시
    });
    console.log('MSW 워커 시작됨');
  }
}

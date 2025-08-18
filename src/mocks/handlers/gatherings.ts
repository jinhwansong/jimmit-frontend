import { http, HttpResponse } from 'msw';
import { RecruitResponse } from '../../types/recruit';
import {
  RegisterGatheringsRequest,
  ModifiedGatheringsRequest,
} from '../../types/gather';
import { Participant } from '../../types/gathering';
import { BandSessionType, GenreType } from '../../types/tags';
import {
  MOCK_GATHERINGS,
  MOCK_MY_CREATED_GATHERINGS,
  MOCK_MY_PARTICIPATED_GATHERINGS,
  MOCK_MY_ALL_PARTICIPATED_GATHERINGS,
  MOCK_MY_COMPLETED_GATHERINGS,
  MOCK_GATHERING_DETAILS,
  MOCK_PARTICIPANTS,
  MOCK_REGISTER_RESPONSE,
  MOCK_MODIFIED_RESPONSE,
} from '../data/gatherings';

export const gatheringsHandlers = [
  // 모임 상세 조회 (인증 불필요)
  http.get('*/gatherings/:id', ({ params }) => {
    console.log('MSW (서버/클라이언트): 모임 상세 조회 요청 가로챔', params.id);
    const id = parseInt(params.id as string);

    // 기존 모임 데이터가 있으면 사용
    let gatheringDetail =
      MOCK_GATHERING_DETAILS[id as keyof typeof MOCK_GATHERING_DETAILS];

    // 없으면 동적으로 생성
    if (!gatheringDetail) {
      // 작성 가능한 리뷰 모임들은 COMPLETED 상태로 설정
      const isReviewToWriteGathering = [7, 8].includes(id);

      const mockNames = [
        '락 밴드 모집합니다',
        '재즈 세션 모집',
        '팝 밴드 모집',
        '인디 밴드 모집',
        '재즈 트리오',
        '메탈 밴드',
        '클래식 앙상블',
        'RNB 밴드',
        '펑크 밴드',
        '어쿠스틱 포크 세션',
        '블루스 세션',
        '컨트리 밴드',
      ];
      const mockPlaces = [
        '서울 강남구',
        '서울 이태원',
        '서울 홍대',
        '서울 신촌',
        '부산 해운대',
        '대구 동성로',
        '인천 송도',
        '광주 서구',
      ];
      const mockGenres: GenreType[][] = [
        ['ROCK', 'METAL'],
        ['POP', 'BALLAD'],
        ['JAZZ'],
        ['INDIE', 'ALTERNATIVE'],
        ['ACOUSTIC', 'FOLK'],
        // ['ELECTRONIC'],
        // ['HIPHOP'],
        // ['CLASSICAL'],
      ];

      let randomName = mockNames[id % mockNames.length];
      let randomPlace = mockPlaces[id % mockPlaces.length];
      let randomGenres = mockGenres[id % mockGenres.length];

      // 작성 가능한 리뷰 모임들은 MOCK_REVIEWS_TO_WRITE와 일치하도록 설정
      if (isReviewToWriteGathering) {
        if (id === 1) {
          randomName = '락 밴드 모집합니다';
          randomPlace = '서울 강남';
          randomGenres = ['ROCK', 'METAL'] as GenreType[];
        } else if (id === 2) {
          randomName = '재즈 세션 모집';
          randomPlace = '서울 홍대';
          randomGenres = ['JAZZ', 'BLUES'] as GenreType[];
        } else if (id === 3) {
          randomName = '팝 밴드 모집';
          randomPlace = '서울 종로구';
          randomGenres = ['POP', 'ROCK'] as GenreType[];
        } else if (id === 4) {
          randomName = '인디 밴드 모집';
          randomPlace = '서울 마포구';
          randomGenres = ['INDIE', 'ROCK'] as GenreType[];
        } else if (id === 7) {
          randomName = 'R&B 세션';
          randomPlace = '서울 홍대';
          randomGenres = ['RNB', 'BALLAD'] as GenreType[];
        } else if (id === 8) {
          randomName = '스트링 앙상블';
          randomPlace = '서울 종로구';
          randomGenres = ['ACOUSTIC', 'FOLK'] as GenreType[];
        }
      }

      gatheringDetail = {
        id,
        name: randomName,
        thumbnail: `/images/card/img_card_pc_${(id % 18) + 1}.avif`,
        place: randomPlace,
        description: `${randomName}입니다. 다양한 음악을 연주하며 즐거운 시간을 보내고 싶습니다.`,
        gatheringDateTime: `2024-12-${25 + (id % 7)}T19:00:00`,
        recruitDeadline: `2024-12-${20 + (id % 5)}T23:59:59`,
        status: isReviewToWriteGathering
          ? 'COMPLETED'
          : id <= 10
            ? 'COMPLETED'
            : id % 3 === 0
              ? 'COMPLETED'
              : 'RECRUITING',
        genres: randomGenres,
        sessions: isReviewToWriteGathering
          ? id === 7
            ? [
                { bandSession: 'VOCAL', recruitCount: 2, currentCount: 2 },
                {
                  bandSession: 'ELECTRIC_GUITAR',
                  recruitCount: 1,
                  currentCount: 1,
                },
                { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
                { bandSession: 'BASS', recruitCount: 1, currentCount: 1 },
                { bandSession: 'KEYBOARD', recruitCount: 1, currentCount: 1 },
              ]
            : [
                { bandSession: 'VOCAL', recruitCount: 1, currentCount: 1 },
                {
                  bandSession: 'STRING_INSTRUMENT',
                  recruitCount: 3,
                  currentCount: 3,
                },
                { bandSession: 'PERCUSSION', recruitCount: 1, currentCount: 1 },
              ]
          : [
              { bandSession: 'VOCAL', recruitCount: 1, currentCount: id % 2 },
              {
                bandSession: 'ELECTRIC_GUITAR',
                recruitCount: 2,
                currentCount: id % 3,
              },
              { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
              { bandSession: 'BASS', recruitCount: 1, currentCount: id % 2 },
              {
                bandSession: 'KEYBOARD',
                recruitCount: 1,
                currentCount: id % 2,
              },
            ],
        creator: {
          // 현실적인 시나리오: 몇 명의 사용자가 여러 모임을 생성
          // ID 1~10: 테스트유저가 생성한 모임들 (baseGatherings)
          // ID 11~60: 테스트유저가 생성한 모임들
          // ID 61~110: 유저2가 생성한 모임들
          // ID 111~160: 유저3이 생성한 모임들
          // ID 161~210: 유저4가 생성한 모임들
          // ID 211~260: 유저5가 생성한 모임들
          // ID 261~310: 유저6이 생성한 모임들
          // 작성 가능한 리뷰 모임들(ID 7, 8)은 테스트유저가 생성
          id: isReviewToWriteGathering
            ? 1
            : id <= 10
              ? 1
              : Math.floor((id - 11) / 50) + 1,
          nickname: isReviewToWriteGathering
            ? '테스트유저'
            : id <= 10
              ? '테스트유저'
              : Math.floor((id - 11) / 50) === 0
                ? '테스트유저'
                : `유저${Math.floor((id - 11) / 50) + 1}`,
          profileImagePath: '/images/ic_default_profile.svg',
        },
      };
    }

    console.log('MSW: 모임 상세 데이터 반환', gatheringDetail);
    return HttpResponse.json(gatheringDetail);
  }),

  // 모임 상세 조회 (상대 경로, 인증 불필요)
  http.get('/gatherings/:id', ({ params }) => {
    console.log('MSW: 모임 상세 조회 요청 가로챔 (상대 경로)', params.id);
    const id = parseInt(params.id as string);
    const gatheringDetail =
      MOCK_GATHERING_DETAILS[id as keyof typeof MOCK_GATHERING_DETAILS];

    if (!gatheringDetail) {
      console.log('MSW: 모임을 찾을 수 없음 (상대 경로)', id);
      return new HttpResponse(null, { status: 404 });
    }

    console.log('MSW: 모임 상세 데이터 반환 (상대 경로)', gatheringDetail);
    return HttpResponse.json(gatheringDetail);
  }),

  // 모임 참가자 목록 조회 (인증 불필요)
  http.get('*/gatherings/:id/participants', ({ params }) => {
    const id = parseInt(params.id as string);
    console.log('MSW: 참가자 목록 조회 요청', id);

    // 기존 참가자 데이터가 있으면 사용
    let participants: Participant[] =
      (MOCK_PARTICIPANTS[
        id as keyof typeof MOCK_PARTICIPANTS
      ] as Participant[]) ?? [];

    console.log('MSW: 기존 참가자 데이터', participants);

    // 없으면 동적으로 생성
    if (participants.length === 0) {
      // 작성 가능한 리뷰 모임들은 MOCK_REVIEWS_TO_WRITE와 일치하도록 설정
      const isReviewToWriteGathering = [1, 2, 3, 4, 7, 8].includes(id);

      if (isReviewToWriteGathering) {
        if (id === 1) {
          participants = [
            {
              participantId: 10,
              userId: 6,
              userNickname: 'User6',
              userEmail: 'user6@example.com',
              bandSession: 'VOCAL',
              status: 'COMPLETED',
              createdAt: '2024-12-05T18:00:00',
              introduction: '락 음악을 사랑하는 보컬입니다.',
              userProfileImagePath: '/images/ic_default_profile.svg',
            },
          ];
        } else if (id === 2) {
          participants = [
            {
              participantId: 20,
              userId: 7,
              userNickname: 'User7',
              userEmail: 'user7@example.com',
              bandSession: 'DRUM',
              status: 'COMPLETED',
              createdAt: '2024-12-06T19:00:00',
              introduction: '재즈 드럼을 연주하는 뮤지션입니다.',
              userProfileImagePath: '/images/ic_default_profile.svg',
            },
          ];
        } else if (id === 3) {
          participants = [
            {
              participantId: 30,
              userId: 8,
              userNickname: 'User8',
              userEmail: 'user8@example.com',
              bandSession: 'ELECTRIC_GUITAR',
              status: 'COMPLETED',
              createdAt: '2024-12-07T20:00:00',
              introduction: '팝 기타를 연주하는 뮤지션입니다.',
              userProfileImagePath: '/images/ic_default_profile.svg',
            },
          ];
        } else if (id === 4) {
          participants = [
            {
              participantId: 31,
              userId: 9,
              userNickname: 'User9',
              userEmail: 'user9@example.com',
              bandSession: 'BASS',
              status: 'COMPLETED',
              createdAt: '2024-12-08T21:00:00',
              introduction: '인디 베이스를 연주하는 뮤지션입니다.',
              userProfileImagePath: '/images/ic_default_profile.svg',
            },
          ];
        } else if (id === 7) {
          participants = [
            {
              participantId: 40,
              userId: 2,
              userNickname: '재즈맨',
              userEmail: 'jazz@example.com',
              bandSession: 'VOCAL',
              status: 'APPROVED',
              createdAt: '2024-12-08T20:00:00',
              introduction: '재즈를 사랑하는 보컬입니다.',
              userProfileImagePath: '/images/ic_default_profile.svg',
            },
            {
              participantId: 41,
              userId: 3,
              userNickname: '팝스타',
              userEmail: 'pop@example.com',
              bandSession: 'ELECTRIC_GUITAR',
              status: 'APPROVED',
              createdAt: '2024-12-08T20:00:00',
              introduction: '팝 음악을 좋아하는 기타리스트입니다.',
              userProfileImagePath: '/images/ic_default_profile.svg',
            },
          ];
        } else if (id === 8) {
          participants = [
            {
              participantId: 42,
              userId: 4,
              userNickname: '인디러버',
              userEmail: 'indie@example.com',
              bandSession: 'DRUM',
              status: 'APPROVED',
              createdAt: '2024-12-07T19:00:00',
              introduction: '인디 음악을 즐기는 드러머입니다.',
              userProfileImagePath: '/images/ic_default_profile.svg',
            },
            {
              participantId: 43,
              userId: 5,
              userNickname: '어쿠스틱맨',
              userEmail: 'acoustic@example.com',
              bandSession: 'ACOUSTIC_GUITAR',
              status: 'APPROVED',
              createdAt: '2024-12-07T19:00:00',
              introduction: '어쿠스틱 기타를 연주하는 뮤지션입니다.',
              userProfileImagePath: '/images/ic_default_profile.svg',
            },
          ];
        }
      } else {
        const mockNicknames = [
          '보컬리스트',
          '드러머',
          '기타리스트',
          '베이시스트',
          '키보디스트',
          '재즈맨',
          '팝스타',
          '인디러버',
          '락스타',
          '재즈마스터',
        ];
        const mockSessions: BandSessionType[] = [
          'VOCAL',
          'DRUM',
          'ELECTRIC_GUITAR',
          'BASS',
          'KEYBOARD',
        ];

        const participantCount = (id % 5) + 1; // 1~5명

        participants = Array.from({ length: participantCount }, (_, index) => ({
          participantId: id * 100 + index + 1,
          userId: id * 10 + index + 1,
          userNickname: mockNicknames[(id + index) % mockNicknames.length],
          userEmail: `user${id * 10 + index + 1}@test.com`,
          bandSession: mockSessions[index % mockSessions.length],
          status:
            index === 0 ? 'APPROVED' : index % 2 === 0 ? 'PENDING' : 'APPROVED',
          createdAt: `2024-12-${1 + (index % 10)}T${10 + index}:00:00`,
          introduction: `${mockNicknames[(id + index) % mockNicknames.length]}입니다. 즐거운 음악을 만들어가고 싶습니다.`,
          userProfileImagePath: '/images/ic_default_profile.svg',
        }));
      }
    }

    return HttpResponse.json({
      participants,
      total: participants.length,
    });
  }),

  // 모임 참가자 목록 조회 (상대 경로, 인증 불필요)
  http.get('/gatherings/:id/participants', ({ params }) => {
    const id = parseInt(params.id as string);
    console.log('MSW: 참가자 목록 조회 요청 (상대 경로)', id);

    // 기존 참가자 데이터가 있으면 사용
    let participants =
      MOCK_PARTICIPANTS[id as keyof typeof MOCK_PARTICIPANTS] || [];

    console.log('MSW: 기존 참가자 데이터 (상대 경로)', participants);

    // 없으면 동적으로 생성
    if (participants.length === 0) {
      console.log('MSW: 참가자 데이터가 없어서 동적으로 생성 (상대 경로)');
      // 작성 가능한 리뷰 모임들은 MOCK_REVIEWS_TO_WRITE와 일치하도록 설정
      const isReviewToWriteGathering = [1, 2, 3, 4, 7, 8].includes(id);

      if (isReviewToWriteGathering) {
        console.log('MSW: 작성 가능한 리뷰 모임 처리 (상대 경로)', id);
        if (id === 1) {
          participants = [
            {
              participantId: 10,
              userId: 6,
              userNickname: 'User6',
              userEmail: 'user6@example.com',
              bandSession: 'VOCAL',
              status: 'COMPLETED',
              createdAt: '2024-12-05T18:00:00',
              introduction: '락 음악을 사랑하는 보컬입니다.',
              userProfileImagePath: '/images/ic_default_profile.svg',
            },
          ];
        } else if (id === 2) {
          participants = [
            {
              participantId: 20,
              userId: 7,
              userNickname: 'User7',
              userEmail: 'user7@example.com',
              bandSession: 'DRUM',
              status: 'COMPLETED',
              createdAt: '2024-12-06T19:00:00',
              introduction: '재즈 드럼을 연주하는 뮤지션입니다.',
              userProfileImagePath: '/images/ic_default_profile.svg',
            },
          ];
        } else if (id === 3) {
          participants = [
            {
              participantId: 30,
              userId: 8,
              userNickname: 'User8',
              userEmail: 'user8@example.com',
              bandSession: 'ELECTRIC_GUITAR',
              status: 'COMPLETED',
              createdAt: '2024-12-07T20:00:00',
              introduction: '팝 기타를 연주하는 뮤지션입니다.',
              userProfileImagePath: '/images/ic_default_profile.svg',
            },
          ];
        } else if (id === 4) {
          participants = [
            {
              participantId: 31,
              userId: 9,
              userNickname: 'User9',
              userEmail: 'user9@example.com',
              bandSession: 'BASS',
              status: 'COMPLETED',
              createdAt: '2024-12-08T21:00:00',
              introduction: '인디 베이스를 연주하는 뮤지션입니다.',
              userProfileImagePath: '/images/ic_default_profile.svg',
            },
          ];
        } else if (id === 7) {
          participants = [
            {
              participantId: 40,
              userId: 2,
              userNickname: '재즈맨',
              userEmail: 'jazz@example.com',
              bandSession: 'VOCAL',
              status: 'APPROVED',
              createdAt: '2024-12-08T20:00:00',
              introduction: '재즈를 사랑하는 보컬입니다.',
              userProfileImagePath: '/images/ic_default_profile.svg',
            },
            {
              participantId: 41,
              userId: 3,
              userNickname: '팝스타',
              userEmail: 'pop@example.com',
              bandSession: 'ELECTRIC_GUITAR',
              status: 'APPROVED',
              createdAt: '2024-12-08T20:00:00',
              introduction: '팝 음악을 좋아하는 기타리스트입니다.',
              userProfileImagePath: '/images/ic_default_profile.svg',
            },
          ];
        } else if (id === 8) {
          participants = [
            {
              participantId: 42,
              userId: 4,
              userNickname: '인디러버',
              userEmail: 'indie@example.com',
              bandSession: 'DRUM',
              status: 'APPROVED',
              createdAt: '2024-12-07T19:00:00',
              introduction: '인디 음악을 즐기는 드러머입니다.',
              userProfileImagePath: '/images/ic_default_profile.svg',
            },
            {
              participantId: 43,
              userId: 5,
              userNickname: '어쿠스틱맨',
              userEmail: 'acoustic@example.com',
              bandSession: 'ACOUSTIC_GUITAR',
              status: 'APPROVED',
              createdAt: '2024-12-07T19:00:00',
              introduction: '어쿠스틱 기타를 연주하는 뮤지션입니다.',
              userProfileImagePath: '/images/ic_default_profile.svg',
            },
          ];
        }
      } else {
        console.log('MSW: 일반 모임 처리 (상대 경로)', id);
        const mockNicknames = [
          '보컬리스트',
          '드러머',
          '기타리스트',
          '베이시스트',
          '키보디스트',
          '재즈맨',
          '팝스타',
          '인디러버',
          '락스타',
          '재즈마스터',
        ];
        const mockSessions: BandSessionType[] = [
          'VOCAL',
          'DRUM',
          'ELECTRIC_GUITAR',
          'BASS',
          'KEYBOARD',
        ];

        const participantCount = (id % 5) + 1; // 1~5명

        participants = Array.from({ length: participantCount }, (_, index) => ({
          participantId: id * 100 + index + 1,
          userId: id * 10 + index + 1,
          userNickname: mockNicknames[(id + index) % mockNicknames.length],
          userEmail: `user${id * 10 + index + 1}@test.com`,
          bandSession: mockSessions[index % mockSessions.length],
          status:
            index === 0 ? 'APPROVED' : index % 2 === 0 ? 'PENDING' : 'APPROVED',
          createdAt: `2024-12-${1 + (index % 10)}T${10 + index}:00:00`,
          introduction: `${mockNicknames[(id + index) % mockNicknames.length]}입니다. 즐거운 음악을 만들어가고 싶습니다.`,
          userProfileImagePath: '/images/ic_default_profile.svg',
        }));
      }
    }

    console.log('MSW: 최종 참가자 데이터 반환 (상대 경로)', {
      participants,
      total: participants.length,
    });
    return HttpResponse.json({
      participants,
      total: participants.length,
    });
  }),

  // 모임 참가 신청
  http.post('*/gatherings/:id/participants', async ({ request, params }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token.includes('mock')) {
      return new HttpResponse(null, { status: 401 });
    }

    const body = (await request.json()) as {
      bandSession: string;
      introduction: string;
    };
    const { bandSession, introduction } = body;

    if (!bandSession || !introduction) {
      return new HttpResponse(null, { status: 400 });
    }

    return HttpResponse.json({
      gatheringId: parseInt(params.id as string),
      userId: 1, // 현재 로그인한 사용자 ID
      bandSession,
      status: 'PENDING',
      message: '참가 신청이 완료되었습니다.',
      completed: false,
      canceled: false,
      approved: false,
      rejected: false,
      pending: true,
    });
  }),

  // 모임 참가 신청 (상대 경로)
  http.post('/gatherings/:id/participants', async ({ request, params }) => {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token.includes('mock')) {
      return new HttpResponse(null, { status: 401 });
    }

    const body = (await request.json()) as {
      bandSession: string;
      introduction: string;
    };
    const { bandSession, introduction } = body;

    if (!bandSession || !introduction) {
      return new HttpResponse(null, { status: 400 });
    }

    return HttpResponse.json({
      gatheringId: parseInt(params.id as string),
      userId: 1, // 현재 로그인한 사용자 ID
      bandSession,
      status: 'PENDING',
      message: '참가 신청이 완료되었습니다.',
      completed: false,
      canceled: false,
      approved: false,
      rejected: false,
      pending: true,
    });
  }),

  // 참가 승인 (상대 경로)
  http.post(
    '/gatherings/:id/participants/:participantId/approve',
    async ({ request, params }) => {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new HttpResponse(null, { status: 401 });
      }

      const token = authHeader.replace('Bearer ', '');
      if (!token.includes('mock')) {
        return new HttpResponse(null, { status: 401 });
      }

      const gatheringId = parseInt(params.id as string);
      const participantId = parseInt(params.participantId as string);

      // 모임 생성자만 승인할 수 있도록 체크 (현재 로그인한 사용자가 모임 생성자인지)
      const gatheringDetail = MOCK_GATHERING_DETAILS[gatheringId];
      if (!gatheringDetail || gatheringDetail.creator.id !== 1) {
        return new HttpResponse(null, { status: 403 });
      }

      // 참가자 정보 찾기
      const participants = MOCK_PARTICIPANTS[gatheringId];
      const participant = participants?.find(
        (p: Participant) => p.participantId === participantId,
      );

      if (!participant) {
        return new HttpResponse(null, { status: 404 });
      }

      if (participant.status !== 'PENDING') {
        return new HttpResponse(null, {
          status: 400,
          statusText: '이미 처리된 참가 신청입니다.',
        });
      }

      // 상태 업데이트 (실제로는 DB 업데이트)
      participant.status = 'APPROVED';

      return HttpResponse.json({
        message: '참가 신청이 승인되었습니다.',
        participantId,
        status: 'APPROVED',
      });
    },
  ),

  // 참가 거절 (상대 경로)
  http.put(
    '/gatherings/:id/participants/:participantId/reject',
    async ({ request, params }) => {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new HttpResponse(null, { status: 401 });
      }

      const token = authHeader.replace('Bearer ', '');
      if (!token.includes('mock')) {
        return new HttpResponse(null, { status: 401 });
      }

      const gatheringId = parseInt(params.id as string);
      const participantId = parseInt(params.participantId as string);

      // 모임 생성자만 거절할 수 있도록 체크
      const gatheringDetail = MOCK_GATHERING_DETAILS[gatheringId];
      if (!gatheringDetail || gatheringDetail.creator.id !== 1) {
        return new HttpResponse(null, { status: 403 });
      }

      // 참가자 정보 찾기
      const participants = MOCK_PARTICIPANTS[gatheringId];
      const participant = participants?.find(
        (p: Participant) => p.participantId === participantId,
      );

      if (!participant) {
        return new HttpResponse(null, { status: 404 });
      }

      if (participant.status !== 'PENDING') {
        return new HttpResponse(null, {
          status: 400,
          statusText: '이미 처리된 참가 신청입니다.',
        });
      }

      // 상태 업데이트
      participant.status = 'REJECTED';

      return HttpResponse.json({
        message: '참가 신청이 거절되었습니다.',
        participantId,
        status: 'REJECTED',
      });
    },
  ),

  // 참가 취소 (상대 경로)
  http.put(
    '/gatherings/:id/participants/:participantId/cancel',
    async ({ request, params }) => {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new HttpResponse(null, { status: 401 });
      }

      const token = authHeader.replace('Bearer ', '');
      if (!token.includes('mock')) {
        return new HttpResponse(null, { status: 401 });
      }

      const gatheringId = parseInt(params.id as string);
      const participantId = parseInt(params.participantId as string);

      // 참가자 정보 찾기
      const participants = MOCK_PARTICIPANTS[gatheringId];
      const participant = participants?.find(
        (p: Participant) => p.participantId === participantId,
      );

      if (!participant) {
        return new HttpResponse(null, { status: 404 });
      }

      // 본인만 취소할 수 있거나, 모임 생성자가 취소할 수 있음
      const gatheringDetail = MOCK_GATHERING_DETAILS[gatheringId];
      const isCreator = gatheringDetail?.creator.id === 1;
      const isParticipant = participant.userId === 1;

      if (!isCreator && !isParticipant) {
        return new HttpResponse(null, { status: 403 });
      }

      if (participant.status === 'CANCELED') {
        return new HttpResponse(null, {
          status: 400,
          statusText: '이미 취소된 참가 신청입니다.',
        });
      }

      // 상태 업데이트
      participant.status = 'CANCELED';

      return HttpResponse.json({
        message: '참가 신청이 취소되었습니다.',
        participantId,
        status: 'CANCELED',
      });
    },
  ),

  // 모임 목록 조회 (인증 불필요)
  http.get('*/gatherings', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '8');
    const sort = url.searchParams.get('sort') || 'recruitDeadline,asc';
    const genres = url.searchParams.getAll('genres');
    const sessions = url.searchParams.getAll('sessions');

    // 필터링 로직 (실제로는 더 복잡할 수 있음)
    let filteredGatherings = MOCK_GATHERINGS;

    if (genres.length > 0) {
      filteredGatherings = filteredGatherings.filter((gathering) =>
        gathering.genres.some((genre) => genres.includes(genre)),
      );
    }

    if (sessions.length > 0) {
      filteredGatherings = filteredGatherings.filter((gathering) =>
        gathering.sessions.some((session) =>
          sessions.includes(session.bandSession),
        ),
      );
    }

    // 정렬 로직
    if (sort === 'recruitDeadline,asc') {
      filteredGatherings.sort(
        (a, b) =>
          new Date(a.recruitDeadline).getTime() -
          new Date(b.recruitDeadline).getTime(),
      );
    } else if (sort === 'recruitDeadline,desc') {
      filteredGatherings.sort(
        (a, b) =>
          new Date(b.recruitDeadline).getTime() -
          new Date(a.recruitDeadline).getTime(),
      );
    }

    // 페이지네이션
    const totalElements = filteredGatherings.length;
    const totalPage = Math.ceil(totalElements / size);
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedGatherings = filteredGatherings.slice(startIndex, endIndex);

    const response: RecruitResponse = {
      gatherings: paginatedGatherings,
      currentPage: page,
      totalPage,
      totalElements,
    };

    return HttpResponse.json(response);
  }),

  // 모임 목록 조회 (상대 경로, 인증 불필요)
  http.get('/gatherings', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '0');
    const size = parseInt(url.searchParams.get('size') || '8');
    const sort = url.searchParams.get('sort') || 'recruitDeadline,asc';
    const genres = url.searchParams.getAll('genres');
    const sessions = url.searchParams.getAll('sessions');

    // 필터링 로직 (실제로는 더 복잡할 수 있음)
    let filteredGatherings = MOCK_GATHERINGS;

    if (genres.length > 0) {
      filteredGatherings = filteredGatherings.filter((gathering) =>
        gathering.genres.some((genre) => genres.includes(genre)),
      );
    }

    if (sessions.length > 0) {
      filteredGatherings = filteredGatherings.filter((gathering) =>
        gathering.sessions.some((session) =>
          sessions.includes(session.bandSession),
        ),
      );
    }

    // 정렬 로직
    if (sort === 'recruitDeadline,asc') {
      filteredGatherings.sort(
        (a, b) =>
          new Date(a.recruitDeadline).getTime() -
          new Date(b.recruitDeadline).getTime(),
      );
    } else if (sort === 'recruitDeadline,desc') {
      filteredGatherings.sort(
        (a, b) =>
          new Date(b.recruitDeadline).getTime() -
          new Date(a.recruitDeadline).getTime(),
      );
    }

    // 페이지네이션
    const totalElements = filteredGatherings.length;
    const totalPage = Math.ceil(totalElements / size);
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedGatherings = filteredGatherings.slice(startIndex, endIndex);

    const response: RecruitResponse = {
      gatherings: paginatedGatherings,
      currentPage: page,
      totalElements,
      totalPage,
    };

    return HttpResponse.json(response);
  }),

  // 모임 생성
  http.post('*/gatherings', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    // 인증 토큰 확인
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(null, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token.includes('mock')) {
      return new HttpResponse(null, { status: 401 });
    }

    const body = (await request.json()) as RegisterGatheringsRequest;

    // 필수 필드 검증
    if (
      !body?.name ||
      !body?.place ||
      !body?.gatheringDateTime ||
      !body?.recruitDateTime
    ) {
      return new HttpResponse(null, { status: 400 });
    }

    // 동적으로 ID 생성 (실제로는 서버에서 생성)
    const newId = Math.floor(Math.random() * 1000) + 1000;

    return HttpResponse.json({
      success: true,
      result: {
        ...MOCK_REGISTER_RESPONSE,
        id: newId,
        name: body.name,
        gatheringDateTime: body.gatheringDateTime,
        recruitDeadline: body.recruitDateTime,
      },
    });
  }),

  // 모임 수정
  http.put('*/gatherings/:id', async ({ request, params }) => {
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
    const body = (await request.json()) as ModifiedGatheringsRequest;

    // 필수 필드 검증
    if (
      !body?.name ||
      !body?.place ||
      !body?.gatheringDateTime ||
      !body?.recruitDeadline
    ) {
      return new HttpResponse(null, { status: 400 });
    }

    // 모임 존재 여부 확인 (실제로는 DB에서 확인)
    const gatheringExists = MOCK_GATHERINGS.some(
      (g) => g.id === parseInt(id as string),
    );
    if (!gatheringExists) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json({
      success: true,
      result: {
        ...MOCK_MODIFIED_RESPONSE,
        id: parseInt(id as string),
        name: body.name,
        place: body.place,
        description: body.description,
        gatheringDateTime: body.gatheringDateTime,
        recruitDeadline: body.recruitDeadline,
        genres: body.genres,
        sessions:
          body.gatheringSessions?.map((session) => ({
            ...session,
            currentCount: 0, // 수정 시에는 현재 참가자 수를 0으로 초기화
          })) || [],
      },
    });
  }),

  // 내가 생성한 모임 목록
  http.get('*/gatherings/my/created', ({ request }) => {
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
    const includeCanceled = url.searchParams.get('includeCanceled') === 'true';

    // 페이지네이션
    const totalElements = MOCK_MY_CREATED_GATHERINGS.length;
    const totalPage = Math.ceil(totalElements / size);
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedGatherings = MOCK_MY_CREATED_GATHERINGS.slice(
      startIndex,
      endIndex,
    );

    // 취소된 모임 필터링
    const filteredGatherings = includeCanceled
      ? paginatedGatherings
      : paginatedGatherings.filter((g) => g.status !== 'CANCELED');

    const response: RecruitResponse = {
      gatherings: filteredGatherings,
      currentPage: page,
      totalPage,
      totalElements: filteredGatherings.length,
    };

    return HttpResponse.json(response);
  }),

  // 내가 참가한 모임 목록 (작성 가능한 리뷰용)
  http.get('*/gatherings/:gatheringId/participants/my', ({ request }) => {
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
    const includeCanceled = url.searchParams.get('includeCanceled') === 'true';

    // includeCanceled 파라미터에 따라 필터링
    let filteredGatherings = MOCK_MY_ALL_PARTICIPATED_GATHERINGS;
    if (!includeCanceled) {
      filteredGatherings = filteredGatherings.filter(
        (g) => g.status !== 'CANCELED',
      );
    }

    // 페이지네이션 적용
    const totalElements = filteredGatherings.length;
    const totalPage = Math.ceil(totalElements / size);
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedGatherings = filteredGatherings.slice(startIndex, endIndex);

    return HttpResponse.json({
      gatherings: paginatedGatherings,
      currentPage: page,
      totalPage,
      totalElements,
    });
  }),

  // 내가 참가한 모임 목록 (기존 - 단순 참가 모임만)
  http.get('*/gatherings/my/participated', ({ request }) => {
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
    const includeCanceled = url.searchParams.get('includeCanceled') === 'true';

    // 페이지네이션
    const totalElements = MOCK_MY_PARTICIPATED_GATHERINGS.length;
    const totalPage = Math.ceil(totalElements / size);
    const startIndex = page * size;
    const endIndex = startIndex + size;
    const paginatedGatherings = MOCK_MY_PARTICIPATED_GATHERINGS.slice(
      startIndex,
      endIndex,
    );

    // 취소된 모임 필터링
    const filteredGatherings = includeCanceled
      ? paginatedGatherings
      : paginatedGatherings.filter((g) => g.status !== 'CANCELED');

    const response: RecruitResponse = {
      gatherings: filteredGatherings,
      currentPage: page,
      totalPage,
      totalElements: filteredGatherings.length,
    };

    return HttpResponse.json(response);
  }),

  // 내가 참가한 완료된 모임 목록
  http.get(
    '*/gatherings/:gatheringId/participants/my/completed',
    ({ request }) => {
      const authHeader = request.headers.get('Authorization');

      // 인증 토큰 확인
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return new HttpResponse(null, { status: 401 });
      }

      const token = authHeader.replace('Bearer ', '');
      if (!token.includes('mock')) {
        return new HttpResponse(null, { status: 401 });
      }

      // 완료된 모임만 필터링하고 GetGetherItem 형식으로 변환
      const completedGatherings = MOCK_MY_COMPLETED_GATHERINGS.filter(
        (g) => g.status === 'COMPLETED',
      ).map((g) => ({
        id: g.id,
        name: g.name,
        thumbnail: g.thumbnail,
        gatheringDateTime: g.gatheringDateTime,
        place: g.place,
        totalRecruit: g.totalRecruit,
        totalCurrent: g.totalCurrent,
        status: g.status,
        hostNickname: g.creator.nickname,
      }));

      return HttpResponse.json(completedGatherings);
    },
  ),

  // 모임 삭제
  http.delete('*/gatherings/:id', ({ request, params }) => {
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

    // 모임 존재 여부 확인
    const gatheringExists = MOCK_GATHERINGS.some(
      (g) => g.id === parseInt(id as string),
    );
    if (!gatheringExists) {
      return new HttpResponse(null, { status: 404 });
    }

    // 삭제 성공 (실제로는 DB에서 삭제)
    return new HttpResponse(null, { status: 204 });
  }),
];

import { GatheringCard } from '../../types/card';
import { GenreType, BandSessionType } from '../../types/tags';
import {
  RegisterGatheringsResponse,
  ModifiedGatheringsResponse,
} from '../../types/gather';
import { GatheringDetailResponse, Participant } from '../../types/gathering';

// 기본 모임 데이터 템플릿 (ID 1~10: 테스트유저가 생성한 모임들)
const baseGatherings: GatheringCard[] = [
  {
    id: 1,
    name: '락 밴드 모집합니다',
    place: '서울 강남구',
    thumbnail: '/images/card/img_card_pc_01.avif',
    gatheringDateTime: '2024-12-25T19:00:00',
    totalRecruit: 5,
    totalCurrent: 3,
    viewCount: 150,
    recruitDeadline: '2024-12-20T23:59:59',
    status: 'RECRUITING',
    genres: ['ROCK', 'METAL'],
    creator: {
      id: 1,
      nickname: '테스트유저',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 1, currentCount: 1 },
      { bandSession: 'ELECTRIC_GUITAR', recruitCount: 2, currentCount: 1 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 0 },
    ],
  },
  {
    id: 2,
    name: '재즈 세션 모집',
    place: '서울 홍대',
    thumbnail: '/images/card/img_card_pc_02.avif',
    gatheringDateTime: '2024-12-30T20:00:00',
    totalRecruit: 4,
    totalCurrent: 2,
    viewCount: 89,
    recruitDeadline: '2024-12-25T23:59:59',
    status: 'RECRUITING',
    genres: ['JAZZ', 'ACOUSTIC'],
    creator: {
      id: 1,
      nickname: '테스트유저',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 1, currentCount: 0 },
      { bandSession: 'ACOUSTIC_GUITAR', recruitCount: 1, currentCount: 1 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 0 },
    ],
  },
  {
    id: 3,
    name: '팝 밴드 모집',
    place: '서울 이태원',
    thumbnail: '/images/card/img_card_pc_03.avif',
    gatheringDateTime: '2024-12-28T18:00:00',
    totalRecruit: 6,
    totalCurrent: 4,
    viewCount: 234,
    recruitDeadline: '2024-12-22T23:59:59',
    status: 'RECRUITING',
    genres: ['POP', 'BALLAD'],
    creator: {
      id: 1,
      nickname: '테스트유저',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 2, currentCount: 1 },
      { bandSession: 'ELECTRIC_GUITAR', recruitCount: 1, currentCount: 1 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 0 },
      { bandSession: 'KEYBOARD', recruitCount: 1, currentCount: 1 },
    ],
  },
  {
    id: 4,
    name: '인디 밴드 모집',
    place: '서울 홍대',
    thumbnail: '/images/card/img_card_pc_04.avif',
    gatheringDateTime: '2024-12-31T20:00:00',
    totalRecruit: 4,
    totalCurrent: 3,
    viewCount: 67,
    recruitDeadline: '2024-12-29T23:59:59',
    status: 'RECRUITING',
    genres: ['INDIE', 'ALTERNATIVE'],
    creator: {
      id: 1,
      nickname: '테스트유저',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 1, currentCount: 1 },
      { bandSession: 'ELECTRIC_GUITAR', recruitCount: 1, currentCount: 1 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 0 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 1 },
    ],
  },
  {
    id: 5,
    name: '재즈 트리오',
    place: '서울 이태원',
    thumbnail: '/images/card/img_card_pc_05.avif',
    gatheringDateTime: '2024-12-28T20:30:00',
    totalRecruit: 3,
    totalCurrent: 3,
    viewCount: 112,
    recruitDeadline: '2024-12-25T23:59:59',
    status: 'CONFIRMED',
    genres: ['JAZZ'],
    creator: {
      id: 1,
      nickname: '테스트유저',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 1, currentCount: 1 },
      { bandSession: 'ACOUSTIC_GUITAR', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 1 },
    ],
  },
  {
    id: 6,
    name: '메탈 밴드',
    place: '서울 강남구',
    thumbnail: '/images/card/img_card_pc_06.avif',
    gatheringDateTime: '2024-12-27T19:00:00',
    totalRecruit: 5,
    totalCurrent: 2,
    viewCount: 78,
    recruitDeadline: '2024-12-22T23:59:59',
    status: 'RECRUITING',
    genres: ['METAL', 'ROCK'],
    creator: {
      id: 1,
      nickname: '테스트유저',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 1, currentCount: 1 },
      { bandSession: 'ELECTRIC_GUITAR', recruitCount: 2, currentCount: 0 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 0 },
    ],
  },
  {
    id: 7,
    name: '클래식 앙상블',
    place: '서울 종로구',
    thumbnail: '/images/card/img_card_pc_07.avif',
    gatheringDateTime: '2024-12-29T18:00:00',
    totalRecruit: 4,
    totalCurrent: 4,
    viewCount: 95,
    recruitDeadline: '2024-12-24T23:59:59',
    status: 'CONFIRMED',
    genres: ['ACOUSTIC', 'FOLK'],
    creator: {
      id: 1,
      nickname: '테스트유저',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 1, currentCount: 1 },
      { bandSession: 'STRING_INSTRUMENT', recruitCount: 2, currentCount: 2 },
      { bandSession: 'PERCUSSION', recruitCount: 1, currentCount: 1 },
    ],
  },
  {
    id: 8,
    name: 'RNB 밴드',
    place: '서울 마포구',
    thumbnail: '/images/card/img_card_pc_08.avif',
    gatheringDateTime: '2024-12-26T20:00:00',
    totalRecruit: 5,
    totalCurrent: 1,
    viewCount: 45,
    recruitDeadline: '2024-12-23T23:59:59',
    status: 'RECRUITING',
    genres: ['RNB'],
    creator: {
      id: 1,
      nickname: '테스트유저',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 1, currentCount: 0 },
      { bandSession: 'ELECTRIC_GUITAR', recruitCount: 1, currentCount: 0 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 0 },
      { bandSession: 'KEYBOARD', recruitCount: 1, currentCount: 0 },
    ],
  },
  {
    id: 9,
    name: '펑크 밴드',
    place: '서울 용산구',
    thumbnail: '/images/card/img_card_pc_09.avif',
    gatheringDateTime: '2024-12-24T19:30:00',
    totalRecruit: 4,
    totalCurrent: 3,
    viewCount: 123,
    recruitDeadline: '2024-12-19T23:59:59',
    status: 'RECRUITING',
    genres: ['PUNK', 'ROCK'],
    creator: {
      id: 1,
      nickname: '테스트유저',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 1, currentCount: 1 },
      { bandSession: 'ELECTRIC_GUITAR', recruitCount: 1, currentCount: 1 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 0 },
    ],
  },
  {
    id: 10,
    name: '어쿠스틱 포크 세션',
    place: '서울 종로구',
    thumbnail: '/images/card/img_card_pc_10.avif',
    gatheringDateTime: '2024-12-29T18:00:00',
    totalRecruit: 4,
    totalCurrent: 4,
    viewCount: 95,
    recruitDeadline: '2024-12-24T23:59:59',
    status: 'CONFIRMED',
    genres: ['ACOUSTIC', 'FOLK'],
    creator: {
      id: 1,
      nickname: '테스트유저',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 1, currentCount: 1 },
      { bandSession: 'ACOUSTIC_GUITAR', recruitCount: 2, currentCount: 2 },
      { bandSession: 'PERCUSSION', recruitCount: 1, currentCount: 1 },
    ],
  },
];

// 추가 데이터 생성 함수
const generateAdditionalGatherings = (): GatheringCard[] => {
  const additionalGatherings: GatheringCard[] = [];
  const places = [
    '서울 강남구',
    '서울 홍대',
    '서울 이태원',
    '서울 종로구',
    '서울 마포구',
    '서울 용산구',
  ];
  const genres: GenreType[] = [
    'ROCK',
    'METAL',
    'POP',
    'BALLAD',
    'INDIE',
    'ALTERNATIVE',
    'JAZZ',
    'PUNK',
    'ACOUSTIC',
    'FOLK',
    'RNB',
  ];
  const statuses = ['RECRUITING', 'CONFIRMED', 'COMPLETED'] as const;
  const bandSessions: BandSessionType[] = [
    'VOCAL',
    'ELECTRIC_GUITAR',
    'DRUM',
    'ACOUSTIC_GUITAR',
    'BASS',
    'STRING_INSTRUMENT',
    'PERCUSSION',
    'KEYBOARD',
  ];
  const thumbnails = [
    '/images/card/img_card_pc_01.avif',
    '/images/card/img_card_pc_02.avif',
    '/images/card/img_card_pc_03.avif',
    '/images/card/img_card_pc_04.avif',
    '/images/card/img_card_pc_05.avif',
    '/images/card/img_card_pc_06.avif',
    '/images/card/img_card_pc_07.avif',
    '/images/card/img_card_pc_08.avif',
    '/images/card/img_card_pc_09.avif',
    '/images/card/img_card_pc_10.avif',
  ];

  for (let i = 11; i <= 300; i++) {
    const randomGenre1 = genres[Math.floor(Math.random() * genres.length)];
    const randomGenre2 = genres[Math.floor(Math.random() * genres.length)];
    const uniqueGenres =
      randomGenre1 === randomGenre2
        ? [randomGenre1]
        : [randomGenre1, randomGenre2];

    const totalRecruit = Math.floor(Math.random() * 6) + 3; // 3-8명
    const totalCurrent = Math.floor(Math.random() * (totalRecruit + 1)); // 0-totalRecruit명
    const viewCount = Math.floor(Math.random() * 300) + 50; // 50-350
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const randomPlace = places[Math.floor(Math.random() * places.length)];
    const randomThumbnail =
      thumbnails[Math.floor(Math.random() * thumbnails.length)];

    // 세션 생성
    const sessions = [];
    const sessionTypes = [...bandSessions];
    const sessionCount = Math.floor(Math.random() * 4) + 2; // 2-5개 세션

    for (let j = 0; j < sessionCount; j++) {
      const sessionType =
        sessionTypes[Math.floor(Math.random() * sessionTypes.length)];
      const recruitCount = Math.floor(Math.random() * 2) + 1; // 1-2명
      const currentCount = Math.floor(Math.random() * (recruitCount + 1)); // 0-recruitCount명

      sessions.push({
        bandSession: sessionType,
        recruitCount,
        currentCount,
      });

      // 중복 제거
      const index = sessionTypes.indexOf(sessionType);
      if (index > -1) {
        sessionTypes.splice(index, 1);
      }
    }

    additionalGatherings.push({
      id: i,
      name: `모임 ${i}`,
      place: randomPlace,
      thumbnail: randomThumbnail,
      gatheringDateTime: `2024-12-${25 + (i % 7)}T${19 + (i % 3)}:00:00`,
      totalRecruit,
      totalCurrent,
      viewCount,
      recruitDeadline: `2024-12-${20 + (i % 5)}T23:59:59`,
      status,
      genres: uniqueGenres,
      creator: {
        // ID 1~10: 테스트유저가 생성한 모임들 (baseGatherings)
        // ID 11~60: 테스트유저가 생성한 모임들
        // ID 61~110: 유저2가 생성한 모임들
        // ID 111~160: 유저3이 생성한 모임들
        // ID 161~210: 유저4가 생성한 모임들
        // ID 211~260: 유저5가 생성한 모임들
        // ID 261~310: 유저6이 생성한 모임들
        id: Math.floor((i - 11) / 50) + 1,
        nickname:
          Math.floor((i - 11) / 50) === 0
            ? '테스트유저'
            : `유저${Math.floor((i - 11) / 50) + 1}`,
      },
      sessions,
    });
  }

  return additionalGatherings;
};

// 300개의 모임 데이터 생성
export const MOCK_GATHERINGS: GatheringCard[] = [
  ...baseGatherings,
  ...generateAdditionalGatherings(),
];

// 내가 생성한 모임 목록 (ID 1~10: 테스트유저가 생성한 모임들)
export const MOCK_MY_CREATED_GATHERINGS: GatheringCard[] = [...baseGatherings];

// 내가 참가한 모임 목록 (다른 사람이 만든 모임에 참가)
export const MOCK_MY_PARTICIPATED_GATHERINGS: GatheringCard[] = [
  {
    id: 61,
    name: '재즈 세션 모집',
    place: '서울 이태원',
    thumbnail: '/images/card/img_card_pc_03.avif',
    gatheringDateTime: '2024-12-28T18:00:00',
    totalRecruit: 6,
    totalCurrent: 5,
    viewCount: 234,
    recruitDeadline: '2024-12-22T23:59:59',
    status: 'RECRUITING',
    genres: ['POP', 'BALLAD'],
    creator: {
      id: 2,
      nickname: '유저2',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 2, currentCount: 2 },
      { bandSession: 'ELECTRIC_GUITAR', recruitCount: 1, currentCount: 1 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 0 },
      { bandSession: 'KEYBOARD', recruitCount: 1, currentCount: 1 },
    ],
  },
  {
    id: 111,
    name: '유저3이 만든 인디 밴드',
    place: '서울 홍대',
    thumbnail: '/images/card/img_card_pc_04.avif',
    gatheringDateTime: '2024-12-31T20:00:00',
    totalRecruit: 4,
    totalCurrent: 3,
    viewCount: 67,
    recruitDeadline: '2024-12-29T23:59:59',
    status: 'RECRUITING',
    genres: ['INDIE', 'ALTERNATIVE'],
    creator: {
      id: 3,
      nickname: '유저3',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 1, currentCount: 1 },
      { bandSession: 'ELECTRIC_GUITAR', recruitCount: 1, currentCount: 1 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 0 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 1 },
    ],
  },
];

// 내가 참가한 모든 모임 목록 (작성 가능한 리뷰용 - 완료된 모임 포함)
export const MOCK_MY_ALL_PARTICIPATED_GATHERINGS: GatheringCard[] = [
  // 진행 중인 모임들
  {
    id: 61,
    name: '유저2가 만든 팝 밴드',
    place: '서울 이태원',
    thumbnail: '/images/card/img_card_pc_03.avif',
    gatheringDateTime: '2024-12-28T18:00:00',
    totalRecruit: 6,
    totalCurrent: 5,
    viewCount: 234,
    recruitDeadline: '2024-12-22T23:59:59',
    status: 'RECRUITING',
    genres: ['POP', 'BALLAD'],
    creator: {
      id: 2,
      nickname: '유저2',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 2, currentCount: 2 },
      { bandSession: 'ELECTRIC_GUITAR', recruitCount: 1, currentCount: 1 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 0 },
      { bandSession: 'KEYBOARD', recruitCount: 1, currentCount: 1 },
    ],
  },
  {
    id: 111,
    name: '유저3이 만든 인디 밴드',
    place: '서울 홍대',
    thumbnail: '/images/card/img_card_pc_04.avif',
    gatheringDateTime: '2024-12-31T20:00:00',
    totalRecruit: 4,
    totalCurrent: 3,
    viewCount: 67,
    recruitDeadline: '2024-12-29T23:59:59',
    status: 'RECRUITING',
    genres: ['INDIE', 'ALTERNATIVE'],
    creator: {
      id: 3,
      nickname: '유저3',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 1, currentCount: 1 },
      { bandSession: 'ELECTRIC_GUITAR', recruitCount: 1, currentCount: 1 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 0 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 1 },
    ],
  },
  // 완료된 모임들 (테스트유저가 주최한 모임들)
  {
    id: 1,
    name: '락 밴드 모집합니다',
    place: '서울 강남',
    thumbnail: '/images/card/img_card_pc_01.avif',
    gatheringDateTime: '2024-12-15T19:00:00',
    totalRecruit: 5,
    totalCurrent: 5,
    viewCount: 156,
    recruitDeadline: '2024-12-10T23:59:59',
    status: 'COMPLETED',
    genres: ['ROCK', 'METAL'],
    creator: {
      id: 1,
      nickname: '테스트유저',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 1, currentCount: 1 },
      { bandSession: 'ELECTRIC_GUITAR', recruitCount: 2, currentCount: 2 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 1 },
    ],
  },
  {
    id: 2,
    name: '재즈 세션 모집',
    place: '서울 홍대',
    thumbnail: '/images/card/img_card_pc_02.avif',
    gatheringDateTime: '2024-12-10T20:00:00',
    totalRecruit: 4,
    totalCurrent: 4,
    viewCount: 89,
    recruitDeadline: '2024-12-05T23:59:59',
    status: 'COMPLETED',
    genres: ['JAZZ'],
    creator: {
      id: 1,
      nickname: '테스트유저',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 1, currentCount: 1 },
      { bandSession: 'ACOUSTIC_GUITAR', recruitCount: 1, currentCount: 1 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 1 },
    ],
  },
  {
    id: 3,
    name: '팝 밴드 모집',
    place: '서울 종로구',
    thumbnail: '/images/card/img_card_pc_03.avif',
    gatheringDateTime: '2024-12-05T18:00:00',
    totalRecruit: 6,
    totalCurrent: 6,
    viewCount: 234,
    recruitDeadline: '2024-11-30T23:59:59',
    status: 'COMPLETED',
    genres: ['POP', 'ROCK'],
    creator: {
      id: 1,
      nickname: '테스트유저',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 2, currentCount: 2 },
      { bandSession: 'ELECTRIC_GUITAR', recruitCount: 1, currentCount: 1 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 1 },
      { bandSession: 'KEYBOARD', recruitCount: 1, currentCount: 1 },
    ],
  },
  {
    id: 4,
    name: '인디 밴드 모집',
    place: '서울 마포구',
    thumbnail: '/images/card/img_card_pc_04.avif',
    gatheringDateTime: '2024-12-12T19:00:00',
    totalRecruit: 4,
    totalCurrent: 4,
    viewCount: 123,
    recruitDeadline: '2024-12-07T23:59:59',
    status: 'COMPLETED',
    genres: ['INDIE', 'ROCK'],
    creator: {
      id: 1,
      nickname: '테스트유저',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 1, currentCount: 1 },
      { bandSession: 'ELECTRIC_GUITAR', recruitCount: 1, currentCount: 1 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 1 },
    ],
  },
  // 다른 유저들이 만든 완료된 모임들
  {
    id: 501,
    name: '유저4가 만든 락 밴드',
    place: '서울 강남구',
    thumbnail: '/images/card/img_card_pc_05.avif',
    gatheringDateTime: '2024-12-15T19:00:00',
    totalRecruit: 5,
    totalCurrent: 5,
    viewCount: 156,
    recruitDeadline: '2024-12-10T23:59:59',
    status: 'COMPLETED',
    genres: ['ROCK', 'METAL'],
    creator: {
      id: 4,
      nickname: '유저4',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 1, currentCount: 1 },
      { bandSession: 'ELECTRIC_GUITAR', recruitCount: 2, currentCount: 2 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 1 },
    ],
  },
  {
    id: 502,
    name: '유저5가 만든 재즈 세션',
    place: '서울 이태원',
    thumbnail: '/images/card/img_card_pc_06.avif',
    gatheringDateTime: '2024-12-10T20:00:00',
    totalRecruit: 4,
    totalCurrent: 4,
    viewCount: 89,
    recruitDeadline: '2024-12-05T23:59:59',
    status: 'COMPLETED',
    genres: ['JAZZ'],
    creator: {
      id: 5,
      nickname: '유저5',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 1, currentCount: 1 },
      { bandSession: 'ACOUSTIC_GUITAR', recruitCount: 1, currentCount: 1 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 1 },
    ],
  },
  {
    id: 503,
    name: '유저6이 만든 인디 밴드',
    place: '서울 홍대',
    thumbnail: '/images/card/img_card_pc_07.avif',
    gatheringDateTime: '2024-12-05T18:00:00',
    totalRecruit: 6,
    totalCurrent: 6,
    viewCount: 234,
    recruitDeadline: '2024-11-30T23:59:59',
    status: 'COMPLETED',
    genres: ['INDIE', 'ALTERNATIVE'],
    creator: {
      id: 6,
      nickname: '유저6',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 2, currentCount: 2 },
      { bandSession: 'ELECTRIC_GUITAR', recruitCount: 1, currentCount: 1 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 1 },
      { bandSession: 'KEYBOARD', recruitCount: 1, currentCount: 1 },
    ],
  },
  // 취소된 모임들 (includeCanceled: true일 때 포함)
  {
    id: 401,
    name: '취소된 팝 밴드',
    place: '서울 강남구',
    thumbnail: '/images/card/img_card_pc_08.avif',
    gatheringDateTime: '2024-12-20T19:00:00',
    totalRecruit: 4,
    totalCurrent: 2,
    viewCount: 45,
    recruitDeadline: '2024-12-15T23:59:59',
    status: 'CANCELED',
    genres: ['POP'],
    creator: {
      id: 7,
      nickname: '유저7',
    },
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 1, currentCount: 1 },
      { bandSession: 'ELECTRIC_GUITAR', recruitCount: 1, currentCount: 0 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 0 },
    ],
  },
];

// 내가 참가한 완료된 모임 목록 (테스트용) - MOCK_MY_ALL_PARTICIPATED_GATHERINGS에 통합됨
export const MOCK_MY_COMPLETED_GATHERINGS: GatheringCard[] = [];

// 모임 상세 목데이터
export const MOCK_GATHERING_DETAILS: Record<number, GatheringDetailResponse> = {
  1: {
    id: 1,
    name: '락 밴드 모집합니다',
    thumbnail: '/images/card/img_card_pc_01.avif',
    place: '서울 강남구',
    description:
      '락 음악을 좋아하는 분들과 함께하는 밴드 모임입니다. 다양한 장르의 락 음악을 연주하고 즐기며, 새로운 음악적 경험을 만들어가고 싶습니다.',
    gatheringDateTime: '2024-12-25T19:00:00',
    recruitDeadline: '2024-12-20T23:59:59',
    status: 'COMPLETED',
    genres: ['ROCK', 'METAL'],
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 1, currentCount: 1 },
      { bandSession: 'ELECTRIC_GUITAR', recruitCount: 2, currentCount: 1 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 0 },
      { bandSession: 'KEYBOARD', recruitCount: 1, currentCount: 0 },
    ],
    creator: {
      id: 1,
      nickname: '테스트유저',
      profileImagePath: '/images/ic_default_profile.svg',
    },
  },
  2: {
    id: 2,
    name: '재즈 세션 모임',
    thumbnail: '/images/card/img_card_pc_02.avif',
    place: '서울 홍대',
    description:
      '재즈 음악을 사랑하는 분들과 함께하는 세션입니다. 자유로운 즉흥 연주와 함께 재즈의 매력을 느껴보세요.',
    gatheringDateTime: '2024-12-30T20:00:00',
    recruitDeadline: '2024-12-25T23:59:59',
    status: 'COMPLETED',
    genres: ['JAZZ', 'ACOUSTIC'],
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 1, currentCount: 0 },
      { bandSession: 'ACOUSTIC_GUITAR', recruitCount: 1, currentCount: 1 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 0 },
    ],
    creator: {
      id: 1,
      nickname: '테스트유저',
      profileImagePath: '/images/ic_default_profile.svg',
    },
  },
  3: {
    id: 3,
    name: '팝 밴드 모집',
    thumbnail: '/images/card/img_card_pc_03.avif',
    place: '서울 종로구',
    description:
      '팝 음악을 좋아하는 분들과 함께하는 밴드 모임입니다. 대중적인 팝 음악을 연주하며 즐거운 시간을 보내고 싶습니다.',
    gatheringDateTime: '2024-12-27T19:00:00',
    recruitDeadline: '2024-12-22T23:59:59',
    status: 'COMPLETED',
    genres: ['POP', 'ROCK'],
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 2, currentCount: 2 },
      { bandSession: 'ELECTRIC_GUITAR', recruitCount: 1, currentCount: 1 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 1 },
      { bandSession: 'KEYBOARD', recruitCount: 1, currentCount: 1 },
    ],
    creator: {
      id: 1,
      nickname: '테스트유저',
      profileImagePath: '/images/ic_default_profile.svg',
    },
  },
  4: {
    id: 4,
    name: '인디 밴드 모집',
    thumbnail: '/images/card/img_card_pc_04.avif',
    place: '서울 마포구',
    description:
      '인디 음악을 사랑하는 분들과 함께하는 밴드 모임입니다. 독창적이고 개성 있는 음악을 만들어가고 싶습니다.',
    gatheringDateTime: '2024-12-26T20:00:00',
    recruitDeadline: '2024-12-21T23:59:59',
    status: 'COMPLETED',
    genres: ['INDIE', 'ROCK'],
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 1, currentCount: 1 },
      { bandSession: 'ELECTRIC_GUITAR', recruitCount: 1, currentCount: 1 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 1 },
    ],
    creator: {
      id: 1,
      nickname: '테스트유저',
      profileImagePath: '/images/ic_default_profile.svg',
    },
  },
  7: {
    id: 7,
    name: 'R&B 세션',
    thumbnail: '/images/card/img_card_pc_07.avif',
    place: '서울 홍대',
    description:
      'R&B 음악을 사랑하는 분들과 함께하는 세션입니다. 부드러운 멜로디와 리듬을 즐겨보세요.',
    gatheringDateTime: '2024-12-28T21:00:00',
    recruitDeadline: '2024-12-23T23:59:59',
    status: 'COMPLETED',
    genres: ['RNB', 'BALLAD'],
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 2, currentCount: 2 },
      { bandSession: 'ELECTRIC_GUITAR', recruitCount: 1, currentCount: 1 },
      { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
      { bandSession: 'BASS', recruitCount: 1, currentCount: 1 },
      { bandSession: 'KEYBOARD', recruitCount: 1, currentCount: 1 },
    ],
    creator: {
      id: 1,
      nickname: '테스트유저',
      profileImagePath: '/images/ic_default_profile.svg',
    },
  },
  8: {
    id: 8,
    name: '스트링 앙상블',
    thumbnail: '/images/card/img_card_pc_08.avif',
    place: '서울 종로구',
    description:
      '클래식과 현대 음악을 아우르는 스트링 앙상블입니다. 아름다운 하모니를 만들어보세요.',
    gatheringDateTime: '2024-12-29T20:00:00',
    recruitDeadline: '2024-12-24T23:59:59',
    status: 'COMPLETED',
    genres: ['ACOUSTIC', 'FOLK'],
    sessions: [
      { bandSession: 'VOCAL', recruitCount: 1, currentCount: 1 },
      { bandSession: 'STRING_INSTRUMENT', recruitCount: 3, currentCount: 3 },
      { bandSession: 'PERCUSSION', recruitCount: 1, currentCount: 1 },
    ],
    creator: {
      id: 1,
      nickname: '테스트유저',
      profileImagePath: '/images/ic_default_profile.svg',
    },
  },
};

// 모임 참가자 목데이터
export const MOCK_PARTICIPANTS: Record<number, Participant[]> = {
  1: [
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
  ],
  2: [
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
  ],
  3: [
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
  ],
  4: [
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
  ],
  5: [
    {
      participantId: 13,
      userId: 2,
      userNickname: '유저2',
      userEmail: 'user2@example.com',
      bandSession: 'VOCAL',
      status: 'APPROVED',
      createdAt: '2024-12-01T22:00:00',
      introduction: '유저2입니다. 재즈를 좋아합니다.',
      userProfileImagePath: '/images/ic_default_profile.svg',
    },
    {
      participantId: 14,
      userId: 3,
      userNickname: '유저3',
      userEmail: 'user3@example.com',
      bandSession: 'ACOUSTIC_GUITAR',
      status: 'APPROVED',
      createdAt: '2024-12-02T23:00:00',
      introduction: '유저3입니다. 재즈 기타를 연주합니다.',
      userProfileImagePath: '/images/ic_default_profile.svg',
    },
    {
      participantId: 15,
      userId: 4,
      userNickname: '유저4',
      userEmail: 'user4@example.com',
      bandSession: 'BASS',
      status: 'APPROVED',
      createdAt: '2024-12-03T00:00:00',
      introduction: '유저4입니다. 재즈 베이스를 연주합니다.',
      userProfileImagePath: '/images/ic_default_profile.svg',
    },
  ],
  6: [
    {
      participantId: 16,
      userId: 2,
      userNickname: '유저2',
      userEmail: 'user2@example.com',
      bandSession: 'VOCAL',
      status: 'APPROVED',
      createdAt: '2024-12-01T01:00:00',
      introduction: '유저2입니다. 메탈을 좋아합니다.',
      userProfileImagePath: '/images/ic_default_profile.svg',
    },
    {
      participantId: 17,
      userId: 3,
      userNickname: '유저3',
      userEmail: 'user3@example.com',
      bandSession: 'DRUM',
      status: 'APPROVED',
      createdAt: '2024-12-02T02:00:00',
      introduction: '유저3입니다. 메탈 드럼을 연주합니다.',
      userProfileImagePath: '/images/ic_default_profile.svg',
    },
    {
      participantId: 32,
      userId: 6,
      userNickname: '유저6',
      userEmail: 'user6@example.com',
      bandSession: 'ELECTRIC_GUITAR',
      status: 'PENDING',
      createdAt: '2024-12-05T03:00:00',
      introduction: '유저6입니다. 메탈 기타를 배우고 싶습니다.',
      userProfileImagePath: '/images/ic_default_profile.svg',
    },
    {
      participantId: 33,
      userId: 7,
      userNickname: '유저7',
      userEmail: 'user7@example.com',
      bandSession: 'BASS',
      status: 'PENDING',
      createdAt: '2024-12-06T04:00:00',
      introduction: '유저7입니다. 메탈 베이스를 배우고 싶습니다.',
      userProfileImagePath: '/images/ic_default_profile.svg',
    },
  ],
  7: [
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
  ],
  8: [
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
  ],
  9: [
    {
      participantId: 23,
      userId: 2,
      userNickname: '유저2',
      userEmail: 'user2@example.com',
      bandSession: 'VOCAL',
      status: 'APPROVED',
      createdAt: '2024-12-01T08:00:00',
      introduction: '유저2입니다. 펑크를 좋아합니다.',
      userProfileImagePath: '/images/ic_default_profile.svg',
    },
    {
      participantId: 24,
      userId: 3,
      userNickname: '유저3',
      userEmail: 'user3@example.com',
      bandSession: 'ELECTRIC_GUITAR',
      status: 'APPROVED',
      createdAt: '2024-12-02T09:00:00',
      introduction: '유저3입니다. 펑크 기타를 연주합니다.',
      userProfileImagePath: '/images/ic_default_profile.svg',
    },
    {
      participantId: 25,
      userId: 4,
      userNickname: '유저4',
      userEmail: 'user4@example.com',
      bandSession: 'DRUM',
      status: 'APPROVED',
      createdAt: '2024-12-03T10:00:00',
      introduction: '유저4입니다. 펑크 드럼을 연주합니다.',
      userProfileImagePath: '/images/ic_default_profile.svg',
    },
  ],
  10: [
    {
      participantId: 26,
      userId: 2,
      userNickname: '유저2',
      userEmail: 'user2@example.com',
      bandSession: 'VOCAL',
      status: 'APPROVED',
      createdAt: '2024-12-01T11:00:00',
      introduction: '유저2입니다. 포크를 좋아합니다.',
      userProfileImagePath: '/images/ic_default_profile.svg',
    },
    {
      participantId: 27,
      userId: 3,
      userNickname: '유저3',
      userEmail: 'user3@example.com',
      bandSession: 'ACOUSTIC_GUITAR',
      status: 'APPROVED',
      createdAt: '2024-12-02T12:00:00',
      introduction: '유저3입니다. 포크 기타를 연주합니다.',
      userProfileImagePath: '/images/ic_default_profile.svg',
    },
    {
      participantId: 28,
      userId: 4,
      userNickname: '유저4',
      userEmail: 'user4@example.com',
      bandSession: 'ACOUSTIC_GUITAR',
      status: 'APPROVED',
      createdAt: '2024-12-03T13:00:00',
      introduction: '유저4입니다. 포크 기타를 연주합니다.',
      userProfileImagePath: '/images/ic_default_profile.svg',
    },
    {
      participantId: 29,
      userId: 5,
      userNickname: '유저5',
      userEmail: 'user5@example.com',
      bandSession: 'PERCUSSION',
      status: 'APPROVED',
      createdAt: '2024-12-04T14:00:00',
      introduction: '유저5입니다. 타악기를 연주합니다.',
      userProfileImagePath: '/images/ic_default_profile.svg',
    },
  ],
  7: [
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
  ],
  8: [
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
  ],
};

// 모임 생성 응답 목데이터
export const MOCK_REGISTER_RESPONSE: RegisterGatheringsResponse = {
  id: 999,
  name: '새로 생성된 모임',
  message: '모임이 성공적으로 생성되었습니다.',
  gatheringDateTime: '2024-12-25T19:00:00',
  recruitDeadline: '2024-12-20T23:59:59',
  thumbnail: '/images/card/img_card_pc_01.avif',
  status: 'RECRUITING',
};

// 모임 수정 응답 목데이터
export const MOCK_MODIFIED_RESPONSE: ModifiedGatheringsResponse = {
  id: 1,
  name: '수정된 모임',
  thumbnail: '/images/card/img_card_pc_01.avif',
  place: '서울 강남구',
  description: '수정된 모임 설명입니다.',
  gatheringDateTime: '2024-12-25T19:00:00',
  recruitDeadline: '2024-12-20T23:59:59',
  status: 'RECRUITING',
  genres: ['ROCK', 'METAL'],
  sessions: [
    { bandSession: 'VOCAL', recruitCount: 1, currentCount: 1 },
    { bandSession: 'ELECTRIC_GUITAR', recruitCount: 2, currentCount: 1 },
    { bandSession: 'DRUM', recruitCount: 1, currentCount: 1 },
    { bandSession: 'BASS', recruitCount: 1, currentCount: 0 },
  ],
  creator: {
    id: 1,
    nickname: '테스트유저',
  },
};

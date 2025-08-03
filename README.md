![Image](https://github.com/user-attachments/assets/2fcdd2b1-772e-4a00-b6b6-2428fa3fd44d)

# JAMMIT - 세션 기반 밴드 합주 매칭 플랫폼
[👉 데모 바로가기](https://jammit-fe-six.vercel.app/)

JAMMIT은 정규 밴드처럼 무겁지 않고, 누구나 쉽게 합주의 재미를 경험할 수 있도록 설계된
세션 기반의 단기 밴드 합주 매칭 플랫폼입니다.

- 원하는 세션(보컬, 기타, 드럼 등) 을 모집하거나 참여할 수 있습니다.
- 장르/곡 취향 기반 팀 매칭으로 더 잘 맞는 팀원을 찾을 수 있습니다.
- 오프라인 합주 장소 검색부터 합주 영상 업로드, 리뷰 작성까지 하나의 흐름으로 구성됩니다.
<br/>

---

<br/>

# 0. 시작하기
```bash
# git clone
git clone git@github.com:FESI09-Team2/JAMMIT_FE.git

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```
**테스트 계정**
- 아이디: ``` rkddmsdn7116@gmail.com ```
- 비밀번호: ```password71*```

<br/>

---

<br/>

# 1. 팀 구성
- **Frontend**: 3명
- **Backend**: 2명  
- **Designer**: 1명

**팀 역할 분담 (프론트엔드)**

| 이름 | 담당 영역 |
|---------|---------|
| **강은우** | 로그인, 마이페이지(내가 올린 영상), 후기 작성, 회원가입,  인증 로직 관리, <br/> 배포 환경 세팅, Query Key 계층 설계, 공통 컴포넌트: `Button`, `TagSelector`, `GNB` |
| **송진환** | 댓글 작성, 마이페이지(받은 리뷰), 영상 상세, 찜한 모임, 홈, 영상 업로드 및 관리, <br/> Sentry 연동, 공통 컴포넌트: `TextArea`. `VirtuoScroll 가상화 처리` |
| **이주훈** | 마이페이지 (참여 모임 / 등록 모임), 모임 등록 / 수정 페이지, <br/>공통 컴포넌트: `Input`, `Modal`, `Dropdown`, `RHF 기반 TextArea`, `InfinityScroll` |

<br/>

---

<br/>

# 2. 주요 기능

| 기능 구분 | 설명 |
|----------|------|
| 모임 조회 | 장르, 세션별 필터 / 최신순, 마감임박순 정렬 / 찜 기능 |
| 모임 생성 및 수정 | 세션 인원 설정, 실제 장소 API 연동 (daum) |
| 모임 참여 및 승인 | 신청자 프로필, 업로드 영상 기반 검토 / 승인 및 거절 |
| 리뷰 | 합주 종료 후 팀원 간 리뷰 작성 가능 |
| 영상 업로드 | 개인 영상 or 합주 영상 업로드 및 댓글 |
| 마이페이지 | 유저프로필, 모임, 리뷰, 업로드 영상 관리 |

<br/>

---

<br/>

# 3. 기술 스택

### 프론트엔드
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS

### 상태 관리 & 폼
- TanStack Query (React Query)
- Zustand
- React Hook Form

### 테스트 & 품질 관리
- Husky, ESLint
- Jest + React Testing Library
- Storybook
- Sentry (모니터링)

<br/>

---

<br/>

# 4. 아키텍쳐

<img width="700" alt="스크린샷 2025-06-24 오전 1 41 07" src="https://github.com/user-attachments/assets/7a36bc1d-2a50-446c-bec8-bfde8ed7ddc3" />

<br/>

---

<br/>

# 5. 주요 기술적 성과

<br/>

## 5.1. 쿼리 키 계층 구조 설계
React Query의 쿼리 키를 계층적으로 설계하여 데이터 무효화 정확도와 코드 유지보수성을 향상시켰습니다.

```typescript
// 모임 관련 쿼리키 구조
gatherings
├─ list (filters)
└─ details (id)
   ├─ detail 
   ├─ reviews
   ├─ participants
   └─ participantReviewProfile (participantsId)
```

<br/>

## 5.2. Trunk-based Git Flow 도입
모든 브랜치를 main 기준으로 생성하고 기능 완료 후 PR을 통해 main에 merge하는 전략을 채택했습니다.

<img width="550" alt="스크린샷 2025-06-24 오전 1 41 55" src="https://github.com/user-attachments/assets/1b025a94-5109-45b8-a9e0-e82fa0000439" />

**선택 이유**
- 중앙 집중식 흐름 유지로 팀 협업 효율성 증대
- 대규모 브랜치 분기 없이 빠른 통합 가능

```
main
└── feature/07-login
└── feature/08-review
└── feature/09-video-main
    └── feature/09-video/11-video-upload
    └── feature/09-video/12-video-detail
```

<br/>

## 5.3. SEO 및 성능 최적화
aria-label과 meta 태그 도입을 통해 SEO 성능을 70점에서 100점으로 향상시켰습니다.

<img width="564" alt="스크린샷 2025-06-24 오전 1 42 23" src="https://github.com/user-attachments/assets/204fcaca-1959-45e4-bd02-2aaf139300ae" />

**성능 개선 결과** (1,000개 mock data 렌더링 테스트)
- Performance Score: 46 → 86 (+40점, ≈86.96%↑)
- FCP: 0.9s → 0.8s (≈11%↓)
- LCP: 5.0s → 4.4s (≈12%↓)
- TBT: 6,140ms → 570ms (≈91%↓)
- Speed Index: 6.1s → 3.1s (≈49%↓)

<br/>

## 5.4. 실제 이메일 인증 시스템
보안과 서비스 신뢰도 향상을 위해 실제 이메일 인증을 구현했습니다.

**구현 프로세스**
1. **인증 코드 발송**: 이메일 입력 후 서버에서 인증코드 전송
```
await sendCodeMutation({ email });
```
2. **코드 검증**: 사용자 입력 코드와 서버 코드 일치 여부 확인
```
await verifyCodeMutation({ email, code });
```
3. **회원가입 진행**: 인증 완료 후에만 회원가입 API 호출 가능
```
if (isEmailVerified) {
  await signupMutation({ email, password, ... });
}
```

**주요 이점**
- 타인의 이메일 도용 방지
- 스팸/가짜 계정 차단
- 서비스 품질 및 사용자 신뢰도 향상

<br/>

## 5.5. Query Parameter 기반 탭 시스템
URL 쿼리 파라미터를 활용한 탭 상태 관리로 UX를 개선했습니다.

### **핵심 기능**
1.  **새로고침/URL 공유 시 탭 상태 유지**
- 쿼리스트링(?tab=xxx)에 현재 탭 정보가 들어가므로 새로고침해도 사용자가 보고 있던 탭이 그대로 유지
- URL을 복사해서 공유하면, 상대방도 같은 탭 상태로 바로 접근 가능

2. **별도의 탭 페이지(라우트) 생성 불필요**
- 각 탭마다 /page1, /page2 등 별도 페이지를 만들 필요 없이 하나의 페이지에서 쿼리스트링만 바꿔서 탭 전환 가능해 코드 구조가 단순해지고, 라우트 관리가 쉬워짐

3. **UX/SEO 측면 이점**
- 브라우저 뒤로가기/앞으로가기 시 탭 상태가 자연스럽게 이동
- 검색엔진이 각 탭별로 별도의 URL로 인식 가능

<br/>

## 5.6. 에러 추적 및 모니터링
Sentry를 도입하여 실시간 에러 추적 및 성능 모니터링 시스템을 구축했습니다.

**주요 이점**
- 사용자가 버그 제보 안 해도 에러 감지 및 실시간 대응 가능
- 특정 사용자, 특정 상황에서만 발생하는 이슈도 추적 가능
- 빠르게 디버깅하고 hotfix 적용 가능

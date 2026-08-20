# Runcovery FE 프로젝트 분석

> 최종 갱신: 2026-08-19
> 기준: 현재 작업 트리의 실제 구현과 `package.json`

## 1. 프로젝트 개요

Runcovery는 러너의 목표, 당일 컨디션, 활동 기록, 운동 후 피부 및 통증 상태를 결합해 미션과 회복 처방을 제공하는 Expo 애플리케이션입니다.

현재 주요 기능은 실제 백엔드 API에 연결되어 있으며 TanStack React Query가 서버 상태와 캐시를 관리합니다. 프로필 입력과 단계형 화면의 임시 값은 Zustand 또는 컴포넌트 로컬 상태로 관리합니다.

## 2. 현재 런타임

| 항목 | 버전/설정 |
| --- | --- |
| Expo | SDK 54 (`~54.0.37`) |
| React Native | `0.81.5` |
| React | `19.1.0` |
| Expo Router | `~6.0.24` |
| TypeScript | `~5.9.2`, strict mode |
| 상태 관리 | React Query 5, Zustand 5 |
| 스타일 | NativeWind 5 preview, Tailwind CSS 4 |
| HTTP | Axios 1.19 |

Expo의 버전 호환표상 SDK 54는 React Native 0.81과 React 19.1 조합입니다. 저장소 작업 지침상 SDK 57 문서를 먼저 확인하지만, 구현과 패키지 설치는 현재 SDK 54 조합을 기준으로 검증해야 합니다.

## 3. 애플리케이션 구조

```text
src/
├─ app/
│  ├─ (tabs)/
│  │  ├─ home.tsx
│  │  ├─ mission.tsx
│  │  ├─ condition.tsx
│  │  ├─ manage.tsx
│  │  └─ my.tsx
│  ├─ condition-check.tsx
│  ├─ manage/prescriptions/[prescriptionId].tsx
│  └─ onboarding/
├─ apis/                 # 도메인별 endpoint
├─ components/           # 도메인 UI 및 shared/ui
├─ hooks/                # 화면 orchestration
├─ lib/                  # query client, activity demo payload
├─ stores/               # 프로필과 runtime UUID
└─ types/                # API DTO와 화면 타입
```

### 책임 구분

- `src/app`: 라우트 조립, query/mutation 연결, 단계 전환
- `src/apis`: Axios 요청 및 API envelope 해제
- `src/components`: 화면 표현과 사용자 입력
- `src/hooks`: 홈과 온보딩의 비동기 흐름
- `src/stores`: 여러 화면에서 공유하는 클라이언트 상태
- `src/lib/query-client.ts`: 전역 React Query 정책

## 4. 라우트

| 경로 | 역할 |
| --- | --- |
| `/` | 시작 화면 |
| `/onboarding` | 서비스 소개 |
| `/onboarding/profile` | 닉네임, 나이, 성별, 키, 몸무게 입력 |
| `/onboarding/experience` | 러닝 경험 입력 및 사용자 등록 |
| `/onboarding/goal/setup` | 목표 설정 시작/건너뛰기 |
| `/onboarding/goal/detail` | 장면 추천, 목표 입력·조정, 최종 저장 |
| `/(tabs)/home` | 홈 요약 및 자동 활동 동기화 |
| `/(tabs)/mission` | 주간 목표와 오늘의 미션 |
| `/(tabs)/condition` | 최신 컨디션 결과 |
| `/condition-check` | 컨디션 설문과 통증 부위 선택 |
| `/(tabs)/manage` | 운동 후 사후관리 전체 흐름 |
| `/manage/prescriptions/[prescriptionId]` | 피부/스트레칭 처방 상세 |
| `/(tabs)/my` | 칼로리, 미션, 관리율, 피부 점수 |

단계형 화면은 `StepScreenLayout`의 `onBack`을 사용합니다. 상단 화살표와 Android 하드웨어 뒤로가기는 같은 함수를 호출하며 첫 단계가 아니면 라우트를 닫지 않고 직전 단계로 이동합니다.

## 5. API 클라이언트

### 공통 설정

- Base URL: `EXPO_PUBLIC_API_BASE_URL`
- 보호 API 헤더: `X-Public-Id`
- 요청 인스턴스: `src/apis/index.ts`의 `api`
- 공개 요청 인스턴스: `publicApi`

`X-Public-Id`는 `useProfileStore`에서 실행 시 생성됩니다. 현재 영구 저장하지 않으므로 앱 프로세스를 재시작하면 변경됩니다.

### 연결된 endpoint

| 도메인 | Method | Endpoint | 주요 사용처 |
| --- | --- | --- | --- |
| 사용자 | POST | `/users` | 온보딩 사용자 등록 |
| 사용자 | GET | `/users/mypage` | 마이페이지 |
| 홈 | GET | `/home` | 홈 카드와 달성률 |
| 목표 | GET/POST | `/goals/future` | 미래 목표 조회·저장 |
| 목표 | POST | `/goals/future/scenes/recommend/profile` | 프로필 기반 장면 추천 |
| 목표 | POST | `/goals/future/scenes/recommend/plan` | 계획 기반 장면 추천 |
| 목표 | POST | `/goals/future/plan/recommend` | 장면 기반 목표 추천 |
| 목표 | GET/POST | `/goals/weekly/current`, `/goals/weekly/generate` | 주간 목표 |
| 컨디션 | GET | `/conditions/latest` | 서버 컨디션 존재 여부와 결과 |
| 컨디션 | POST | `/conditions` | 컨디션 분석 저장 |
| 미션 | GET | `/missions/today` | 오늘 미션 |
| 미션 | POST | `/missions/generate` | 오늘 미션 생성 |
| 활동 | GET | `/activities/today` | 오늘 러닝 기록 |
| 활동 | POST | `/activities/sync` | 홈 진입/버튼 활동 동기화 |
| 웰니스 | GET | `/wellness/reports/preview` | 리포트 생성 전 활동 프리뷰 |
| 웰니스 | POST | `/wellness/reports` | 강도 및 처방 생성 |
| 웰니스 | GET | `/wellness/prescriptions` | 처방전 카드 목록 |
| 웰니스 | GET | `/wellness/prescriptions/{id}` | 처방 상세 |
| 웰니스 | PATCH | `/wellness/prescriptions/{category}/complete` | 피부/스트레칭 관리 완료 |
| 피부 | POST | `/wellness/skin/scan` | AFTER_RUN/AFTER_CARE 분석 |
| 피부 | GET | `/wellness/skin/comparison` | 관리 후 기록의 전날 대비 비교 |

## 6. 핵심 데이터 흐름

### 홈과 활동 동기화

```text
홈 focus 또는 pull-to-refresh
→ POST /activities/sync
→ activity / mission / weekly goal / mypage 캐시 무효화
→ GET /home
→ 최신 홈 데이터 표시
```

현재 실제 헬스 플랫폼 데이터 소스가 없으므로 `src/lib/activity-sync.ts`에서 시연 payload를 생성합니다. `recordDate`, `startTime`, `endTime`의 날짜만 오늘로 변경되며 나머지 운동 수치는 고정입니다.

### 컨디션과 미션 버튼

미션 화면은 `GET /conditions/latest` 결과를 기준으로 기본 동작을 결정합니다.

| 상태 | 버튼 | 동작 |
| --- | --- | --- |
| 컨디션 없음 | 컨디션 체크하기 | `/condition-check` 이동 |
| 컨디션 있음, 미션 없음 | 오늘의 미션 생성하기 | 미션 및 필요 시 주간 목표 생성 |
| 미션 있음 | 오늘의 미션 생성 완료 | 비활성화, 중복 요청 방지 |

컨디션 저장 성공 시 `condition/latest`, `mission`, `user/mypage` 캐시를 갱신합니다.

### 사후관리

```text
skin(AFTER_RUN)
→ running(feeling)
→ energy
→ sweat
→ pain
→ summary
→ report loading
→ intensity
→ report/prescriptions
```

`summary`의 기록 동기화 버튼은 다음 순서로 동작합니다.

```text
POST /activities/sync
→ GET /activities/today
→ GET /wellness/reports/preview
→ 화면 카드 갱신
```

### 피부 관리 완료

1. 운동 후 `AFTER_RUN` 이미지를 업로드합니다.
2. 리포트의 피부 처방 상세에서 운동 직후 진단을 확인합니다.
3. 관리 완료를 시작하면 이미지를 다시 선택하고 `AFTER_CARE`로 업로드합니다.
4. 측정일로 `/wellness/skin/comparison`을 조회합니다.
5. 전날 기록이 있으면 `today`, `previousDay`, `difference`를 표시합니다.
6. 전날 기록이 404이면 당일 측정 점수만 표시합니다.
7. 결과 화면은 유지되고 처방 완료 PATCH는 백그라운드에서 자동 실행됩니다.

카메라는 사용하지 않으며 `expo-image-picker`로 갤러리 파일을 선택합니다.

### 마이페이지

`GET /users/mypage` 응답을 그대로 다음 컴포넌트에 전달합니다.

- `ProfileSection`: 닉네임, 소모/목표 칼로리
- `WeeklyMissionSection`: `MON~SUN` 성공 요일과 성공 횟수
- `CareStatusSection`: 컨디션/피부/스트레칭 관리율 및 피드백
- `FitnessScoreChart`: 날짜별 피부 점수

차트는 날짜 정렬, 동일 날짜 중복 제거, 점수 clamp, 동적 Y축, 빈 상태, X축 라벨 축약을 처리합니다. 마이페이지는 pull-to-refresh와 화면 재마운트 시 최신 조회를 지원합니다.

## 7. React Query 캐시 정책

전역 기본값:

- `staleTime`: 30초
- 일반 서버 오류: 최대 2회 시도
- 4xx `ApiError`: 재시도하지 않음
- mutation: 자동 재시도하지 않음

주요 query key:

- `['condition', 'latest']`
- `['mission', 'today']`
- `['goal', 'weekly', 'current']`
- `['activity', 'today']`
- `['wellness', 'preview', recordId]`
- `['wellness', 'prescriptions', ...]`
- `['user', 'mypage', 'stats-v2']`

미션 완료, 컨디션 저장, 피부 분석, 처방 완료, 활동 동기화 후 관련 prefix key를 무효화합니다.

## 8. UI 및 UX 구현

- `LoadingScreen`: 화면 단위 공통 로딩 및 재시도
- `Button`: 액션 단위 spinner와 중복 클릭 방지
- `StepScreenLayout`: 그라데이션, safe area, header, 단계별 back 처리
- 키보드 입력 화면: `KeyboardAvoidingView`와 scroll 설정
- 바디체크: SVG 영역별 press target과 선택 상태
- 홈 달성 이미지: `<50`, `50~79`, `80~99`, `100` 구간별 캐릭터
- 홈/마이페이지: pull-to-refresh
- 접근성: 버튼 role, progress value, 차트 요약 label

## 9. 현재 시연 제약

1. 활동 동기화는 실제 Health Connect/Apple Health 데이터가 아니라 고정 payload입니다.
2. 위치 권한 요청은 비활성화되어 서울 기본 좌표를 사용합니다.
3. 피부 분석은 카메라가 아니라 갤러리 이미지 선택 방식입니다.
4. runtime UUID는 영구 저장하지 않습니다.
5. 자동화 테스트와 ESLint 설정 파일이 없습니다.
6. 웹 전용 탭 구현은 모바일 5개 탭과 기능 구성이 다릅니다.
7. 실제 백엔드 날짜 정책과 기기 timezone이 다르면 오늘 기록 조회가 달라질 수 있습니다.

## 10. 검증과 운영 명령

```bash
npm install
npx expo start -c
npx tsc --noEmit
```

현재 확인된 기본 검증은 TypeScript 검사입니다. `npm run lint`는 ESLint 초기 설정 과정에서 패키지 다운로드가 필요할 수 있습니다.

## 11. 문서 기준

- [Expo SDK 57 문서](https://docs.expo.dev/versions/v57.0.0/)
- [Expo SDK 54 문서](https://docs.expo.dev/versions/v54.0.0/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [TanStack Query React Native](https://tanstack.com/query/latest/docs/framework/react/react-native)

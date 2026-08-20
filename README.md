# Runcovery FE

Runcovery는 러닝 전 컨디션 확인부터 오늘의 미션, 운동 후 피부·신체 상태 분석, 맞춤 회복 처방까지 연결하는 Expo 기반 모바일 앱입니다.

상세한 구조와 API 흐름은 [프로젝트 분석 문서](./docs/PROJECT_ANALYSIS.md)를 참고하세요.

## 핵심 기능

- 프로필과 러닝 경험을 기반으로 미래 목표 및 주간 목표 설정
- 몸 상태·수면 상태·통증 부위를 조합한 오늘의 컨디션 분석
- 컨디션과 위치 정보를 반영한 일일 미션 생성
- 러닝 활동 동기화와 목표 달성률 확인
- 러닝 직후 피부 이미지 및 운동 만족도 분석
- 수분·피부·스트레칭 맞춤 처방과 관리 완료 기록
- 주간 미션, 사후관리 달성률, 월간 피부 점수를 모은 마이페이지

## 기술 스택

- Expo SDK 54 (`expo ~54.0.37`)
- React Native 0.81 / React 19.1
- Expo Router 6
- TypeScript 5.9 (`strict`)
- NativeWind 5 preview / Tailwind CSS 4
- TanStack React Query 5
- Zustand 5
- Axios
- React Native SVG

현재 프로젝트는 `package.json` 기준 Expo SDK 54를 사용합니다. SDK 54는 React Native 0.81, React 19.1, Node.js 20.19 이상 조합을 기준으로 합니다. 패키지를 변경할 때는 [Expo SDK 54 문서](https://docs.expo.dev/versions/v54.0.0/)와 저장소 작업 지침에서 지정한 [Expo SDK 57 문서](https://docs.expo.dev/versions/v57.0.0/)를 함께 확인하세요.

## 실행 준비

### 요구 환경

- Node.js 20.19 이상
- npm
- Android Studio Emulator, iOS Simulator 또는 Expo 앱을 실행할 실제 기기

### 환경변수

루트에 `.env` 파일을 만들고 API 주소를 설정합니다.

```env
EXPO_PUBLIC_API_BASE_URL=http://YOUR_API_HOST:PORT
```

실제 기기에서는 `localhost` 대신 PC의 같은 Wi-Fi 내부 IP를 사용해야 합니다.

`EXPO_PUBLIC_` 접두사가 붙은 값은 앱 번들에 포함되므로 비밀번호나 API 비밀 키를 저장하지 마세요.

### 설치 및 실행

```bash
npm install
npx expo start -c
```

주요 명령어:

```bash
npm run start       # Expo 개발 서버
npm run android     # Android에서 열기
npm run ios         # iOS에서 열기
npm run web         # 웹에서 열기
npx tsc --noEmit    # TypeScript 검사
```

현재 ESLint 설정 파일은 없습니다. `npm run lint`를 처음 실행하면 Expo가 설정 패키지 설치를 시도하므로 네트워크 연결이 필요합니다.

## 화면 구성

| 경로 | 역할 |
| --- | --- |
| `/` | 스플래시 및 온보딩 진입 |
| `/onboarding/profile` | 닉네임·나이·성별·신체 정보 입력 |
| `/onboarding/experience` | 러닝 경험 등록 |
| `/onboarding/goal/setup` | 목표 설정 시작 또는 건너뛰기 |
| `/onboarding/goal/detail` | 장면 추천·목표 입력·조정·저장 |
| `/(tabs)/home` | 오늘 상태, 목표 달성률, 웰니스 팁 |
| `/(tabs)/mission` | 주간 목표와 오늘의 미션 |
| `/(tabs)/condition` | 최신 컨디션 분석 결과 |
| `/condition-check` | 몸·수면·통증 상태 입력 |
| `/(tabs)/manage` | 피부 분석부터 웰니스 리포트까지의 사후관리 |
| `/manage/prescriptions/[prescriptionId]` | 피부·스트레칭·영양 처방 상세 |
| `/(tabs)/my` | 주간 활동 및 월간 피부 점수 통계 |

## 주요 사용자 흐름

### 온보딩과 목표 설정

```text
프로필 → 러닝 경험 → 목표 설정 방식 선택
  ├─ 추천: 장면 추천 → 목표 조정 → 요약
  └─ 직접 입력: 목표 입력 → 장면 추천 → 요약
```

### 컨디션과 미션

1. 서버의 최신 컨디션 기록을 조회합니다.
2. 기록이 없으면 미션 화면에 `컨디션 체크하기`가 표시됩니다.
3. 컨디션 체크가 끝나면 `오늘의 미션 생성하기`로 변경됩니다.
4. 생성된 미션이 있으면 중복 생성 버튼이 비활성화됩니다.

### 사후관리

```text
운동 후 피부 이미지 선택(AFTER_RUN)
→ 운동 만족도/에너지/땀 설문
→ 통증 부위 선택
→ 활동 동기화 및 리포트 프리뷰
→ 강도 분석
→ 수분·피부·스트레칭 처방전
```

피부 처방전의 관리 완료 흐름:

```text
운동 직후 피부 진단 상세
→ 관리 후 이미지 선택(AFTER_CARE)
→ 전날 AFTER_CARE 기록과 비교
→ 비교 수치 화면 유지
```

관리 후 비교 결과가 표시되면 피부 처방 완료 API는 백그라운드에서 자동 호출됩니다.

## 데이터와 상태 관리

- TanStack React Query는 컨디션, 미션, 활동, 처방전, 마이페이지 등의 서버 상태와 캐시를 관리합니다.
- Zustand는 온보딩 프로필과 API 요청에 사용하는 런타임 사용자 식별자를 관리합니다.
- Axios 요청 인터셉터는 보호 API에 `X-Public-Id` 헤더를 자동으로 추가합니다.
- 생성·완료 mutation 이후 관련 query key를 무효화해 다른 탭에서도 최신 값을 조회합니다.
- 빠른 연속 탭으로 중복 기록이 생성되지 않도록 주요 mutation에 별도 잠금이 적용되어 있습니다.

## 활동 동기화 시연 데이터

`POST /activities/sync`는 홈 진입, 홈 pull-to-refresh, 사후관리의 `기록 동기화` 버튼에서 호출됩니다.

현재 실제 헬스 플랫폼 연동 전이므로 날짜만 오늘 날짜를 사용하고 나머지는 고정된 시연 데이터로 전송합니다.

```json
{
  "recordDate": "오늘 날짜(yyyy-MM-dd)",
  "runningDuration": 1200,
  "distanceM": 5200,
  "avgPace": 360,
  "avgHeartRate": 145,
  "maxHeartRate": 172,
  "calories": 420,
  "cadence": 168,
  "startTime": "오늘 날짜T07:00:00",
  "endTime": "오늘 날짜T07:40:00",
  "lat": 37.5665,
  "lon": 126.978
}
```

동기화 성공 후 활동, 오늘의 미션, 주간 목표, 마이페이지 캐시를 갱신합니다.

## API 식별자

인증 대신 모든 보호 API 요청에 아래 헤더가 자동으로 포함됩니다.

```http
X-Public-Id: <runtime UUID>
```

현재 UUID는 앱 실행 중 메모리에만 존재하며 영구 저장하지 않습니다. 앱을 완전히 재시작하면 새 UUID가 생성됩니다.

## 프로젝트 구조

```text
src/
├─ app/                  # Expo Router 화면과 파일 기반 라우트
│  ├─ (tabs)/            # 홈·미션·컨디션·사후관리·마이페이지
│  ├─ onboarding/        # 프로필, 러닝 경험, 목표 설정
│  └─ manage/            # 처방전 상세 라우트
├─ apis/                 # 공통 Axios 클라이언트와 도메인별 endpoint
├─ components/           # 기능별 UI, 공통 레이아웃, 입력 컴포넌트
├─ constants/            # 테마와 기능 플래그
├─ hooks/                # 홈 조회와 온보딩 단계 orchestration
├─ lib/                  # QueryClient와 활동 시연 payload
├─ stores/               # Zustand 클라이언트 상태
├─ types/                # API DTO와 도메인 타입
└─ utils/                # 공통 유틸리티
```

## 코드 읽기 가이드

- 화면 JSX 주석은 `타이틀`, `리스트`, `결과`, `버튼`처럼 시각적 구획을 표시합니다.
- 훅과 데이터 처리 주석은 코드가 무엇을 하는지보다 캐시 갱신, 중복 요청 방지, 단계 전환처럼 해당 구현이 필요한 이유를 설명합니다.
- API 함수는 도메인별 `src/apis/*/index.ts`에 모여 있으며 화면은 응답 구조 대신 도메인 데이터를 사용합니다.

## 현재 개발 제약

- 활동 동기화는 Health Connect 또는 Apple Health가 아닌 고정 시연 payload를 사용합니다.
- 위치 권한 요청은 비활성화되어 서울 기본 좌표를 전송합니다.
- 피부 분석 이미지는 카메라 촬영이 아니라 갤러리에서 선택합니다.
- 런타임 UUID는 영구 저장되지 않아 앱 프로세스를 다시 시작하면 새로운 사용자로 인식될 수 있습니다.
- 자동화된 테스트와 프로젝트 전용 ESLint 설정은 아직 없습니다.
- 모바일 우선 UI이며 웹에서도 동일한 다섯 개 탭과 라우트를 사용합니다.

## 문제 해결

### 변경 내용이 Expo Go에 반영되지 않을 때

```bash
npx expo start -c
```

Expo Go에서 프로젝트를 닫았다가 QR 코드를 다시 스캔합니다.

### 실제 기기에서 API가 연결되지 않을 때

- PC와 휴대폰이 같은 Wi-Fi인지 확인합니다.
- `.env`에 PC의 내부 IP가 설정됐는지 확인합니다.
- Windows 방화벽에서 API 포트와 Expo 개발 서버 접근을 허용합니다.

### 타입 검사

```bash
npx tsc --noEmit
```

# 유아동작교육 이론 학습 (ece-motion-study)

대학 유아교육과 **'유아동작 교육'** 과목 이론을 공부하는 학생을 위한 학습앱.
**개념 학습 → 문제 풀이 → 약점 복습**의 시험 대비 루프를, 서버·카메라·외부 API 없이 브라우저 안에서 돌립니다.

> 원래 기획(영상 촬영 + MediaPipe 자세분석 시뮬레이터)에서 시뮬레이터 부분을 전부 걷어내고,
> 이론 시험 대비에 필요한 기능만 남긴 버전입니다. (관련 PRD: `Downloads/PRD_MotionMaster_Trimmed.md`)

## 기능

- **개념 학습** — 7개 단원, 개념 18개를 카드로 읽기 (예시·핵심어 포함)
- **문제 풀이** — 단원·난이도·문항 수를 골라 모의시험 출제. 객관식/OX/단답, 즉시 채점 + 해설
- **약점 복습** — 틀린 문제가 자동으로 쌓이고, 다시 맞히면 목록에서 사라짐. 누적 정답률 표시
- 진도는 **localStorage**에 저장 (서버 없음, 개인용)

## 7개 단원 (개념 분류)

1. 동작교육의 기초 — 개념·목적·교육적 가치
2. 유아 운동발달 이론 — 게젤·갤러휴·발달 원리
3. 기본 움직임 기술 — 이동·비이동·조작
4. 라반 움직임 분석 — 신체·공간·노력·관계
5. 지각-운동 발달 — 신체·공간·방향·시간 지각
6. 교수-학습 방법 — 직접적/간접적, 탐색-발견-창작, 모스턴
7. 프로그램 계획 및 평가 — 도입-전개-정리, 관찰 평가

## 실행

```bash
npm install
npm run dev      # http://localhost:5174
```

빌드: `npm run build` · 타입체크: `npm run typecheck`

## 구조

```
src/
├── data/
│   ├── concepts.ts    # 개념 시드 데이터 (여기에 개념 추가)
│   └── questions.ts   # 문제은행 (여기에 문제 추가)
├── components/
│   ├── ConceptView.tsx    # 개념 학습
│   ├── QuizView.tsx       # 문제 출제·결과
│   ├── QuestionRunner.tsx # 한 문제씩 풀이 (퀴즈·복습 공용)
│   └── ReviewView.tsx     # 약점 복습
├── store/studyStore.ts    # zustand + localStorage 진도 저장
├── lib/
│   ├── categories.ts  # 단원 메타(라벨·색)
│   └── grade.ts       # 채점 로직
└── types.ts
```

## 콘텐츠 추가 방법

코드보다 **콘텐츠(개념·문제) 채우기**가 핵심 작업입니다.

- **개념 추가**: `src/data/concepts.ts`에 `Concept` 객체 추가 (id·category·title·body 필수)
- **문제 추가**: `src/data/questions.ts`에 `Question` 객체 추가
  - `type`: `mcq`(객관식) / `ox` / `short`(단답)
  - `answer`: mcq는 정답 보기 인덱스(`"2"`), ox는 `"O"`/`"X"`, short는 정답어(복수면 `"정답1|정답2"`)
  - `explanation`(해설)은 복습의 핵심이므로 꼭 작성

강의 교재/강의계획서가 있으면 그 목차·용어에 맞춰 개념과 문제를 채우면 정확도가 올라갑니다.

// 유아동작교육 이론 학습앱 - 공통 타입

/** 이론 과목 표준 목차 기반 7개 단원 */
export type Category =
  | 'basics' // 동작교육의 기초
  | 'development' // 유아 운동발달 이론
  | 'fundamental' // 기본 움직임 기술
  | 'laban' // 라반 움직임 분석
  | 'perceptual' // 지각-운동 발달
  | 'teaching' // 교수-학습 방법
  | 'planning'; // 프로그램 계획 및 평가

/** 개념 카드 하나 */
export interface Concept {
  id: string;
  category: Category;
  title: string;
  /** 핵심 설명. 줄바꿈(\n)으로 문단 구분 */
  body: string;
  /** 예시/적용 (선택) */
  example?: string;
  /** 시험 핵심어 */
  keywords?: string[];
}

export type QuestionType = 'mcq' | 'ox' | 'short';

/** 문제 하나 */
export interface Question {
  id: string;
  conceptId: string;
  category: Category;
  type: QuestionType;
  /** 난이도 1(쉬움)~3(어려움) */
  level: 1 | 2 | 3;
  prompt: string;
  /** 객관식(mcq)일 때 보기 */
  choices?: string[];
  /**
   * 정답.
   * - mcq: 정답 보기의 인덱스 문자열 ("0","1"...)
   * - ox: "O" 또는 "X"
   * - short: 정답 단어(들). 여러 정답은 | 로 구분
   */
  answer: string;
  /** 해설 (복습의 핵심) */
  explanation: string;
}

/** localStorage에 저장되는 학습 진도 */
export interface Progress {
  /** questionId -> 최근 정답 여부 */
  solved: Record<string, boolean>;
  /** questionId -> 총 시도 횟수 */
  attempts: Record<string, number>;
  /** 복습 대기열 (틀린 문제 questionId) */
  wrongQueue: string[];
  /** questionId -> 마지막으로 푼 시각(timestamp) */
  lastSeen: Record<string, number>;
}

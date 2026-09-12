import type { Question } from '../types';

/** 사용자 답을 채점한다. mcq는 인덱스, ox는 O/X, short는 정규화 비교. */
export function isCorrect(q: Question, userAnswer: string): boolean {
  const ua = normalize(userAnswer);
  if (q.type === 'short') {
    // 정답 후보(| 구분)와 정규화 비교
    return q.answer.split('|').some((a) => normalize(a) === ua);
  }
  return normalize(q.answer) === ua;
}

/** 공백 제거 + 소문자화로 단답 채점 관대하게 */
function normalize(s: string): string {
  return s.replace(/\s+/g, '').toLowerCase();
}

/** 정답을 사람이 읽을 수 있는 문자열로 */
export function answerText(q: Question): string {
  if (q.type === 'mcq' && q.choices) {
    const idx = Number(q.answer);
    return q.choices[idx] ?? q.answer;
  }
  if (q.type === 'short') return q.answer.split('|')[0];
  return q.answer;
}

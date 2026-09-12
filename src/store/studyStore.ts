import { create } from 'zustand';
import type { Progress, Question } from '../types';
import { isCorrect } from '../lib/grade';

const STORAGE_KEY = 'ece-motion-study:progress:v1';

const emptyProgress: Progress = {
  solved: {},
  attempts: {},
  wrongQueue: [],
  lastSeen: {},
};

function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...emptyProgress };
    const parsed = JSON.parse(raw) as Partial<Progress>;
    return {
      solved: parsed.solved ?? {},
      attempts: parsed.attempts ?? {},
      wrongQueue: parsed.wrongQueue ?? [],
      lastSeen: parsed.lastSeen ?? {},
    };
  } catch {
    return { ...emptyProgress };
  }
}

function saveProgress(p: Progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* localStorage 사용 불가 환경은 무시 */
  }
}

interface StudyState {
  progress: Progress;
  /** 문제 채점 결과를 기록하고 정답 여부 반환 */
  submit: (q: Question, userAnswer: string) => boolean;
  /** 복습 큐에서 문제 제거 */
  clearFromReview: (questionId: string) => void;
  /** 모든 진도 초기화 */
  reset: () => void;
}

export const useStudyStore = create<StudyState>((set, get) => ({
  progress: loadProgress(),

  submit: (q, userAnswer) => {
    const correct = isCorrect(q, userAnswer);
    const p = get().progress;
    const wrongQueue = new Set(p.wrongQueue);
    if (correct) wrongQueue.delete(q.id);
    else wrongQueue.add(q.id);

    const next: Progress = {
      solved: { ...p.solved, [q.id]: correct },
      attempts: { ...p.attempts, [q.id]: (p.attempts[q.id] ?? 0) + 1 },
      wrongQueue: [...wrongQueue],
      lastSeen: { ...p.lastSeen, [q.id]: Date.now() },
    };
    saveProgress(next);
    set({ progress: next });
    return correct;
  },

  clearFromReview: (questionId) => {
    const p = get().progress;
    const next: Progress = {
      ...p,
      wrongQueue: p.wrongQueue.filter((id) => id !== questionId),
    };
    saveProgress(next);
    set({ progress: next });
  },

  reset: () => {
    saveProgress(emptyProgress);
    set({ progress: { ...emptyProgress } });
  },
}));

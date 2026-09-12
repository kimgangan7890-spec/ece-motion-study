import { useState } from 'react';
import { QUESTIONS } from '../data/questions';
import { categoryMeta } from '../lib/categories';
import { useStudyStore } from '../store/studyStore';
import { QuestionRunner } from './QuestionRunner';

const qById = new Map(QUESTIONS.map((q) => [q.id, q]));

export function ReviewView({ onGoQuiz }: { onGoQuiz: () => void }) {
  const progress = useStudyStore((s) => s.progress);
  const clearFromReview = useStudyStore((s) => s.clearFromReview);
  const reset = useStudyStore((s) => s.reset);
  const [running, setRunning] = useState(false);

  const wrongQuestions = progress.wrongQueue
    .map((id) => qById.get(id))
    .filter((q): q is NonNullable<typeof q> => !!q);

  const solvedCount = Object.keys(progress.solved).length;
  const correctCount = Object.values(progress.solved).filter(Boolean).length;
  const accuracy = solvedCount ? Math.round((correctCount / solvedCount) * 100) : 0;

  // 복습 세션 진행 중
  if (running && wrongQuestions.length > 0) {
    return (
      <QuestionRunner
        questions={wrongQuestions}
        onGraded={(q, correct) => {
          if (correct) clearFromReview(q.id);
        }}
        onFinish={() => setRunning(false)}
      />
    );
  }

  return (
    <>
      <div className="section-head">
        <h2>약점 복습</h2>
        <p>틀린 문제가 자동으로 모입니다. 다시 맞히면 목록에서 사라져요.</p>
      </div>

      {/* 통계 */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div className="row" style={{ gap: 24 }}>
          <div>
            <div className="big" style={{ fontSize: 34, fontWeight: 800, color: 'var(--navy)' }}>
              {accuracy}%
            </div>
            <div className="muted">누적 정답률</div>
          </div>
          <div>
            <div className="stat">
              푼 문제 <b>{solvedCount}</b> / 전체 {QUESTIONS.length}
            </div>
            <div className="stat">
              복습 대기 <b>{wrongQuestions.length}</b>문항
            </div>
          </div>
        </div>
        {solvedCount > 0 && (
          <div style={{ marginTop: 14 }}>
            <button
              className="link"
              onClick={() => {
                if (confirm('학습 기록(정답률·복습 목록)을 모두 초기화할까요?')) reset();
              }}
            >
              기록 초기화
            </button>
          </div>
        )}
      </div>

      {wrongQuestions.length === 0 ? (
        <div className="empty">
          <div className="emoji">🎉</div>
          <p>복습할 문제가 없어요.</p>
          <button className="btn ghost" onClick={onGoQuiz}>
            문제 풀러 가기
          </button>
        </div>
      ) : (
        <>
          <div className="row" style={{ marginBottom: 14 }}>
            <button className="btn primary" onClick={() => setRunning(true)}>
              복습 시작 ({wrongQuestions.length}문항)
            </button>
          </div>
          {wrongQuestions.map((q) => {
            const cat = categoryMeta(q.category);
            return (
              <div className="card" key={q.id} style={{ marginBottom: 10 }}>
                <div className="review-item">
                  <div>
                    <span className="pill" style={{ color: cat.color, marginBottom: 6 }}>
                      {cat.label}
                    </span>
                    <div className="q" style={{ marginTop: 6 }}>
                      {q.prompt}
                    </div>
                  </div>
                  <button className="link" onClick={() => clearFromReview(q.id)}>
                    제외
                  </button>
                </div>
              </div>
            );
          })}
        </>
      )}
    </>
  );
}

import { useState } from 'react';
import { answerText } from '../lib/grade';
import { useStudyStore } from '../store/studyStore';
import type { Question } from '../types';

interface Props {
  questions: Question[];
  onFinish: (results: Record<string, boolean>) => void;
  /** 각 문항 채점 직후 콜백 (복습 탭에서 큐 정리용) */
  onGraded?: (q: Question, correct: boolean) => void;
}

const LV_LABEL = ['쉬움', '보통', '어려움'];

export function QuestionRunner({ questions, onFinish, onGraded }: Props) {
  const submit = useStudyStore((s) => s.submit);
  const [idx, setIdx] = useState(0);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [answered, setAnswered] = useState<{ correct: boolean; picked: string } | null>(null);
  const [shortInput, setShortInput] = useState('');

  const q = questions[idx];
  if (!q) return null;

  function grade(picked: string) {
    if (answered) return;
    const correct = submit(q, picked);
    setAnswered({ correct, picked });
    onGraded?.(q, correct);
  }

  function next() {
    const merged = { ...results, [q.id]: answered!.correct };
    setResults(merged);
    setAnswered(null);
    setShortInput('');
    if (idx + 1 >= questions.length) {
      onFinish(merged);
    } else {
      setIdx(idx + 1);
    }
  }

  const pct = Math.round(((idx + (answered ? 1 : 0)) / questions.length) * 100);

  return (
    <>
      <div className="section-head" style={{ marginBottom: 6 }}>
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <span className="muted">
            {idx + 1} / {questions.length}
          </span>
          <span className={'pill lv' + q.level}>{LV_LABEL[q.level - 1]}</span>
        </div>
      </div>
      <div className="progress-bar">
        <span style={{ width: pct + '%' }} />
      </div>

      <div className="card">
        <div className="q-prompt">{q.prompt}</div>

        {/* MCQ */}
        {q.type === 'mcq' && q.choices && (
          <div className="choices">
            {q.choices.map((choice, i) => {
              let cls = 'choice';
              if (answered) {
                if (String(i) === q.answer) cls += ' correct';
                else if (answered.picked === String(i)) cls += ' wrong';
              }
              return (
                <button
                  key={i}
                  className={cls}
                  disabled={!!answered}
                  onClick={() => grade(String(i))}
                >
                  <span className="key">{String.fromCharCode(65 + i)}</span>
                  <span>{choice}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* OX */}
        {q.type === 'ox' && (
          <div className="choices" style={{ flexDirection: 'row' }}>
            {(['O', 'X'] as const).map((v) => {
              let cls = 'choice';
              cls += ' ' + 'ox';
              if (answered) {
                if (v === q.answer) cls += ' correct';
                else if (answered.picked === v) cls += ' wrong';
              }
              return (
                <button
                  key={v}
                  className={cls}
                  style={{ flex: 1, justifyContent: 'center', fontSize: 22, fontWeight: 800 }}
                  disabled={!!answered}
                  onClick={() => grade(v)}
                >
                  {v}
                </button>
              );
            })}
          </div>
        )}

        {/* SHORT */}
        {q.type === 'short' && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!answered && shortInput.trim()) grade(shortInput.trim());
            }}
          >
            <input
              className="short-input"
              placeholder="정답을 입력하고 Enter"
              value={shortInput}
              onChange={(e) => setShortInput(e.target.value)}
              disabled={!!answered}
              autoFocus
            />
            {!answered && (
              <button
                className="btn primary"
                type="submit"
                style={{ marginTop: 12 }}
                disabled={!shortInput.trim()}
              >
                제출
              </button>
            )}
          </form>
        )}

        {/* Verdict */}
        {answered && (
          <>
            <div className={'verdict ' + (answered.correct ? 'ok' : 'no')}>
              <div className="head">{answered.correct ? '정답입니다 ✓' : '오답입니다 ✗'}</div>
              {!answered.correct && (
                <div>
                  정답: <b>{answerText(q)}</b>
                </div>
              )}
              <div style={{ marginTop: 4 }}>{q.explanation}</div>
            </div>
            <div className="q-foot">
              <span />
              <button className="btn primary" onClick={next}>
                {idx + 1 >= questions.length ? '결과 보기' : '다음 문제'}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

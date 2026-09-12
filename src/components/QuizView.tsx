import { useMemo, useState } from 'react';
import { QUESTIONS } from '../data/questions';
import { CATEGORIES } from '../lib/categories';
import { answerText } from '../lib/grade';
import type { Category, Question } from '../types';
import { QuestionRunner } from './QuestionRunner';

type Phase = 'setup' | 'running' | 'done';
type CountOpt = 5 | 10 | 20 | 0; // 0 = 전체

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function QuizView() {
  const [phase, setPhase] = useState<Phase>('setup');
  const [cats, setCats] = useState<Set<Category>>(new Set(CATEGORIES.map((c) => c.id)));
  const [levels, setLevels] = useState<Set<number>>(new Set([1, 2, 3]));
  const [count, setCount] = useState<CountOpt>(10);
  const [set, setSet] = useState<Question[]>([]);
  const [results, setResults] = useState<Record<string, boolean>>({});

  const pool = useMemo(
    () => QUESTIONS.filter((q) => cats.has(q.category) && levels.has(q.level)),
    [cats, levels],
  );

  function toggle<T>(s: Set<T>, v: T): Set<T> {
    const n = new Set(s);
    n.has(v) ? n.delete(v) : n.add(v);
    return n;
  }

  function start() {
    const shuffled = shuffle(pool);
    const picked = count === 0 ? shuffled : shuffled.slice(0, count);
    setSet(picked);
    setResults({});
    setPhase('running');
  }

  // ── SETUP ──────────────────────────────────
  if (phase === 'setup') {
    return (
      <>
        <div className="section-head">
          <h2>문제 출제</h2>
          <p>단원·난이도·문항 수를 고르면 모의시험 세트를 만들어 드려요.</p>
        </div>

        <div className="card">
          <div className="field">
            <label>단원</label>
            <div className="chips">
              <button
                className={'chip' + (cats.size === CATEGORIES.length ? ' on' : '')}
                onClick={() =>
                  setCats(
                    cats.size === CATEGORIES.length
                      ? new Set()
                      : new Set(CATEGORIES.map((c) => c.id)),
                  )
                }
              >
                전체
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  className={'chip' + (cats.has(c.id) ? ' on' : '')}
                  onClick={() => setCats(toggle(cats, c.id))}
                >
                  {c.order}. {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>난이도</label>
            <div className="chips">
              {[1, 2, 3].map((lv) => (
                <button
                  key={lv}
                  className={'chip' + (levels.has(lv) ? ' on' : '')}
                  onClick={() => setLevels(toggle(levels, lv))}
                >
                  {['쉬움', '보통', '어려움'][lv - 1]}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label>문항 수</label>
            <div className="chips">
              {([5, 10, 20, 0] as CountOpt[]).map((n) => (
                <button
                  key={n}
                  className={'chip' + (count === n ? ' on' : '')}
                  onClick={() => setCount(n)}
                >
                  {n === 0 ? '전체' : `${n}문항`}
                </button>
              ))}
            </div>
          </div>

          <div className="q-foot">
            <span className="muted">출제 가능: {pool.length}문항</span>
            <button className="btn primary" disabled={pool.length === 0} onClick={start}>
              시험 시작
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── RUNNING ────────────────────────────────
  if (phase === 'running') {
    return (
      <QuestionRunner
        questions={set}
        onFinish={(res) => {
          setResults(res);
          setPhase('done');
        }}
      />
    );
  }

  // ── DONE ───────────────────────────────────
  const total = set.length;
  const correct = Object.values(results).filter(Boolean).length;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const wrong = set.filter((q) => results[q.id] === false);

  return (
    <>
      <div className="section-head">
        <h2>시험 결과</h2>
      </div>
      <div className="card">
        <div className="score">
          <div className="big">{pct}%</div>
          <div className="label">
            {total}문항 중 {correct}문항 정답
          </div>
        </div>
      </div>

      {wrong.length > 0 && (
        <>
          <div className="section-head">
            <h2>틀린 문제 ({wrong.length})</h2>
            <p>복습 탭에 자동으로 담겼어요.</p>
          </div>
          {wrong.map((q) => (
            <div className="card" key={q.id} style={{ marginBottom: 10 }}>
              <div className="q-prompt" style={{ fontSize: 15 }}>
                {q.prompt}
              </div>
              <div className="verdict no" style={{ marginTop: 0 }}>
                <div>
                  정답: <b>{answerText(q)}</b>
                </div>
                <div style={{ marginTop: 4 }}>{q.explanation}</div>
              </div>
            </div>
          ))}
        </>
      )}

      <div className="row" style={{ marginTop: 20 }}>
        <button className="btn primary" onClick={() => setPhase('setup')}>
          새 시험 만들기
        </button>
      </div>
    </>
  );
}

import { useState } from 'react';
import { CONCEPTS } from '../data/concepts';
import { QUESTIONS } from '../data/questions';
import { CATEGORIES, categoryMeta } from '../lib/categories';
import type { Concept } from '../types';

export function ConceptView() {
  const [selected, setSelected] = useState<Concept | null>(null);

  if (selected) {
    return <ConceptDetail concept={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <>
      <div className="section-head">
        <h2>단원별 개념</h2>
        <p>7개 단원 · 개념 {CONCEPTS.length}개. 단원을 눌러 개념을 읽어보세요.</p>
      </div>
      {CATEGORIES.map((cat) => {
        const items = CONCEPTS.filter((c) => c.category === cat.id);
        if (items.length === 0) return null;
        return (
          <div key={cat.id} style={{ marginBottom: 22 }}>
            <div
              style={{
                fontWeight: 800,
                fontSize: 15,
                color: cat.color,
                margin: '6px 0 10px',
              }}
            >
              {cat.order}. {cat.label}
            </div>
            <div className="grid">
              {items.map((c) => (
                <button
                  key={c.id}
                  className="card cat-card"
                  style={{ ['--cat' as string]: cat.color }}
                  onClick={() => setSelected(c)}
                >
                  <div className="name">{c.title}</div>
                  <div className="desc">{firstLine(c.body)}</div>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

function firstLine(body: string): string {
  const line = body.split('\n')[0];
  return line.length > 64 ? line.slice(0, 64) + '…' : line;
}

function ConceptDetail({ concept, onBack }: { concept: Concept; onBack: () => void }) {
  const cat = categoryMeta(concept.category);
  const related = QUESTIONS.filter((q) => q.conceptId === concept.id);

  return (
    <>
      <div style={{ marginTop: 20 }}>
        <button className="back" onClick={onBack}>
          ← 개념 목록
        </button>
      </div>
      <div className="card" style={{ marginTop: 8 }}>
        <span className="pill" style={{ background: '#eef1f6', color: cat.color }}>
          {cat.order}. {cat.label}
        </span>
        <h2 style={{ margin: '12px 0 14px' }}>{concept.title}</h2>
        <div className="concept-body">{concept.body}</div>

        {concept.example && (
          <div className="example">
            <b>예시</b> — {concept.example}
          </div>
        )}

        {concept.keywords && concept.keywords.length > 0 && (
          <div className="keywords">
            {concept.keywords.map((k) => (
              <span key={k} className="pill">
                #{k}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="muted" style={{ marginTop: 14 }}>
        이 개념과 연결된 문제 {related.length}개 — 「문제 풀이」 탭에서 단원 선택 시 함께 출제됩니다.
      </div>
    </>
  );
}

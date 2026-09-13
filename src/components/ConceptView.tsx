import { useState } from 'react';
import { CONCEPTS } from '../data/concepts';
import { QUESTIONS } from '../data/questions';
import { relatedConcepts } from '../data/relations';
import { CATEGORIES, categoryMeta } from '../lib/categories';
import type { Concept } from '../types';

/** keyword가 해당 개념과 연관되는지: 키워드 목록/제목/본문에 포함되면 연관 */
function matchesKeyword(c: Concept, keyword: string): boolean {
  const k = keyword.toLowerCase();
  if (c.keywords?.some((kw) => kw.toLowerCase() === k)) return true;
  if (c.title.toLowerCase().includes(k)) return true;
  return c.body.toLowerCase().includes(k);
}

export function ConceptView() {
  const [selected, setSelected] = useState<Concept | null>(null);
  const [tag, setTag] = useState<string | null>(null);

  // 키워드 결과 화면
  if (tag && selected) {
    return (
      <TagResults
        tag={tag}
        origin={selected}
        onSelect={(c) => {
          setSelected(c);
          setTag(null);
        }}
        onBack={() => setTag(null)}
      />
    );
  }

  if (selected) {
    return (
      <ConceptDetail
        concept={selected}
        onBack={() => setSelected(null)}
        onKeyword={(k) => setTag(k)}
        onSelect={(c) => setSelected(c)}
      />
    );
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

/** 연결된 개념 카드 (관계 설명 포함) */
function ConceptLink({
  concept,
  note,
  onClick,
}: {
  concept: Concept;
  note?: string;
  onClick: () => void;
}) {
  const cat = categoryMeta(concept.category);
  return (
    <button
      className="card cat-card"
      style={{ ['--cat' as string]: cat.color }}
      onClick={onClick}
    >
      <div className="no">
        {cat.order}. {cat.label}
      </div>
      <div className="name">{concept.title}</div>
      {note && <div className="relation-note">↔ {note}</div>}
    </button>
  );
}

function ConceptDetail({
  concept,
  onBack,
  onKeyword,
  onSelect,
}: {
  concept: Concept;
  onBack: () => void;
  onKeyword: (keyword: string) => void;
  onSelect: (c: Concept) => void;
}) {
  const cat = categoryMeta(concept.category);
  const related = QUESTIONS.filter((q) => q.conceptId === concept.id);
  const links = relatedConcepts(concept.id);

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
              <button key={k} className="pill pill-btn" onClick={() => onKeyword(k)}>
                #{k}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 연결된 개념 (관계 그래프) */}
      {links.length > 0 && (
        <>
          <div className="section-head" style={{ marginBottom: 10 }}>
            <h2>🔗 연결된 개념 ({links.length})</h2>
            <p>이 개념이 다른 개념들과 어떻게 이어지는지 — 눌러서 이동하세요.</p>
          </div>
          <div className="grid">
            {links.map(({ concept: c, note }) => (
              <ConceptLink key={c.id} concept={c} note={note} onClick={() => onSelect(c)} />
            ))}
          </div>
        </>
      )}

      <div className="muted" style={{ marginTop: 16 }}>
        이 개념과 연결된 문제 {related.length}개 — 「문제 풀이」 탭에서 단원 선택 시 함께 출제됩니다.
      </div>
    </>
  );
}

function TagResults({
  tag,
  origin,
  onSelect,
  onBack,
}: {
  tag: string;
  origin: Concept;
  onSelect: (c: Concept) => void;
  onBack: () => void;
}) {
  const matches = CONCEPTS.filter((c) => c.id !== origin.id && matchesKeyword(c, tag));
  const fallback = matches.length === 0 ? relatedConcepts(origin.id) : [];

  return (
    <>
      <div style={{ marginTop: 20 }}>
        <button className="back" onClick={onBack}>
          ← 이전 개념으로
        </button>
      </div>
      <div className="section-head" style={{ marginTop: 8 }}>
        <h2>
          <span className="pill" style={{ fontSize: 14, verticalAlign: 'middle' }}>
            #{tag}
          </span>{' '}
          {matches.length > 0 ? '연관 개념' : '관련 개념'}
        </h2>
        {matches.length > 0 ? (
          <p>이 키워드를 다루는 다른 개념 {matches.length}개</p>
        ) : (
          <p>
            이 키워드를 직접 다루는 다른 개념은 없어요. 대신 <b>{origin.title}</b>와(과) 연결된 개념을
            보여드릴게요.
          </p>
        )}
      </div>

      {matches.length > 0 ? (
        <div className="grid">
          {matches.map((c) => (
            <ConceptLink key={c.id} concept={c} onClick={() => onSelect(c)} />
          ))}
        </div>
      ) : fallback.length > 0 ? (
        <div className="grid">
          {fallback.map(({ concept: c, note }) => (
            <ConceptLink key={c.id} concept={c} note={note} onClick={() => onSelect(c)} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <div className="emoji">🔍</div>
          <p>연관된 개념을 찾지 못했어요.</p>
          <button className="btn ghost" onClick={onBack}>
            돌아가기
          </button>
        </div>
      )}
    </>
  );
}

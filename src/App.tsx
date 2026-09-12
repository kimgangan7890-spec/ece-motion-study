import { useState } from 'react';
import { ConceptView } from './components/ConceptView';
import { QuizView } from './components/QuizView';
import { ReviewView } from './components/ReviewView';
import { useStudyStore } from './store/studyStore';

type Tab = 'learn' | 'quiz' | 'review';

const TABS: { id: Tab; label: string }[] = [
  { id: 'learn', label: '개념 학습' },
  { id: 'quiz', label: '문제 풀이' },
  { id: 'review', label: '복습' },
];

export function App() {
  const [tab, setTab] = useState<Tab>('learn');
  const wrongCount = useStudyStore((s) => s.progress.wrongQueue.length);

  return (
    <div className="app">
      <header className="top">
        <h1>유아동작교육 이론 학습</h1>
        <p className="sub">개념 학습 · 문제 풀이 · 약점 복습 — 유아교육과 '유아동작 교육' 시험 대비</p>
        <nav className="tabs">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={'tab' + (tab === t.id ? ' active' : '')}
              onClick={() => setTab(t.id)}
            >
              {t.label}
              {t.id === 'review' && wrongCount > 0 ? ` (${wrongCount})` : ''}
            </button>
          ))}
        </nav>
      </header>

      {tab === 'learn' && <ConceptView />}
      {tab === 'quiz' && <QuizView />}
      {tab === 'review' && <ReviewView onGoQuiz={() => setTab('quiz')} />}
    </div>
  );
}

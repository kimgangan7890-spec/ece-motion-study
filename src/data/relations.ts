import { CONCEPTS } from './concepts';
import type { Concept } from '../types';

/**
 * 개념 간 관계 그래프 (무방향).
 * [개념A, 개념B, 관계 설명] — 두 개념이 어떻게 연결/영향을 주는지 설명.
 * 한 줄만 정의하면 양방향으로 자동 연결된다.
 */
const EDGES: [string, string, string][] = [
  // 동작교육의 기초
  ['basics-concept', 'basics-purpose', '개념이 구체적인 목적·교육적 가치로 확장된다'],
  ['basics-concept', 'basics-approach', "'신체를 통한 교육' 관점이 이 개념의 바탕이 된다"],
  ['basics-concept', 'basics-domains', '개념이 4개 내용 영역으로 구체화된다'],
  ['basics-concept', 'dev-piaget', "'움직임을 통한 학습'의 이론적 근거(감각운동기)"],
  ['basics-approach', 'basics-domains', '관점이 내용 영역 구성에 반영된다'],
  ['basics-purpose', 'dev-gallahue', '유아기가 기본 움직임 형성의 결정적 시기'],
  ['basics-domains', 'fund-locomotor', '기본 움직임 영역 = 이동·비이동·조작'],
  ['basics-domains', 'perc-elements', '지각-운동이 동작교육의 한 영역'],
  ['basics-domains', 'laban-elements', '창의적 표현(율동)을 라반 요소로 지도'],

  // 운동발달 이론
  ['dev-gallahue', 'dev-gesell', '성숙(maturation) 관점을 공유'],
  ['dev-gallahue', 'fund-stages', '기본 움직임 단계에서 각 기술이 3단계로 성숙'],
  ['dev-gallahue', 'fund-locomotor', '기본 움직임 단계에서 익히는 기술들'],
  ['dev-gallahue', 'dev-general-principles', '발달 원리가 단계 이론에 반영'],
  ['dev-gesell', 'dev-principles', '성숙에 따라 정해진 방향으로 발달'],
  ['dev-principles', 'dev-general-principles', '방향성이 일반 발달 원리의 하나'],
  ['dev-principles', 'dev-fine-motor', '대근육 → 소근육 원리의 사례'],
  ['dev-piaget', 'dev-kephart', '운동이 인지·지각의 기초라는 관점 공유'],
  ['dev-kephart', 'perc-elements', '지각-운동 발달의 이론적 근거'],
  ['dev-fine-motor', 'perc-coordination', '소근육 발달은 눈-손 협응과 함께'],
  ['dev-fine-motor', 'fund-manipulative', '소근육·협응이 조작운동의 바탕'],

  // 기본 움직임 기술
  ['fund-locomotor', 'fund-nonlocomotor', '기본 움직임의 세 유형 중 둘'],
  ['fund-nonlocomotor', 'fund-manipulative', '기본 움직임의 세 유형'],
  ['fund-nonlocomotor', 'fund-stability', '비이동운동 = 안정성(균형) 능력'],
  ['fund-manipulative', 'perc-coordination', '조작운동의 핵심은 눈-손/눈-발 협응'],
  ['fund-manipulative', 'plan-materials', '공·콩주머니 등 교구로 지도'],
  ['fund-stages', 'fund-locomotor', '이동 기술도 초보→초급→성숙으로 발달'],
  ['fund-locomotor', 'laban-space', '이동운동은 일반공간을 사용'],
  ['fund-stability', 'perc-coordination', '균형·안정성에 지각-운동 협응이 관여'],

  // 라반 움직임 분석
  ['laban-elements', 'laban-body', '라반 4요소 중 신체(Body)'],
  ['laban-elements', 'laban-space', '라반 4요소 중 공간(Space)'],
  ['laban-elements', 'laban-effort', '라반 4요소 중 노력(Effort)'],
  ['laban-elements', 'laban-relationship', '라반 4요소 중 관계(Relationship)'],
  ['laban-space', 'perc-elements', '공간(Space)이 공간지각과 연결'],
  ['laban-body', 'perc-body-awareness', '신체(Body) 요소가 신체지각과 연결'],
  ['laban-effort', 'plan-materials', '리본·스카프로 노력(흐름) 요소 표현'],
  ['laban-effort', 'perc-temporal', '노력의 시간(빠름/느림)이 시간지각과 연결'],
  ['laban-relationship', 'plan-grouping', '사람과의 관계 = 짝·집단 활동'],
  ['laban-relationship', 'plan-materials', '사물과의 관계 = 후프 안/밖'],

  // 지각-운동 발달
  ['perc-elements', 'perc-laterality', '지각-운동 요소 중 방향지각(편측성)'],
  ['perc-elements', 'perc-body-awareness', '지각-운동 요소 중 신체지각'],
  ['perc-elements', 'perc-coordination', '지각-운동에 협응이 포함'],
  ['perc-elements', 'perc-temporal', '지각-운동 요소 중 시간지각'],
  ['perc-laterality', 'perc-body-awareness', '좌우 인식이 신체지각의 일부'],

  // 교수-학습 방법
  ['teach-direct-indirect', 'teach-exploration', '간접적 교수의 진행 흐름(탐색-발견-창작)'],
  ['teach-direct-indirect', 'teach-mosston', '교사↔학습자 중심 연속선'],
  ['teach-direct-indirect', 'teach-role', '직접/간접에 따라 교사 역할이 달라짐'],
  ['teach-exploration', 'teach-questioning', '발문으로 탐색·발견을 안내'],
  ['teach-exploration', 'teach-mosston', '유도발견형이 탐색-발견과 통함'],
  ['teach-role', 'teach-questioning', '교사가 발문으로 안내하는 역할'],
  ['teach-principles', 'teach-role', '지도 원리가 교사 역할로 실행'],
  ['teach-principles', 'plan-considerations', '지도 원리를 프로그램 계획에 반영'],

  // 프로그램 계획 및 평가
  ['plan-structure', 'plan-evaluation', '정리 단계에서 활동 회상·평가'],
  ['plan-structure', 'plan-considerations', '도입-전개-정리 구성 계획'],
  ['plan-considerations', 'plan-materials', '공간·교구가 계획의 고려사항'],
  ['plan-considerations', 'plan-grouping', '활동 조직 형태가 계획의 고려사항'],
  ['plan-evaluation', 'plan-considerations', '평가 결과를 다음 계획에 반영'],
];

export interface RelatedConcept {
  concept: Concept;
  note: string;
}

const byId = new Map(CONCEPTS.map((c) => [c.id, c]));

const adjacency = new Map<string, { id: string; note: string }[]>();
function addEdge(from: string, to: string, note: string) {
  if (!adjacency.has(from)) adjacency.set(from, []);
  adjacency.get(from)!.push({ id: to, note });
}
for (const [a, b, note] of EDGES) {
  if (!byId.has(a) || !byId.has(b)) continue; // 오타 방어
  addEdge(a, b, note);
  addEdge(b, a, note);
}

/** 특정 개념과 연결된 개념들(관계 설명 포함) 반환 */
export function relatedConcepts(conceptId: string): RelatedConcept[] {
  const list = adjacency.get(conceptId) ?? [];
  const out: RelatedConcept[] = [];
  for (const { id, note } of list) {
    const concept = byId.get(id);
    if (concept) out.push({ concept, note });
  }
  return out;
}

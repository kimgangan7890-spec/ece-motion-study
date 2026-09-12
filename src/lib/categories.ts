import type { Category } from '../types';

export interface CategoryMeta {
  id: Category;
  /** 단원 번호 */
  order: number;
  label: string;
  /** 한 줄 설명 */
  desc: string;
  /** UI 강조색 (액센트) */
  color: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    id: 'basics',
    order: 1,
    label: '동작교육의 기초',
    desc: '개념·목적·필요성·교육적 가치',
    color: '#c0392b',
  },
  {
    id: 'development',
    order: 2,
    label: '유아 운동발달 이론',
    desc: '게젤·피아제·갤러휴 운동발달 단계',
    color: '#d35400',
  },
  {
    id: 'fundamental',
    order: 3,
    label: '기본 움직임 기술',
    desc: '이동·비이동·조작 운동',
    color: '#c99700',
  },
  {
    id: 'laban',
    order: 4,
    label: '라반 움직임 분석',
    desc: '신체·공간·노력·관계',
    color: '#2e7d32',
  },
  {
    id: 'perceptual',
    order: 5,
    label: '지각-운동 발달',
    desc: '신체·공간·방향·시간 지각',
    color: '#1565c0',
  },
  {
    id: 'teaching',
    order: 6,
    label: '교수-학습 방법',
    desc: '직접적·간접적 교수법, 문제해결식',
    color: '#5e35b1',
  },
  {
    id: 'planning',
    order: 7,
    label: '프로그램 계획 및 평가',
    desc: '수업 설계·관찰·평가',
    color: '#8e24aa',
  },
];

const byId = new Map(CATEGORIES.map((c) => [c.id, c]));

export function categoryMeta(id: Category): CategoryMeta {
  return byId.get(id)!;
}

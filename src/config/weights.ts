import type { DimensionWeights, ScoreBand } from '../types';

/** Initial dimension weights (must sum to 100). */
export const DEFAULT_WEIGHTS: DimensionWeights = {
  dispersion: 15,
  volLiquidity: 20,
  termTail: 25,
  putCall: 15,
  dealer: 25,
};

export const SCORE_BANDS: ScoreBand[] = [
  {
    id: 'calm',
    label: 'Calm',
    labelZh: '平稳',
    min: 0,
    max: 29,
    color: '#1A7F37',
  },
  {
    id: 'elevated',
    label: 'Elevated',
    labelZh: '抬升',
    min: 30,
    max: 49,
    color: '#B45309',
  },
  {
    id: 'stressed',
    label: 'Stressed',
    labelZh: '承压',
    min: 50,
    max: 69,
    color: '#C2410C',
  },
  {
    id: 'fragile',
    label: 'Fragile',
    labelZh: '脆弱加速',
    min: 70,
    max: 84,
    color: '#B91C1C',
  },
  {
    id: 'extreme',
    label: 'Extreme',
    labelZh: '极端',
    min: 85,
    max: 100,
    color: '#7F1D1D',
  },
];

export const SCORE_DISCLAIMER =
  '综合评分反映微观结构与流动性压力的加权合成，不可解释为崩盘概率或交易建议。Composite score is not crash probability.';

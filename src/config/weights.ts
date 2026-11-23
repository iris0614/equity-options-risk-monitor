import type { DimensionWeights, ScoreBand } from '../types';

/**
 * Original-site formula caps (display / documentation):
 * vol 25 + term 15 + dealer 30 + dispersion 15 + put/call 15 = 100.
 * Kickoff brief 15/20/25/15/25 is NOT used — original site takes precedence.
 */
export const DEFAULT_WEIGHTS: DimensionWeights = {
  volLiquidity: 25,
  termTail: 15,
  dealer: 30,
  dispersion: 15,
  putCall: 15,
};

/** Original colour bands: ≥70 red, ≥40 amber, <40 green. */
export const SCORE_BANDS: ScoreBand[] = [
  {
    id: 'calm',
    label: 'Calm',
    labelZh: '平稳',
    min: 0,
    max: 39,
    color: '#1A7F37',
  },
  {
    id: 'elevated',
    label: 'Elevated',
    labelZh: '抬升',
    min: 40,
    max: 69,
    color: '#B45309',
  },
  {
    id: 'stressed',
    label: 'Stressed',
    labelZh: '高压',
    min: 70,
    max: 100,
    color: '#B91C1C',
  },
];

export const SCORE_DISCLAIMER =
  '仅用于机构微观结构逻辑推演与复盘参考，不构成投资建议。综合评分不可解释为崩盘概率。';

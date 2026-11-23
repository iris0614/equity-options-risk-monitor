import { INDICATOR_DEFS, DIMENSION_LABELS } from '../config/indicators';
import { SCORE_BANDS, SCORE_DISCLAIMER } from '../config/weights';
import type {
  CompositeScore,
  DimensionEval,
  DimensionId,
  DimensionWeights,
  IndicatorEval,
  IndicatorId,
  IndicatorSnapshot,
  ScoreBand,
  ScoreTraceLine,
  ThresholdBand,
} from '../types';
import { evalStatus, normalizeToStress } from './thresholds';

const DIM_ORDER: DimensionId[] = [
  'dispersion',
  'volLiquidity',
  'termTail',
  'putCall',
  'dealer',
];

function bandForScore(score: number): ScoreBand {
  const found = SCORE_BANDS.find((b) => score >= b.min && score <= b.max);
  return found ?? SCORE_BANDS[SCORE_BANDS.length - 1]!;
}

function softRange(id: IndicatorId): { min: number; max: number } {
  const def = INDICATOR_DEFS.find((d) => d.id === id)!;
  return { min: def.min, max: def.max };
}

function evalIndicator(
  id: IndicatorId,
  snap: IndicatorSnapshot,
  thresholds: Record<IndicatorId, ThresholdBand>,
): IndicatorEval {
  const band = thresholds[id];
  const value = snap[id]?.value ?? null;
  const status = evalStatus(value, band);
  const range = softRange(id);
  const normalized = normalizeToStress(value, band, range.min, range.max);
  let note = '';
  if (status === 'na') note = '数据缺失 → N/A';
  else if (status === 'triggered') note = '触发红线';
  else if (status === 'warning') note = '警戒';
  else note = '正常';

  // SKEW special note: never alone define crisis
  if (id === 'skew' && status !== 'na') {
    const vix = snap.vix?.value;
    if (vix !== null && vix !== undefined && vix < 20 && status === 'triggered') {
      note += '（SKEW 高但 VIX 低 — 勿单独解读为危机）';
    } else if (
      vix !== null &&
      vix !== undefined &&
      vix >= 22 &&
      status !== 'normal'
    ) {
      note += '（结合 VIX 抬升 — 尾部防御特征）';
    }
  }

  // Vanna: never assume vol↑⇒sell
  if (id === 'vannaSign' && value !== null) {
    if (value < 0) note = '波动↑倾向卖压（头寸依赖，非默认）';
    else if (value > 0) note = '波动↑倾向买盘（多头 Vanna）';
    else note = 'Vanna 中性';
  }

  return {
    id,
    value,
    status,
    contribution: normalized,
    normalized,
    threshold: band,
    note,
  };
}

function avg(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function worstStatus(
  statuses: IndicatorEval['status'][],
): IndicatorEval['status'] {
  if (statuses.includes('triggered')) return 'triggered';
  if (statuses.includes('warning')) return 'warning';
  if (statuses.every((s) => s === 'na')) return 'na';
  return 'normal';
}

export function computeCompositeScore(
  snap: IndicatorSnapshot,
  weights: DimensionWeights,
  thresholds: Record<IndicatorId, ThresholdBand>,
  asOf: string,
): CompositeScore {
  const dimensions: DimensionEval[] = DIM_ORDER.map((dimId) => {
    const defs = INDICATOR_DEFS.filter((d) => d.dimension === dimId);
    const indicators = defs.map((d) => evalIndicator(d.id, snap, thresholds));
    const norms = indicators
      .map((i) => i.normalized)
      .filter((n): n is number => n !== null);
    const score = avg(norms);
    return {
      id: dimId,
      label: `${DIMENSION_LABELS[dimId].zh} / ${DIMENSION_LABELS[dimId].en}`,
      weight: weights[dimId],
      score,
      status: worstStatus(indicators.map((i) => i.status)),
      indicators,
    };
  });

  const available = dimensions.filter((d) => d.score !== null);
  const weightSum = available.reduce((s, d) => s + d.weight, 0);

  let score: number | null = null;
  if (available.length > 0 && weightSum > 0) {
    const raw = available.reduce(
      (s, d) => s + (d.score as number) * d.weight,
      0,
    );
    score = Math.round((raw / weightSum) * 10) / 10;
  }

  const trace: ScoreTraceLine[] = dimensions.map((d) => {
    const weighted =
      d.score !== null && weightSum > 0
        ? Math.round(((d.score * d.weight) / weightSum) * 10) / 10
        : null;
    return {
      dimension: d.id,
      weight: d.weight,
      dimensionScore: d.score !== null ? Math.round(d.score * 10) / 10 : null,
      weighted,
      detail:
        d.score === null
          ? '维度无有效指标 → 不参与加权'
          : `${DIMENSION_LABELS[d.id].zh} 得分 ${d.score.toFixed(1)} × 权重 ${d.weight}% / 有效权重和 ${weightSum}% = ${weighted?.toFixed(1)}`,
    };
  });

  return {
    score,
    band: score !== null ? bandForScore(score) : null,
    dimensions,
    trace,
    asOf,
    disclaimer: SCORE_DISCLAIMER,
  };
}

export function formatScore(score: number | null): string {
  if (score === null) return 'N/A';
  return score.toFixed(score % 1 === 0 ? 0 : 1);
}

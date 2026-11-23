import { INDICATOR_DEFS, DIMENSION_LABELS } from '../config/indicators';
import { DEFAULT_WEIGHTS, SCORE_BANDS, SCORE_DISCLAIMER } from '../config/weights';
import { DEFAULT_THRESHOLDS } from '../config/thresholds';
import type {
  CompositeScore,
  DimensionEval,
  DimensionId,
  DimensionWeights,
  FlatState,
  IndicatorEval,
  IndicatorId,
  IndicatorSnapshot,
  ScoreBand,
  ScoreTraceLine,
  ThresholdBand,
} from '../types';
import { evalIndicatorStatus, toFlat } from './status';

function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

function num(v: number | null, fallback = 0): number {
  return v === null || Number.isNaN(v) ? fallback : v;
}

/**
 * Original computeStressIndex — exact formula.
 * Caps: vol25 + term15 + dealer30 + disp15 + flow15 = 100.
 * SKEW / DSPX / NVDA are display-only (not scored).
 */
export function computeStressIndex(s: FlatState): number | null {
  const required: IndicatorId[] = [
    'vix',
    'vvix',
    'vixVxv',
    'vix9dVix',
    'gex',
    'dealerGamma',
    'netDeltaFlow',
    'vixeqVix',
    'equityPc',
    'totalPc',
    'indexPc',
  ];
  if (required.some((id) => s[id] === null)) return null;

  const vixScore = clamp(((num(s.vix) - 14) / (36 - 14)) * 15, 0, 15);
  const vvixScore = clamp(((num(s.vvix) - 85) / (135 - 85)) * 10, 0, 10);

  const termScore1 = clamp(
    ((num(s.vixVxv) - 0.88) / (1.12 - 0.88)) * 9,
    0,
    9,
  );
  const termScore2 = clamp(
    ((num(s.vix9dVix) - 0.88) / (1.12 - 0.88)) * 6,
    0,
    6,
  );

  const gexScore = clamp(((20 - num(s.gex)) / 140) * 12, 0, 12);
  const dealerScore = clamp(((1 - num(s.dealerGamma)) / 10) * 10, 0, 10);
  const deltaScore = clamp(((20 - num(s.netDeltaFlow)) / 160) * 8, 0, 8);

  const dispScore = clamp(
    ((2.5 - num(s.vixeqVix)) / (2.5 - 1.35)) * 15,
    0,
    15,
  );

  const pcEqScore = clamp(((num(s.equityPc) - 0.5) / (0.9 - 0.5)) * 6, 0, 6);
  const pcTotScore = clamp(
    ((num(s.totalPc) - 0.8) / (1.35 - 0.8)) * 5,
    0,
    5,
  );
  const pcIdxScore = clamp(
    ((num(s.indexPc) - 1.0) / (1.4 - 1.0)) * 4,
    0,
    4,
  );

  const total =
    vixScore +
    vvixScore +
    termScore1 +
    termScore2 +
    gexScore +
    dealerScore +
    deltaScore +
    dispScore +
    pcEqScore +
    pcTotScore +
    pcIdxScore;

  return Math.round(clamp(total, 0, 100));
}

export function stressComponents(s: FlatState) {
  return [
    {
      name: 'VIX',
      points: clamp(((num(s.vix) - 14) / 22) * 15, 0, 15),
      cap: 15,
      dimension: 'volLiquidity' as DimensionId,
    },
    {
      name: 'VVIX',
      points: clamp(((num(s.vvix) - 85) / 50) * 10, 0, 10),
      cap: 10,
      dimension: 'volLiquidity' as DimensionId,
    },
    {
      name: 'VIX/VXV',
      points: clamp(((num(s.vixVxv) - 0.88) / 0.24) * 9, 0, 9),
      cap: 9,
      dimension: 'termTail' as DimensionId,
    },
    {
      name: 'VIX9D/VIX',
      points: clamp(((num(s.vix9dVix) - 0.88) / 0.24) * 6, 0, 6),
      cap: 6,
      dimension: 'termTail' as DimensionId,
    },
    {
      name: 'GEX',
      points: clamp(((20 - num(s.gex)) / 140) * 12, 0, 12),
      cap: 12,
      dimension: 'dealer' as DimensionId,
    },
    {
      name: 'DealerGamma',
      points: clamp(((1 - num(s.dealerGamma)) / 10) * 10, 0, 10),
      cap: 10,
      dimension: 'dealer' as DimensionId,
    },
    {
      name: 'NetDelta',
      points: clamp(((20 - num(s.netDeltaFlow)) / 160) * 8, 0, 8),
      cap: 8,
      dimension: 'dealer' as DimensionId,
    },
    {
      name: 'VIXEQ/VIX',
      points: clamp(((2.5 - num(s.vixeqVix)) / 1.15) * 15, 0, 15),
      cap: 15,
      dimension: 'dispersion' as DimensionId,
    },
    {
      name: 'EquityP/C',
      points: clamp(((num(s.equityPc) - 0.5) / 0.4) * 6, 0, 6),
      cap: 6,
      dimension: 'putCall' as DimensionId,
    },
    {
      name: 'TotalP/C',
      points: clamp(((num(s.totalPc) - 0.8) / 0.55) * 5, 0, 5),
      cap: 5,
      dimension: 'putCall' as DimensionId,
    },
    {
      name: 'IndexP/C',
      points: clamp(((num(s.indexPc) - 1.0) / 0.4) * 4, 0, 4),
      cap: 4,
      dimension: 'putCall' as DimensionId,
    },
  ];
}

function bandForScore(score: number): ScoreBand {
  const found = SCORE_BANDS.find((b) => score >= b.min && score <= b.max);
  return found ?? SCORE_BANDS[SCORE_BANDS.length - 1]!;
}

const DIM_ORDER: DimensionId[] = [
  'dispersion',
  'volLiquidity',
  'termTail',
  'putCall',
  'dealer',
];

export function computeCompositeScore(
  snap: IndicatorSnapshot,
  weights: DimensionWeights = DEFAULT_WEIGHTS,
  _thresholds: Record<IndicatorId, ThresholdBand> = DEFAULT_THRESHOLDS,
  asOf: string,
): CompositeScore {
  const flat = toFlat(snap);
  const score = computeStressIndex(flat);
  const comps = stressComponents(flat);

  const dimensions: DimensionEval[] = DIM_ORDER.map((dimId) => {
    const defs = INDICATOR_DEFS.filter((d) => d.dimension === dimId);
    const indicators: IndicatorEval[] = defs.map((d) => {
      const status = evalIndicatorStatus(d.id, flat);
      const value = flat[d.id];
      let note = '';
      if (status === 'na') note = '数据缺失 → N/A';
      else if (status === 'triggered') note = '触发红线';
      else if (status === 'warning') note = '警戒';
      else note = '正常';
      if (d.id === 'skew' && status !== 'na') {
        note += '（不参与综合分；须结合 VIX）';
      }
      if (
        (d.id === 'dspx' || d.id === 'nvdaProxy') &&
        status !== 'na'
      ) {
        note += '（不参与综合分）';
      }
      return {
        id: d.id,
        value,
        status,
        contribution: null,
        normalized: null,
        threshold: _thresholds[d.id],
        note,
      };
    });

    const dimComps = comps.filter((c) => c.dimension === dimId);
    const dimPoints = dimComps.reduce((a, c) => a + c.points, 0);
    const dimCap = dimComps.reduce((a, c) => a + c.cap, 0) || 1;
    const dimScore =
      dimComps.length === 0
        ? null
        : Math.round((dimPoints / dimCap) * 1000) / 10;

    const statuses = indicators.map((i) => i.status);
    const status: IndicatorEval['status'] = statuses.includes('triggered')
      ? 'triggered'
      : statuses.includes('warning')
        ? 'warning'
        : statuses.every((s) => s === 'na')
          ? 'na'
          : 'normal';

    return {
      id: dimId,
      label: `${DIMENSION_LABELS[dimId].zh}`,
      weight: weights[dimId],
      score: dimScore,
      status,
      indicators,
    };
  });

  const trace: ScoreTraceLine[] = dimensions.map((d) => {
    const dimComps = comps.filter((c) => c.dimension === d.id);
    const pts = dimComps.reduce((a, c) => a + c.points, 0);
    return {
      dimension: d.id,
      weight: d.weight,
      dimensionScore: d.score,
      weighted: Math.round(pts * 10) / 10,
      detail: `${DIMENSION_LABELS[d.id].zh} 贡献 ${pts.toFixed(1)} / 权重上限 ${d.weight}`,
    };
  });

  return {
    score,
    band: score !== null ? bandForScore(score) : null,
    dimensions,
    trace,
    components: comps.map((c) => ({
      name: c.name,
      points: Math.round(c.points * 100) / 100,
      cap: c.cap,
    })),
    asOf,
    disclaimer: SCORE_DISCLAIMER,
  };
}

export function formatScore(score: number | null): string {
  if (score === null) return 'N/A';
  return String(score);
}

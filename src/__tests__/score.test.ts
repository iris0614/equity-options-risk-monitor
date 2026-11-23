import { describe, expect, it } from 'vitest';
import { computeCompositeScore } from '../engine/score';
import { DEFAULT_WEIGHTS } from '../config/weights';
import { DEFAULT_THRESHOLDS } from '../config/thresholds';
import { snapshotFromScenario } from '../data/baseline';
import type { IndicatorSnapshot } from '../types';
import { INDICATOR_DEFS } from '../config/indicators';

function emptySnap(): IndicatorSnapshot {
  const out = {} as IndicatorSnapshot;
  for (const d of INDICATOR_DEFS) {
    out[d.id] = {
      id: d.id,
      value: null,
      simulated: true,
      asOf: '',
    };
  }
  return out;
}

describe('computeCompositeScore', () => {
  it('scores baseline in fragile band (~70–84)', () => {
    const snap = snapshotFromScenario('baseline');
    const result = computeCompositeScore(
      snap,
      DEFAULT_WEIGHTS,
      DEFAULT_THRESHOLDS,
      snap.vix.asOf,
    );
    expect(result.score).not.toBeNull();
    expect(result.score!).toBeGreaterThanOrEqual(70);
    expect(result.score!).toBeLessThanOrEqual(84);
    expect(result.band?.id).toBe('fragile');
    expect(result.trace).toHaveLength(5);
    expect(result.disclaimer).toMatch(/崩盘概率|crash probability/i);
  });

  it('returns N/A when all indicators missing', () => {
    const result = computeCompositeScore(
      emptySnap(),
      DEFAULT_WEIGHTS,
      DEFAULT_THRESHOLDS,
      '',
    );
    expect(result.score).toBeNull();
    expect(result.band).toBeNull();
  });

  it('respects custom weights in trace', () => {
    const snap = snapshotFromScenario('baseline');
    const weights = {
      dispersion: 0,
      volLiquidity: 0,
      termTail: 0,
      putCall: 0,
      dealer: 100,
    };
    const result = computeCompositeScore(
      snap,
      weights,
      DEFAULT_THRESHOLDS,
      snap.vix.asOf,
    );
    const dealer = result.trace.find((t) => t.dimension === 'dealer')!;
    expect(dealer.weighted).toBeCloseTo(result.score!, 0);
  });

  it('post-OPEX repair scores in calm/elevated range', () => {
    const snap = snapshotFromScenario('postOpexRepair');
    const result = computeCompositeScore(
      snap,
      DEFAULT_WEIGHTS,
      DEFAULT_THRESHOLDS,
      snap.vix.asOf,
    );
    expect(result.score!).toBeLessThan(50);
  });
});

import { describe, expect, it } from 'vitest';
import { evalIndicatorStatus, toFlat } from '../engine/status';
import { snapshotFromScenario } from '../data/baseline';
import { crossesLevel, evalStatus } from '../engine/thresholds';
import { DEFAULT_THRESHOLDS } from '../config/thresholds';

describe('evalIndicatorStatus (original rules)', () => {
  it('baseline statuses match original badges', () => {
    const flat = toFlat(snapshotFromScenario('baseline'));
    expect(evalIndicatorStatus('vixeqVix', flat)).toBe('triggered'); // 1.60 < 1.85
    expect(evalIndicatorStatus('vix', flat)).toBe('triggered'); // 28.4 ≥ 28
    expect(evalIndicatorStatus('vvix', flat)).toBe('triggered'); // 122 ≥ 115
    expect(evalIndicatorStatus('vixVxv', flat)).toBe('triggered');
    expect(evalIndicatorStatus('equityPc', flat)).toBe('warning'); // 0.72
    expect(evalIndicatorStatus('totalPc', flat)).toBe('warning');
    expect(evalIndicatorStatus('indexPc', flat)).toBe('warning');
    expect(evalIndicatorStatus('gex', flat)).toBe('triggered');
    expect(evalIndicatorStatus('dealerGamma', flat)).toBe('triggered');
    expect(evalIndicatorStatus('netDeltaFlow', flat)).toBe('triggered');
  });

  it('returns na for null', () => {
    const flat = toFlat(snapshotFromScenario('baseline'));
    flat.vix = null;
    expect(evalIndicatorStatus('vix', flat)).toBe('na');
  });
});

describe('legacy band helpers', () => {
  it('crossesLevel / evalStatus still work for config UI', () => {
    expect(
      crossesLevel(28, DEFAULT_THRESHOLDS.vix, 'triggered', 'gte'),
    ).toBe(true);
    expect(evalStatus(null, DEFAULT_THRESHOLDS.vix)).toBe('na');
  });
});

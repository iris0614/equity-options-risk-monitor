import { describe, expect, it } from 'vitest';
import { computeCompositeScore, computeStressIndex } from '../engine/score';
import { DEFAULT_WEIGHTS } from '../config/weights';
import { DEFAULT_THRESHOLDS } from '../config/thresholds';
import { snapshotFromScenario, setIndicatorValue } from '../data/baseline';
import { toFlat } from '../engine/status';
import type { IndicatorSnapshot } from '../types';
import { INDICATOR_DEFS } from '../config/indicators';

function emptySnap(): IndicatorSnapshot {
  const out = {} as IndicatorSnapshot;
  for (const d of INDICATOR_DEFS) {
    out[d.id] = { id: d.id, value: null, simulated: true, asOf: '' };
  }
  return out;
}

describe('computeStressIndex (original formula)', () => {
  it('baseline → 71', () => {
    const snap = snapshotFromScenario('baseline');
    expect(computeStressIndex(toFlat(snap))).toBe(71);
  });

  it('stage1 → 1', () => {
    expect(
      computeStressIndex(toFlat(snapshotFromScenario('stage1'))),
    ).toBe(1);
  });

  it('stage2 → 26', () => {
    expect(
      computeStressIndex(toFlat(snapshotFromScenario('stage2'))),
    ).toBe(26);
  });

  it('stage3Ext → 99', () => {
    expect(
      computeStressIndex(toFlat(snapshotFromScenario('stage3Ext'))),
    ).toBe(99);
  });

  it('stage4 → 38', () => {
    expect(
      computeStressIndex(toFlat(snapshotFromScenario('stage4'))),
    ).toBe(38);
  });

  it('returns null when core inputs missing', () => {
    expect(computeStressIndex(toFlat(emptySnap()))).toBeNull();
  });
});

describe('computeCompositeScore wrapper', () => {
  it('exposes integer score and component trace', () => {
    const snap = snapshotFromScenario('baseline');
    const result = computeCompositeScore(
      snap,
      DEFAULT_WEIGHTS,
      DEFAULT_THRESHOLDS,
      snap.vix.asOf,
    );
    expect(result.score).toBe(71);
    expect(result.band?.id).toBe('stressed');
    expect(result.components.length).toBeGreaterThan(5);
    expect(result.disclaimer).toMatch(/投资建议|崩盘概率/);
  });

  it('DSPX/SKEW/NVDA do not change score when tweaked alone with others fixed', () => {
    let snap = snapshotFromScenario('baseline');
    const base = computeStressIndex(toFlat(snap))!;
    snap = setIndicatorValue(snap, 'dspx', 55);
    snap = setIndicatorValue(snap, 'skew', 170);
    snap = setIndicatorValue(snap, 'nvdaProxy', 200);
    expect(computeStressIndex(toFlat(snap))).toBe(base);
  });
});

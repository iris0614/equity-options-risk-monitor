import { describe, expect, it } from 'vitest';
import { judgeStages } from '../engine/stages';
import { DEFAULT_THRESHOLDS } from '../config/thresholds';
import { snapshotFromScenario, setIndicatorValue } from '../data/baseline';
import { computeCompositeScore } from '../engine/score';
import { DEFAULT_WEIGHTS } from '../config/weights';

describe('judgeStages', () => {
  it('baseline activates stage 03 (negative gamma regime)', () => {
    const snap = snapshotFromScenario('baseline');
    const score = computeCompositeScore(
      snap,
      DEFAULT_WEIGHTS,
      DEFAULT_THRESHOLDS,
      snap.vix.asOf,
    );
    const stages = judgeStages(snap, DEFAULT_THRESHOLDS, score.score);
    expect(stages.primary).toBe('03');
    const s3 = stages.judgments.find((j) => j.id === '03')!;
    expect(s3.state).toBe('active');
    expect(s3.enterSatisfied).toBeGreaterThan(0);
  });

  it('high fragility prefers stage 01 when vol contained', () => {
    const snap = snapshotFromScenario('highFragility');
    const stages = judgeStages(snap, DEFAULT_THRESHOLDS, 40);
    expect(stages.primary).toBe('01');
  });

  it('systemic deleveraging can reach stage 04', () => {
    const snap = snapshotFromScenario('systemicDeleveraging');
    const stages = judgeStages(snap, DEFAULT_THRESHOLDS, 88);
    expect(stages.primary).toBe('04');
  });

  it('allows non-linear jump notes when high stage without 01', () => {
    const snap = snapshotFromScenario('extremeSqueeze');
    const stages = judgeStages(snap, DEFAULT_THRESHOLDS, 94);
    expect(stages.primary).toBe('04');
    expect(stages.nonLinearNote.length).toBeGreaterThan(0);
  });

  it('stressing GEX/VIX live can move stage judgment', () => {
    let snap = snapshotFromScenario('postOpexRepair');
    let stages = judgeStages(snap, DEFAULT_THRESHOLDS, 26);
    expect(stages.primary).toBeNull();
    expect(stages.judgments.every((j) => j.state === 'inactive')).toBe(true);

    snap = setIndicatorValue(snap, 'gex', -120);
    snap = setIndicatorValue(snap, 'dealerGamma', -8);
    snap = setIndicatorValue(snap, 'vix', 30);
    snap = setIndicatorValue(snap, 'vvix', 125);
    snap = setIndicatorValue(snap, 'netDeltaFlow', -100);
    stages = judgeStages(snap, DEFAULT_THRESHOLDS, 75);
    expect(stages.primary).toBe('03');
    expect(stages.judgments.find((j) => j.id === '01')?.state).toBe('passed');
    expect(stages.judgments.find((j) => j.id === '02')?.state).toBe('passed');
  });

  it('reports per-indicator enter satisfaction', () => {
    const snap = snapshotFromScenario('baseline');
    const stages = judgeStages(snap, DEFAULT_THRESHOLDS, 71);
    const s3 = stages.judgments.find((j) => j.id === '03')!;
    expect(s3.enterEvals.every((e) => 'satisfied' in e)).toBe(true);
    expect(s3.rationale.length).toBeGreaterThan(0);
  });
});

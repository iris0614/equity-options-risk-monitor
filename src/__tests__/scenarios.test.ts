import { describe, expect, it } from 'vitest';
import { SCENARIOS } from '../config/scenarios';
import { snapshotFromScenario } from '../data/baseline';
import { runMonitorModel, computeStressIndex, detectRegime } from '../engine';
import { DEFAULT_WEIGHTS } from '../config/weights';
import { DEFAULT_THRESHOLDS } from '../config/thresholds';
import { toFlat } from '../engine/status';
import { evalDualChecklists } from '../engine/checklist';

const EXPECTED: Record<
  string,
  { score: number; stage: number; risk: number; reset: number }
> = {
  baseline: { score: 71, stage: 3, risk: 1, reset: 0 },
  stage1: { score: 1, stage: 1, risk: 0, reset: 4 },
  stage2: { score: 26, stage: 2, risk: 0, reset: 3 },
  stage3Ext: { score: 99, stage: 3, risk: 4, reset: 0 },
  stage4: { score: 38, stage: 4, risk: 0, reset: 4 },
};

describe('scenario switch vs original observed results', () => {
  it('defines the five original scenarios', () => {
    expect(SCENARIOS.map((s) => s.id)).toEqual([
      'baseline',
      'stage1',
      'stage2',
      'stage3Ext',
      'stage4',
    ]);
  });

  for (const s of SCENARIOS) {
    it(`${s.id} matches original score/stage/checklist counts`, () => {
      const snap = snapshotFromScenario(s.id);
      const flat = toFlat(snap);
      const exp = EXPECTED[s.id]!;
      expect(computeStressIndex(flat)).toBe(exp.score);
      expect(detectRegime(flat).stage).toBe(exp.stage);

      const model = runMonitorModel(
        snap,
        DEFAULT_WEIGHTS,
        DEFAULT_THRESHOLDS,
        s.asOf,
      );
      expect(model.score.score).toBe(exp.score);
      expect(Number(model.stages.primary)).toBe(exp.stage);

      const cl = evalDualChecklists(snap, DEFAULT_THRESHOLDS, {}, {});
      expect(cl.escalation.filter((x) => x.autoTriggered).length).toBe(
        exp.risk,
      );
      expect(cl.repair.filter((x) => x.autoTriggered).length).toBe(exp.reset);

      expect(Object.values(snap).every((v) => v.simulated)).toBe(true);
    });
  }
});

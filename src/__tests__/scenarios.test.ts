import { describe, expect, it } from 'vitest';
import { SCENARIOS } from '../config/scenarios';
import { snapshotFromScenario } from '../data/baseline';
import { runMonitorModel } from '../engine';
import { DEFAULT_WEIGHTS } from '../config/weights';
import { DEFAULT_THRESHOLDS } from '../config/thresholds';
import { evalTransmission } from '../engine/transmission';
import { judgeStages } from '../engine/stages';

describe('scenario switch', () => {
  it('defines all required scenarios', () => {
    const ids = SCENARIOS.map((s) => s.id);
    expect(ids).toEqual(
      expect.arrayContaining([
        'baseline',
        'highFragility',
        'tailDefense',
        'systemicDeleveraging',
        'extremeSqueeze',
        'postOpexRepair',
      ]),
    );
  });

  it('each scenario produces a coherent model without inventing nulls as zeros', () => {
    for (const s of SCENARIOS) {
      const snap = snapshotFromScenario(s.id);
      const model = runMonitorModel(
        snap,
        DEFAULT_WEIGHTS,
        DEFAULT_THRESHOLDS,
        s.asOf,
      );
      expect(model.score.asOf).toBe(s.asOf);
      expect(model.stages.judgments).toHaveLength(4);
      expect(model.transmission.length).toBeGreaterThan(0);
      // All seeded values remain simulated
      expect(Object.values(snap).every((v) => v.simulated)).toBe(true);
    }
  });

  it('repair scenario clears cascade while squeeze activates it', () => {
    const repair = snapshotFromScenario('postOpexRepair');
    const squeeze = snapshotFromScenario('extremeSqueeze');
    const rStages = judgeStages(repair, DEFAULT_THRESHOLDS, 26);
    const sStages = judgeStages(squeeze, DEFAULT_THRESHOLDS, 94);
    const rTx = evalTransmission(repair, rStages, DEFAULT_THRESHOLDS);
    const sTx = evalTransmission(squeeze, sStages, DEFAULT_THRESHOLDS);
    expect(rTx.find((l) => l.id === 'cascade')!.active).toBe(false);
    expect(sTx.find((l) => l.id === 'cascade')!.active).toBe(true);
  });
});

describe('vanna directionality', () => {
  it('does not treat vol-up as sell when vannaSign = +1', () => {
    const snap = snapshotFromScenario('baseline');
    snap.vannaSign = {
      ...snap.vannaSign,
      value: 1,
    };
    const stages = judgeStages(snap, DEFAULT_THRESHOLDS, 71);
    const tx = evalTransmission(snap, stages, DEFAULT_THRESHOLDS);
    const vanna = tx.find((l) => l.id === 'vanna')!;
    expect(vanna.active).toBe(true);
    expect(vanna.reason).toMatch(/买盘|buy/i);
    expect(vanna.reason).not.toMatch(/卖压加速/);
  });

  it('sell-on-vol-up only when vannaSign = -1 and vol triggered', () => {
    const snap = snapshotFromScenario('baseline');
    snap.vannaSign = { ...snap.vannaSign, value: -1 };
    const stages = judgeStages(snap, DEFAULT_THRESHOLDS, 71);
    const tx = evalTransmission(snap, stages, DEFAULT_THRESHOLDS);
    const vanna = tx.find((l) => l.id === 'vanna')!;
    expect(vanna.active).toBe(true);
    expect(vanna.reason).toMatch(/卖压/);
  });
});

import { describe, expect, it } from 'vitest';
import { detectRegime, judgeStages } from '../engine/stages';
import { DEFAULT_THRESHOLDS } from '../config/thresholds';
import { snapshotFromScenario } from '../data/baseline';
import { toFlat } from '../engine/status';

describe('detectRegime (original)', () => {
  it('baseline → stage 3', () => {
    const r = detectRegime(toFlat(snapshotFromScenario('baseline')));
    expect(r.stage).toBe(3);
    expect(r.title).toMatch(/负反馈翻转与 Vanna/);
    expect(r.macroDefense).toBe(false);
  });

  it('stage1 → stage 1', () => {
    expect(detectRegime(toFlat(snapshotFromScenario('stage1'))).stage).toBe(1);
  });

  it('stage2 → stage 2', () => {
    expect(detectRegime(toFlat(snapshotFromScenario('stage2'))).stage).toBe(2);
  });

  it('stage3Ext → stage 3 with macroDefense', () => {
    const r = detectRegime(toFlat(snapshotFromScenario('stage3Ext')));
    expect(r.stage).toBe(3);
    expect(r.macroDefense).toBe(true);
    expect(r.title).toMatch(/宏观全面防御/);
  });

  it('stage4 → stage 4', () => {
    expect(detectRegime(toFlat(snapshotFromScenario('stage4'))).stage).toBe(4);
  });
});

describe('judgeStages UI mapping', () => {
  it('marks lower stages passed when stage 3 active', () => {
    const stages = judgeStages(
      snapshotFromScenario('baseline'),
      DEFAULT_THRESHOLDS,
      71,
    );
    expect(stages.primary).toBe('03');
    expect(stages.judgments.find((j) => j.id === '01')?.state).toBe('passed');
    expect(stages.judgments.find((j) => j.id === '02')?.state).toBe('passed');
    expect(stages.judgments.find((j) => j.id === '03')?.state).toBe('active');
    expect(stages.judgments.find((j) => j.id === '04')?.state).toBe(
      'observing',
    );
  });
});

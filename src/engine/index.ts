import { computeCompositeScore } from './score';
import { judgeStages } from './stages';
import { evalTransmission } from './transmission';
import { evalDualChecklists } from './checklist';
import type {
  DimensionWeights,
  IndicatorId,
  IndicatorSnapshot,
  ThresholdBand,
} from '../types';

export { computeCompositeScore, formatScore } from './score';
export { judgeStages, stageDefById } from './stages';
export { evalTransmission } from './transmission';
export { evalDualChecklists } from './checklist';
export {
  evalStatus,
  normalizeToStress,
  crossesLevel,
  thresholdLabel,
} from './thresholds';

export interface MonitorModel {
  score: ReturnType<typeof computeCompositeScore>;
  stages: ReturnType<typeof judgeStages>;
  transmission: ReturnType<typeof evalTransmission>;
  checklists: ReturnType<typeof evalDualChecklists>;
}

/** Single entry: indicators → score → stages → transmission → checklists */
export function runMonitorModel(
  snap: IndicatorSnapshot,
  weights: DimensionWeights,
  thresholds: Record<IndicatorId, ThresholdBand>,
  asOf: string,
  manualEsc: Record<string, boolean> = {},
  manualRep: Record<string, boolean> = {},
): MonitorModel {
  const score = computeCompositeScore(snap, weights, thresholds, asOf);
  const stages = judgeStages(snap, thresholds, score.score);
  const transmission = evalTransmission(snap, stages, thresholds);
  const checklists = evalDualChecklists(
    snap,
    thresholds,
    manualEsc,
    manualRep,
  );
  return { score, stages, transmission, checklists };
}

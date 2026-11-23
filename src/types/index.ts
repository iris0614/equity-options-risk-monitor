/** Shared domain types for Institutional Risk Monitor */

export type IndicatorStatus = 'normal' | 'warning' | 'triggered' | 'na';

export type DimensionId =
  | 'dispersion'
  | 'volLiquidity'
  | 'termTail'
  | 'putCall'
  | 'dealer';

export type IndicatorId =
  | 'vixeqVix'
  | 'dspx'
  | 'nvdaProxy'
  | 'vix'
  | 'vvix'
  | 'vixVxv'
  | 'vix9dVix'
  | 'skew'
  | 'equityPc'
  | 'totalPc'
  | 'indexPc'
  | 'gex'
  | 'dealerGamma'
  | 'netDeltaFlow'
  | 'vannaSign'
  | 'charmFlow';

export type StageId = '01' | '02' | '03' | '04';

export type StageState = 'inactive' | 'passed' | 'active' | 'observing' | 'conflict';

export type ScoreBandId =
  | 'calm'
  | 'elevated'
  | 'stressed'
  | 'fragile'
  | 'extreme';

export type ScenarioId =
  | 'baseline'
  | 'highFragility'
  | 'tailDefense'
  | 'systemicDeleveraging'
  | 'extremeSqueeze'
  | 'postOpexRepair';

export interface ThresholdBand {
  warning: number;
  triggered: number;
  /** Higher value = worse unless inverted */
  inverted?: boolean;
}

export interface IndicatorDef {
  id: IndicatorId;
  dimension: DimensionId;
  label: string;
  labelZh: string;
  description: string;
  unit: string;
  /** Slider / input range */
  min: number;
  max: number;
  step: number;
  decimals: number;
  tooltip: string;
}

export interface IndicatorValue {
  id: IndicatorId;
  value: number | null;
  /** true when value comes from scenario / stress, not live feed */
  simulated: boolean;
  asOf: string;
}

export type IndicatorSnapshot = Record<IndicatorId, IndicatorValue>;

export interface DimensionWeights {
  dispersion: number;
  volLiquidity: number;
  termTail: number;
  putCall: number;
  dealer: number;
}

export interface ScoreBand {
  id: ScoreBandId;
  label: string;
  labelZh: string;
  min: number;
  max: number;
  color: string;
}

export interface IndicatorEval {
  id: IndicatorId;
  value: number | null;
  status: IndicatorStatus;
  contribution: number | null;
  normalized: number | null;
  threshold: ThresholdBand;
  note: string;
}

export interface DimensionEval {
  id: DimensionId;
  label: string;
  weight: number;
  score: number | null;
  status: IndicatorStatus;
  indicators: IndicatorEval[];
}

export interface ScoreTraceLine {
  dimension: DimensionId;
  weight: number;
  dimensionScore: number | null;
  weighted: number | null;
  detail: string;
}

export interface CompositeScore {
  score: number | null;
  band: ScoreBand | null;
  dimensions: DimensionEval[];
  trace: ScoreTraceLine[];
  asOf: string;
  disclaimer: string;
}

export interface StageCondition {
  indicatorId: IndicatorId;
  /** 'gte' for higher-worse; 'lte' for lower-worse (inverted) */
  op: 'gte' | 'lte' | 'lt' | 'gt';
  level: 'warning' | 'triggered';
  required: boolean;
}

export interface StageDef {
  id: StageId;
  name: string;
  nameZh: string;
  enter: StageCondition[];
  exit: StageCondition[];
  description: string;
  /** Transmission link ids typically active in this stage */
  transmissionLinks: string[];
}

export interface StageConditionEval {
  condition: StageCondition;
  satisfied: boolean;
  status: IndicatorStatus;
  value: number | null;
  thresholdValue: number;
}

export interface StageJudgment {
  id: StageId;
  state: StageState;
  enterSatisfied: number;
  enterRequired: number;
  exitSatisfied: number;
  exitRequired: number;
  enterEvals: StageConditionEval[];
  exitEvals: StageConditionEval[];
  rationale: string;
}

export interface StageResult {
  primary: StageId | null;
  judgments: StageJudgment[];
  conflicts: StageId[];
  nonLinearNote: string;
}

export type TransmissionLinkId =
  | 'dispersion'
  | 'volSpike'
  | 'liquidity'
  | 'gammaFlip'
  | 'vanna'
  | 'deltaHedge'
  | 'cascade';

export interface TransmissionLink {
  id: TransmissionLinkId;
  label: string;
  labelZh: string;
  description: string;
}

export interface TransmissionEval {
  id: TransmissionLinkId;
  active: boolean;
  intensity: number;
  reason: string;
}

export interface ChecklistItemDef {
  id: string;
  label: string;
  labelZh: string;
  /** Auto-eval from indicators; null = manual only */
  auto?: {
    indicatorId: IndicatorId;
    op: 'gte' | 'lte' | 'gt' | 'lt';
    level: 'warning' | 'triggered' | 'custom';
    customValue?: number;
  };
}

export interface ChecklistItemState {
  id: string;
  autoTriggered: boolean;
  manualConfirmed: boolean;
}

export interface MarketSeriesPoint {
  date: string;
  vix9d: number | null;
  vix: number | null;
  vix3m: number | null;
  score: number | null;
}

export interface ScenarioDef {
  id: ScenarioId;
  label: string;
  labelZh: string;
  description: string;
  asOf: string;
  indicators: Partial<Record<IndicatorId, number | null>>;
  series?: MarketSeriesPoint[];
}

export interface MonitorConfig {
  weights: DimensionWeights;
  thresholds: Record<IndicatorId, ThresholdBand>;
  bands: ScoreBand[];
}

export interface SnapshotRecord {
  id: string;
  name: string;
  savedAt: string;
  scenarioId: ScenarioId;
  indicators: IndicatorSnapshot;
  weights: DimensionWeights;
  thresholds: Record<IndicatorId, ThresholdBand>;
  checklist: Record<string, ChecklistItemState>;
}

export interface ChartMeta {
  title: string;
  asOf: string;
  simulated: boolean;
  units: string;
}

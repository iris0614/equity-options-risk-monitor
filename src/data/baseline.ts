import { SCENARIO_BY_ID } from '../config/scenarios';
import type {
  IndicatorId,
  IndicatorSnapshot,
  MarketSeriesPoint,
  ScenarioId,
} from '../types';
import { INDICATOR_DEFS } from '../config/indicators';

const ALL_IDS = INDICATOR_DEFS.map((d) => d.id);

export function snapshotFromScenario(
  scenarioId: ScenarioId,
): IndicatorSnapshot {
  const scenario = SCENARIO_BY_ID[scenarioId];
  const out = {} as IndicatorSnapshot;
  for (const id of ALL_IDS) {
    const raw = scenario.indicators[id];
    out[id] = {
      id,
      value: raw === undefined ? null : raw,
      simulated: true,
      asOf: scenario.asOf,
    };
  }
  return out;
}

export function cloneSnapshot(s: IndicatorSnapshot): IndicatorSnapshot {
  const out = {} as IndicatorSnapshot;
  for (const id of ALL_IDS) {
    out[id] = { ...s[id] };
  }
  return out;
}

export function setIndicatorValue(
  snap: IndicatorSnapshot,
  id: IndicatorId,
  value: number | null,
): IndicatorSnapshot {
  return {
    ...snap,
    [id]: {
      ...snap[id],
      value,
      simulated: true,
    },
  };
}

export const BASELINE_SERIES: MarketSeriesPoint[] = [
  { date: '2026-11-08', vix9d: 15.2, vix: 16.1, vix3m: 17.8, score: 28 },
  { date: '2026-11-11', vix9d: 17.0, vix: 17.5, vix3m: 18.2, score: 35 },
  { date: '2026-11-12', vix9d: 18.8, vix: 18.5, vix3m: 18.6, score: 42 },
  { date: '2026-11-13', vix9d: 21.2, vix: 20.8, vix3m: 20.1, score: 51 },
  { date: '2026-11-14', vix9d: 23.5, vix: 22.9, vix3m: 21.5, score: 58 },
  { date: '2026-11-15', vix9d: 25.1, vix: 24.5, vix3m: 22.8, score: 62 },
  { date: '2026-11-18', vix9d: 28.0, vix: 26.8, vix3m: 24.5, score: 68 },
  { date: '2026-11-19', vix9d: 29.3, vix: 28.4, vix3m: 27.0, score: 71 },
];

export const SERIES_BY_SCENARIO: Record<ScenarioId, MarketSeriesPoint[]> = {
  baseline: BASELINE_SERIES,
  stage1: [
    { date: '2026-11-05', vix9d: 12.5, vix: 14.2, vix3m: 16.5, score: 1 },
    { date: '2026-11-12', vix9d: 12.5, vix: 14.2, vix3m: 16.5, score: 1 },
  ],
  stage2: [
    { date: '2026-11-10', vix9d: 18.4, vix: 18.8, vix3m: 19.6, score: 26 },
    { date: '2026-11-15', vix9d: 18.4, vix: 18.8, vix3m: 19.6, score: 26 },
  ],
  stage3Ext: [
    { date: '2026-11-18', vix9d: 35.0, vix: 32.0, vix3m: 28.0, score: 85 },
    { date: '2026-11-19', vix9d: 39.7, vix: 35.8, vix3m: 31.4, score: 99 },
  ],
  stage4: [
    { date: '2026-11-19', vix9d: 29.0, vix: 28.0, vix3m: 27.0, score: 70 },
    { date: '2026-11-21', vix9d: 21.3, vix: 22.6, vix3m: 23.5, score: 38 },
  ],
};

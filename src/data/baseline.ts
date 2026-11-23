import { SCENARIO_BY_ID } from '../config/scenarios';
import type {
  IndicatorId,
  IndicatorSnapshot,
  MarketSeriesPoint,
  ScenarioId,
} from '../types';
import { INDICATOR_DEFS } from '../config/indicators';

const ALL_IDS = INDICATOR_DEFS.map((d) => d.id);

/** Build a full indicator snapshot from a scenario; missing keys → null (N/A). */
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

/** Research sample vol term history (情景模拟) for baseline OPEX window. */
export const BASELINE_SERIES: MarketSeriesPoint[] = [
  {
    date: '2024-11-08',
    vix9d: 15.2,
    vix: 16.1,
    vix3m: 17.8,
    score: 28,
  },
  {
    date: '2024-11-11',
    vix9d: 17.0,
    vix: 17.5,
    vix3m: 18.2,
    score: 35,
  },
  {
    date: '2024-11-12',
    vix9d: 18.8,
    vix: 18.5,
    vix3m: 18.6,
    score: 42,
  },
  {
    date: '2024-11-13',
    vix9d: 21.2,
    vix: 20.8,
    vix3m: 20.1,
    score: 51,
  },
  {
    date: '2024-11-14',
    vix9d: 23.5,
    vix: 22.9,
    vix3m: 21.5,
    score: 58,
  },
  {
    date: '2024-11-15',
    vix9d: 25.1,
    vix: 24.5,
    vix3m: 22.8,
    score: 62,
  },
  {
    date: '2024-11-18',
    vix9d: 28.0,
    vix: 26.8,
    vix3m: 24.5,
    score: 68,
  },
  {
    date: '2024-11-19',
    vix9d: 29.3,
    vix: 28.4,
    vix3m: 27.0,
    score: 71,
  },
];

export const SERIES_BY_SCENARIO: Record<ScenarioId, MarketSeriesPoint[]> = {
  baseline: BASELINE_SERIES,
  highFragility: [
    {
      date: '2024-11-05',
      vix9d: 14.0,
      vix: 15.2,
      vix3m: 17.0,
      score: 22,
    },
    {
      date: '2024-11-08',
      vix9d: 15.5,
      vix: 16.5,
      vix3m: 17.5,
      score: 30,
    },
    {
      date: '2024-11-12',
      vix9d: 17.4,
      vix: 18.5,
      vix3m: 19.0,
      score: 38,
    },
  ],
  tailDefense: [
    {
      date: '2024-11-10',
      vix9d: 18.0,
      vix: 19.0,
      vix3m: 19.5,
      score: 40,
    },
    {
      date: '2024-11-13',
      vix9d: 22.0,
      vix: 22.0,
      vix3m: 21.5,
      score: 52,
    },
    {
      date: '2024-11-15',
      vix9d: 24.5,
      vix: 24.5,
      vix3m: 24.7,
      score: 58,
    },
  ],
  systemicDeleveraging: [
    {
      date: '2024-11-15',
      vix9d: 25.0,
      vix: 24.0,
      vix3m: 23.0,
      score: 60,
    },
    {
      date: '2024-11-18',
      vix9d: 32.0,
      vix: 30.0,
      vix3m: 27.0,
      score: 78,
    },
    {
      date: '2024-11-20',
      vix9d: 43.7,
      vix: 38.0,
      vix3m: 33.9,
      score: 88,
    },
  ],
  extremeSqueeze: [
    {
      date: '2024-11-18',
      vix9d: 30.0,
      vix: 28.0,
      vix3m: 26.0,
      score: 72,
    },
    {
      date: '2024-11-20',
      vix9d: 40.0,
      vix: 36.0,
      vix3m: 32.0,
      score: 86,
    },
    {
      date: '2024-11-21',
      vix9d: 56.3,
      vix: 45.0,
      vix3m: 37.5,
      score: 94,
    },
  ],
  postOpexRepair: [
    {
      date: '2024-11-19',
      vix9d: 29.0,
      vix: 28.0,
      vix3m: 27.0,
      score: 70,
    },
    {
      date: '2024-11-21',
      vix9d: 20.0,
      vix: 20.5,
      vix3m: 21.5,
      score: 45,
    },
    {
      date: '2024-11-22',
      vix9d: 15.1,
      vix: 16.8,
      vix3m: 19.1,
      score: 26,
    },
  ],
};

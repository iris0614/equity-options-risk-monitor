import type { ScenarioDef } from '../types';

/** As-of label from original: 2026-11-18/19 月度 OPEX 交割日前 */
export const BASELINE_AS_OF = '2026-11-19T16:00:00-05:00';
export const BASELINE_AS_OF_LABEL = '2026-11-18/19（月度 OPEX 交割日前）';
export const DATA_SOURCES =
  'LSEG Datastream / CBOE / SpotGamma / Squeezemetrics';

/**
 * Scenario seeds copied from original embed SCENARIOS.
 * Hard-coded research sample — not a live feed.
 */
export const SCENARIOS: ScenarioDef[] = [
  {
    id: 'baseline',
    label: 'Current OPEX-eve',
    labelZh: '当前实盘 (11/19 OPEX前)',
    description: '原始基准：负 GEX、VVIX 抬升、期限倒挂 — 阶段三。',
    asOf: BASELINE_AS_OF,
    indicators: {
      vixeqVix: 1.6,
      dspx: 37.2,
      nvdaProxy: 146,
      vix: 28.4,
      vvix: 122,
      vixVxv: 1.05,
      vix9dVix: 1.03,
      skew: 141,
      equityPc: 0.72,
      totalPc: 1.05,
      indexPc: 1.15,
      gex: -100.5,
      dealerGamma: -7.3,
      netDeltaFlow: -110,
    },
  },
  {
    id: 'stage1',
    label: 'Stage 1 Dispersion Steady',
    labelZh: '阶段一：离散繁荣稳态',
    description: '正 Gamma 稳态、低波。',
    asOf: BASELINE_AS_OF,
    indicators: {
      vixeqVix: 2.65,
      dspx: 44.5,
      nvdaProxy: 178,
      vix: 14.2,
      vvix: 84,
      vixVxv: 0.86,
      vix9dVix: 0.88,
      skew: 146,
      equityPc: 0.52,
      totalPc: 0.82,
      indexPc: 1.05,
      gex: 85,
      dealerGamma: 4.8,
      netDeltaFlow: 65,
    },
  },
  {
    id: 'stage2',
    label: 'Stage 2 Skew Warning',
    labelZh: '阶段二：偏度与个股预警',
    description: 'SKEW 抬升、个股 P/C 抬头。',
    asOf: BASELINE_AS_OF,
    indicators: {
      vixeqVix: 2.12,
      dspx: 41,
      nvdaProxy: 162,
      vix: 18.8,
      vvix: 102,
      vixVxv: 0.96,
      vix9dVix: 0.98,
      skew: 166,
      equityPc: 0.71,
      totalPc: 1.01,
      indexPc: 1.12,
      gex: 12,
      dealerGamma: 0.4,
      netDeltaFlow: -15,
    },
  },
  {
    id: 'stage3Ext',
    label: 'Stage 3 Macro Defense',
    labelZh: '阶段三升级：宏观全面防御',
    description: '宏观防御 + 击穿 Dealer Gamma 历史底线。',
    asOf: BASELINE_AS_OF,
    indicators: {
      vixeqVix: 1.35,
      dspx: 31.5,
      nvdaProxy: 132,
      vix: 35.8,
      vvix: 142,
      vixVxv: 1.14,
      vix9dVix: 1.11,
      skew: 132,
      equityPc: 0.88,
      totalPc: 1.34,
      indexPc: 1.42,
      gex: -118,
      dealerGamma: -9.1,
      netDeltaFlow: -138,
    },
  },
  {
    id: 'stage4',
    label: 'Stage 4 OPEX Reset',
    labelZh: '阶段四：OPEX重置/反向Vanna',
    description: '倒挂解除、VVIX 回落、Delta 回正 — 修复期。',
    asOf: BASELINE_AS_OF,
    indicators: {
      vixeqVix: 1.72,
      dspx: 36,
      nvdaProxy: 151.5,
      vix: 22.6,
      vvix: 101,
      vixVxv: 0.96,
      vix9dVix: 0.94,
      skew: 134,
      equityPc: 0.74,
      totalPc: 1.08,
      indexPc: 1.22,
      gex: -18,
      dealerGamma: -1.4,
      netDeltaFlow: 15,
    },
  },
];

export const SCENARIO_BY_ID = Object.fromEntries(
  SCENARIOS.map((s) => [s.id, s]),
) as Record<ScenarioDef['id'], ScenarioDef>;

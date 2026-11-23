import type { IndicatorId, ThresholdBand } from '../types';

/**
 * Display thresholds for config UI. Live status uses original evalStatus rules
 * in engine/status.ts (some are multi-condition / inverted).
 */
export const DEFAULT_THRESHOLDS: Record<IndicatorId, ThresholdBand> = {
  vixeqVix: { warning: 2.15, triggered: 1.85, inverted: true },
  dspx: { warning: 39, triggered: 35, inverted: true },
  nvdaProxy: { warning: 160, triggered: 148, inverted: true },
  vix: { warning: 20, triggered: 28 },
  vvix: { warning: 100, triggered: 115 },
  vixVxv: { warning: 0.95, triggered: 1.0 },
  vix9dVix: { warning: 0.95, triggered: 1.0 },
  skew: { warning: 160, triggered: 150 },
  equityPc: { warning: 0.68, triggered: 0.8 },
  totalPc: { warning: 1.0, triggered: 1.25 },
  indexPc: { warning: 1.12, triggered: 1.25 },
  gex: { warning: 0, triggered: -50, inverted: true },
  dealerGamma: { warning: 0, triggered: -5, inverted: true },
  netDeltaFlow: { warning: 0, triggered: -60, inverted: true },
};

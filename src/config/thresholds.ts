import type { IndicatorId, ThresholdBand } from '../types';

/** Default research thresholds (scenario baseline, not live market). */
export const DEFAULT_THRESHOLDS: Record<IndicatorId, ThresholdBand> = {
  vixeqVix: { warning: 1.4, triggered: 1.6 },
  dspx: { warning: 32, triggered: 40 },
  nvdaProxy: { warning: 130, triggered: 145 },
  vix: { warning: 22, triggered: 28 },
  vvix: { warning: 105, triggered: 120 },
  vixVxv: { warning: 0.98, triggered: 1.02 },
  vix9dVix: { warning: 0.98, triggered: 1.02 },
  skew: { warning: 135, triggered: 145 },
  equityPc: { warning: 0.7, triggered: 0.85 },
  totalPc: { warning: 0.95, triggered: 1.15 },
  indexPc: { warning: 1.05, triggered: 1.25 },
  /** Lower (more negative) is worse */
  gex: { warning: -40, triggered: -80, inverted: true },
  dealerGamma: { warning: -4, triggered: -7, inverted: true },
  netDeltaFlow: { warning: -40, triggered: -90, inverted: true },
  /** -1 is worse (sell-on-vol-up); treat as inverted numeric */
  vannaSign: { warning: 0, triggered: -1, inverted: true },
  charmFlow: { warning: -20, triggered: -40, inverted: true },
};

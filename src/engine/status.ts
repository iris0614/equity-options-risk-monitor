import type {
  FlatState,
  IndicatorId,
  IndicatorStatus,
  IndicatorSnapshot,
} from '../types';

export function toFlat(snap: IndicatorSnapshot): FlatState {
  const out = {} as FlatState;
  for (const [k, v] of Object.entries(snap) as [
    IndicatorId,
    IndicatorSnapshot[IndicatorId],
  ][]) {
    out[k] = v?.value ?? null;
  }
  return out;
}

function mapTone(tone: 'green' | 'amber' | 'red'): IndicatorStatus {
  if (tone === 'red') return 'triggered';
  if (tone === 'amber') return 'warning';
  return 'normal';
}

/**
 * Original-site evalStatus rules (exact).
 * Missing value → N/A.
 */
export function evalIndicatorStatus(
  id: IndicatorId,
  flat: FlatState,
): IndicatorStatus {
  const v = flat[id];
  if (v === null || v === undefined || Number.isNaN(v)) return 'na';

  switch (id) {
    case 'vixeqVix':
      return mapTone(v < 1.85 ? 'red' : v < 2.15 ? 'amber' : 'green');
    case 'dspx': {
      const vix = flat.vix;
      if (vix !== null && v < 35 && vix > 25) return 'triggered';
      return mapTone(v < 39 ? 'amber' : 'green');
    }
    case 'nvdaProxy':
      return mapTone(v < 148 ? 'red' : v < 160 ? 'amber' : 'green');
    case 'vix':
      return mapTone(v >= 28 ? 'red' : v >= 20 ? 'amber' : 'green');
    case 'vvix':
      return mapTone(v >= 115 ? 'red' : v >= 100 ? 'amber' : 'green');
    case 'vixVxv':
    case 'vix9dVix':
      return mapTone(v > 1.0 ? 'red' : v >= 0.95 ? 'amber' : 'green');
    case 'skew': {
      if (v >= 160) return 'warning';
      const vix = flat.vix;
      if (vix !== null && vix >= 25 && v < 150) return 'triggered';
      return 'normal';
    }
    case 'equityPc':
      return mapTone(v >= 0.8 ? 'red' : v >= 0.68 ? 'amber' : 'green');
    case 'totalPc':
      return mapTone(v >= 1.25 ? 'red' : v >= 1.0 ? 'amber' : 'green');
    case 'indexPc':
      return mapTone(v >= 1.25 ? 'red' : v >= 1.12 ? 'amber' : 'green');
    case 'gex':
      return mapTone(v <= -50 ? 'red' : v < 0 ? 'amber' : 'green');
    case 'dealerGamma':
      return mapTone(v <= -5 ? 'red' : v < 0 ? 'amber' : 'green');
    case 'netDeltaFlow':
      return mapTone(v <= -60 ? 'red' : v < 0 ? 'amber' : 'green');
  }
}

import type { IndicatorStatus, ThresholdBand } from '../types';

/** Compare value against a threshold level. */
export function crossesLevel(
  value: number,
  band: ThresholdBand,
  level: 'warning' | 'triggered',
  op: 'gte' | 'lte' | 'gt' | 'lt',
): boolean {
  const thr = level === 'warning' ? band.warning : band.triggered;
  switch (op) {
    case 'gte':
      return value >= thr;
    case 'gt':
      return value > thr;
    case 'lte':
      return value <= thr;
    case 'lt':
      return value < thr;
  }
}

/** Status from value + band. Missing → N/A. */
export function evalStatus(
  value: number | null | undefined,
  band: ThresholdBand,
): IndicatorStatus {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return 'na';
  }
  if (band.inverted) {
    if (value <= band.triggered) return 'triggered';
    if (value <= band.warning) return 'warning';
    return 'normal';
  }
  if (value >= band.triggered) return 'triggered';
  if (value >= band.warning) return 'warning';
  return 'normal';
}

/**
 * Normalize indicator to 0–100 stress score.
 * Higher = more stressed. Inverted bands: more negative → higher stress.
 */
export function normalizeToStress(
  value: number | null | undefined,
  band: ThresholdBand,
  softMin: number,
  softMax: number,
): number | null {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return null;
  }

  if (band.inverted) {
    // Map: softMax (calm) → 0, triggered → 85, beyond → 100
    const calm = softMax;
    const warn = band.warning;
    const trig = band.triggered;
    const floor = softMin;
    if (value >= calm) return 0;
    if (value >= warn) {
      return ((calm - value) / (calm - warn)) * 40;
    }
    if (value >= trig) {
      return 40 + ((warn - value) / (warn - trig)) * 35;
    }
    if (value >= floor) {
      return 75 + ((trig - value) / (trig - floor)) * 25;
    }
    return 100;
  }

  const calm = softMin;
  const warn = band.warning;
  const trig = band.triggered;
  const ceil = softMax;
  if (value <= calm) return 0;
  if (value <= warn) {
    return ((value - calm) / (warn - calm)) * 40;
  }
  if (value <= trig) {
    return 40 + ((value - warn) / (trig - warn)) * 35;
  }
  if (value <= ceil) {
    return 75 + ((value - trig) / (ceil - trig)) * 25;
  }
  return 100;
}

export function thresholdLabel(band: ThresholdBand): string {
  if (band.inverted) {
    return `警戒 ≤ ${band.warning} · 触发 ≤ ${band.triggered}`;
  }
  return `警戒 ≥ ${band.warning} · 触发 ≥ ${band.triggered}`;
}

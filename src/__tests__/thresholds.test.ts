import { describe, expect, it } from 'vitest';
import {
  crossesLevel,
  evalStatus,
  normalizeToStress,
} from '../engine/thresholds';
import { DEFAULT_THRESHOLDS } from '../config/thresholds';

describe('evalStatus', () => {
  it('returns na for null/undefined', () => {
    expect(evalStatus(null, DEFAULT_THRESHOLDS.vix)).toBe('na');
    expect(evalStatus(undefined, DEFAULT_THRESHOLDS.vix)).toBe('na');
  });

  it('classifies higher-worse indicators', () => {
    expect(evalStatus(18, DEFAULT_THRESHOLDS.vix)).toBe('normal');
    expect(evalStatus(22, DEFAULT_THRESHOLDS.vix)).toBe('warning');
    expect(evalStatus(28, DEFAULT_THRESHOLDS.vix)).toBe('triggered');
  });

  it('classifies inverted (lower-worse) indicators', () => {
    expect(evalStatus(10, DEFAULT_THRESHOLDS.gex)).toBe('normal');
    expect(evalStatus(-40, DEFAULT_THRESHOLDS.gex)).toBe('warning');
    expect(evalStatus(-100, DEFAULT_THRESHOLDS.gex)).toBe('triggered');
  });
});

describe('crossesLevel', () => {
  it('supports gte/lte ops', () => {
    expect(
      crossesLevel(28, DEFAULT_THRESHOLDS.vix, 'triggered', 'gte'),
    ).toBe(true);
    expect(
      crossesLevel(-100, DEFAULT_THRESHOLDS.gex, 'triggered', 'lte'),
    ).toBe(true);
    expect(
      crossesLevel(-50, DEFAULT_THRESHOLDS.gex, 'triggered', 'lte'),
    ).toBe(false);
  });
});

describe('normalizeToStress', () => {
  it('maps calm → low and trigger → high', () => {
    const low = normalizeToStress(12, DEFAULT_THRESHOLDS.vix, 10, 80);
    const mid = normalizeToStress(25, DEFAULT_THRESHOLDS.vix, 10, 80);
    const high = normalizeToStress(40, DEFAULT_THRESHOLDS.vix, 10, 80);
    expect(low).toBeLessThan(20);
    expect(mid!).toBeGreaterThan(40);
    expect(high!).toBeGreaterThan(75);
  });

  it('maps more-negative GEX to higher stress', () => {
    const calm = normalizeToStress(50, DEFAULT_THRESHOLDS.gex, -250, 150);
    const stress = normalizeToStress(-100, DEFAULT_THRESHOLDS.gex, -250, 150);
    expect(calm!).toBeLessThan(30);
    expect(stress!).toBeGreaterThan(70);
    expect(stress!).toBeGreaterThan(calm!);
  });

  it('returns null for missing', () => {
    expect(normalizeToStress(null, DEFAULT_THRESHOLDS.vix, 10, 80)).toBeNull();
  });
});

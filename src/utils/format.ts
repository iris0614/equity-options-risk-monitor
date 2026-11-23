import type { IndicatorStatus, StageState } from '../types';

export function statusClass(status: IndicatorStatus): string {
  switch (status) {
    case 'normal':
      return 'status-normal';
    case 'warning':
      return 'status-warning';
    case 'triggered':
      return 'status-triggered';
    default:
      return 'status-na';
  }
}

export function statusLabel(status: IndicatorStatus): string {
  switch (status) {
    case 'normal':
      return '正常';
    case 'warning':
      return '警戒';
    case 'triggered':
      return '触发红线';
    default:
      return 'N/A';
  }
}

export function stageStateLabel(state: StageState): string {
  switch (state) {
    case 'active':
      return '当前激活';
    case 'passed':
      return '已演进';
    case 'observing':
      return '观测中';
    case 'conflict':
      return '信号冲突';
    default:
      return '未激活';
  }
}

export function formatNum(
  value: number | null | undefined,
  decimals = 1,
  unit = '',
): string {
  if (value === null || value === undefined || Number.isNaN(value)) return 'N/A';
  const n = value.toFixed(decimals);
  return unit ? `${n}${unit}` : n;
}

export function formatAsOf(iso: string): string {
  if (!iso) return 'N/A';
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZoneName: 'short',
    }).format(d);
  } catch {
    return iso;
  }
}

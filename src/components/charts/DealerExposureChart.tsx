import ReactECharts from 'echarts-for-react';
import type { IndicatorSnapshot, ThresholdBand, IndicatorId } from '../../types';
import { DEALER_GAMMA_FLOOR } from '../../config/indicators';
import { formatAsOf, formatNum } from '../../utils/format';

interface Props {
  snap: IndicatorSnapshot;
  thresholds: Record<IndicatorId, ThresholdBand>;
  asOf: string;
}

export function DealerExposureChart({ snap, thresholds, asOf }: Props) {
  const rows = [
    {
      name: 'Dealer Agg Gamma ($B)',
      value: snap.dealerGamma.value,
      warn: thresholds.dealerGamma.warning,
      trig: thresholds.dealerGamma.triggered,
      unit: '$B',
    },
    {
      name: 'SPX GEX ($B)',
      value: snap.gex.value,
      warn: thresholds.gex.warning,
      trig: thresholds.gex.triggered,
      unit: '$B',
    },
    {
      name: 'Net Delta Flow (pts)',
      value: snap.netDeltaFlow.value,
      warn: thresholds.netDeltaFlow.warning,
      trig: thresholds.netDeltaFlow.triggered,
      unit: 'pts',
    },
  ];

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      valueFormatter: (v: number) => Number(v).toFixed(1),
    },
    grid: { left: 120, right: 48, top: 16, bottom: 24 },
    xAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#E8EDF4' } },
      axisLabel: { fontSize: 10 },
    },
    yAxis: {
      type: 'category',
      data: rows.map((r) => r.name),
      axisLabel: { fontSize: 10, width: 110, overflow: 'truncate' },
    },
    series: [
      {
        type: 'bar',
        data: rows.map((r) => ({
          value: r.value,
          itemStyle: {
            color:
              r.value === null
                ? '#94A3B8'
                : r.value <= r.trig
                  ? '#B91C1C'
                  : r.value <= r.warn
                    ? '#B45309'
                    : '#1A7F37',
          },
        })),
        barWidth: 16,
        label: {
          show: true,
          position: 'right',
          fontSize: 10,
          formatter: (p: { value: number | null }) =>
            p.value === null || p.value === undefined
              ? 'N/A'
              : Number(p.value).toFixed(1),
        },
        markLine: {
          symbol: 'none',
          label: { fontSize: 9, color: '#B91C1C' },
          lineStyle: { type: 'dashed', color: '#B91C1C' },
          data: [{ xAxis: 0 }],
        },
      },
    ],
  };

  return (
    <div className="panel flex h-full flex-col p-3">
      <div className="mb-1 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-navy">做市商敞口</h3>
          <p className="text-[10px] text-navy-soft">
            Dealer Agg Gamma ({DEALER_GAMMA_FLOOR}B 底线) / SPX GEX / Net Delta
            · 估算 · <span className="text-warn">情景模拟</span>
          </p>
        </div>
        <span className="text-[10px] text-navy-soft">{formatAsOf(asOf)}</span>
      </div>
      <ReactECharts
        option={option}
        style={{ height: 200 }}
        opts={{ renderer: 'svg' }}
      />
      <div className="mt-1 text-[10px] text-navy-muted">
        距离 {DEALER_GAMMA_FLOOR}B 历史底线缓冲：
        <span className="font-mono font-semibold text-navy">
          {snap.dealerGamma.value === null
            ? 'N/A'
            : `${formatNum(snap.dealerGamma.value - DEALER_GAMMA_FLOOR, 1)} $B`}
        </span>
        · 方法：OI×γ×S² 估算（非交易所披露）
      </div>
    </div>
  );
}

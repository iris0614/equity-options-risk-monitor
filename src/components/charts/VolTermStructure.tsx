import ReactECharts from 'echarts-for-react';
import type { IndicatorSnapshot, MarketSeriesPoint } from '../../types';
import { formatAsOf } from '../../utils/format';

interface Props {
  snap: IndicatorSnapshot;
  series: MarketSeriesPoint[];
  asOf: string;
  vixTrigger: number;
}

export function VolTermStructure({ snap, series, asOf, vixTrigger }: Props) {
  const vix9d = snap.vix9dVix.value !== null && snap.vix.value !== null
    ? snap.vix.value * snap.vix9dVix.value
    : null;
  const vix = snap.vix.value;
  const vix3m =
    snap.vixVxv.value !== null && snap.vix.value !== null
      ? snap.vix.value / snap.vixVxv.value
      : null;

  const option = {
    color: ['#B91C1C', '#1D4ED8', '#0F766E'],
    tooltip: {
      trigger: 'axis',
      valueFormatter: (v: number | null) =>
        v === null || v === undefined ? 'N/A' : `${Number(v).toFixed(2)}`,
    },
    legend: {
      data: ['当前期限结构'],
      top: 0,
      textStyle: { fontSize: 11 },
    },
    grid: { left: 40, right: 16, top: 36, bottom: 28 },
    xAxis: {
      type: 'category',
      data: ['VIX9D', 'VIX', 'VIX3M'],
      axisLabel: { fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      name: '指数点',
      nameTextStyle: { fontSize: 10 },
      axisLabel: { fontSize: 10 },
      splitLine: { lineStyle: { color: '#E8EDF4' } },
    },
    series: [
      {
        name: '当前期限结构',
        type: 'line',
        data: [vix9d, vix, vix3m],
        symbolSize: 8,
        lineStyle: { width: 2.5, color: '#1D4ED8' },
        itemStyle: { color: '#1D4ED8' },
        markLine: {
          symbol: 'none',
          label: {
            formatter: `Vanna 观察线 ${vixTrigger}`,
            fontSize: 10,
            color: '#B91C1C',
          },
          lineStyle: { type: 'dashed', color: '#B91C1C' },
          data: [{ yAxis: vixTrigger }],
        },
      },
    ],
  };

  // Dual panel: point structure + small history
  const histOption = {
    color: ['#B91C1C', '#1D4ED8', '#0F766E'],
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['VIX9D', 'VIX', 'VIX3M'],
      top: 0,
      textStyle: { fontSize: 10 },
    },
    grid: { left: 36, right: 12, top: 28, bottom: 24 },
    xAxis: {
      type: 'category',
      data: series.map((p) => p.date.slice(5)),
      axisLabel: { fontSize: 9 },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#E8EDF4' } },
      axisLabel: { fontSize: 9 },
    },
    series: [
      {
        name: 'VIX9D',
        type: 'line',
        data: series.map((p) => p.vix9d),
        showSymbol: false,
      },
      {
        name: 'VIX',
        type: 'line',
        data: series.map((p) => p.vix),
        showSymbol: false,
      },
      {
        name: 'VIX3M',
        type: 'line',
        data: series.map((p) => p.vix3m),
        showSymbol: false,
      },
    ],
  };

  return (
    <div className="panel flex h-full flex-col p-3">
      <div className="mb-1 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-navy">波动率期限结构</h3>
          <p className="text-[10px] text-navy-soft">
            VIX9D / VIX / VIX3M · 单位：指数点 ·{' '}
            <span className="text-warn">情景模拟</span>
          </p>
        </div>
        <span className="text-[10px] text-navy-soft">{formatAsOf(asOf)}</span>
      </div>
      <ReactECharts option={option} style={{ height: 160 }} opts={{ renderer: 'svg' }} />
      <ReactECharts
        option={histOption}
        style={{ height: 120 }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}

import ReactECharts from 'echarts-for-react';
import type { IndicatorSnapshot, ThresholdBand, IndicatorId } from '../../types';

interface Props {
  snap: IndicatorSnapshot;
  thresholds: Record<IndicatorId, ThresholdBand>;
  asOf: string;
}

/** Category colors from original embed (灰 / 橙 / 蓝). */
const CURRENT_COLORS = ['#64748B', '#EA580C', '#1D4ED8'] as const;
const RED_LINES = [0.8, 1.25, 1.25] as const;

function flowBadge(
  equity: number | null,
  total: number | null,
  index: number | null,
): { text: string; className: string } {
  if (
    index !== null &&
    equity !== null &&
    index >= 1.25 &&
    equity >= 0.8
  ) {
    return {
      text: '宏观全面防御',
      className: 'bg-red-50 text-danger',
    };
  }
  if (
    (equity !== null && equity >= 0.68) ||
    (total !== null && total >= 1.0)
  ) {
    return {
      text: '个股率先发力',
      className: 'bg-amber-50 text-warn',
    };
  }
  return {
    text: '结构平稳',
    className: 'bg-emerald-50 text-ok',
  };
}

export function PutCallChart({ snap, thresholds: _thresholds, asOf: _asOf }: Props) {
  void _thresholds;
  void _asOf;
  const equity = snap.equityPc.value;
  const total = snap.totalPc.value;
  const index = snap.indexPc.value;
  const current = [equity, total, index];
  const badge = flowBadge(equity, total, index);

  const option = {
    color: ['#64748B', '#FECACA'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      valueFormatter: (v: number) => Number(v).toFixed(2),
    },
    legend: {
      data: [
        { name: '当前数值', itemStyle: { color: '#64748B' } },
        {
          name: '红线阈值',
          itemStyle: {
            color: 'rgba(254, 226, 226, 0.55)',
            borderColor: '#EF4444',
            borderWidth: 1.5,
          },
        },
      ],
      bottom: 0,
      textStyle: { fontSize: 11, color: '#3D4F66' },
      itemWidth: 12,
      itemHeight: 12,
    },
    grid: { left: 40, right: 12, top: 12, bottom: 52 },
    xAxis: {
      type: 'category',
      data: ['个股 P/C（灰线）', '全市场 P/C（橙线）', '指数 P/C（蓝线）'],
      axisLabel: {
        fontSize: 10,
        color: '#3D4F66',
        interval: 0,
        hideOverlap: false,
      },
      axisTick: { show: false },
      axisLine: { lineStyle: { color: '#D8DEE8' } },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 1.6,
      interval: 0.2,
      splitLine: { lineStyle: { color: '#E8EDF4' } },
      axisLabel: { fontSize: 10, color: '#5A6B7F' },
    },
    series: [
      {
        name: '当前数值',
        type: 'bar',
        barWidth: 22,
        barGap: '30%',
        itemStyle: { color: '#64748B', borderRadius: [4, 4, 0, 0] },
        data: current.map((v, i) => ({
          value: v,
          itemStyle: {
            color: v === null ? '#94A3B8' : CURRENT_COLORS[i],
            borderRadius: [4, 4, 0, 0],
          },
        })),
      },
      {
        name: '红线阈值',
        type: 'bar',
        barWidth: 22,
        itemStyle: {
          color: 'rgba(254, 226, 226, 0.55)',
          borderColor: '#EF4444',
          borderWidth: 1.5,
          borderRadius: [4, 4, 0, 0],
        },
        data: [...RED_LINES],
      },
    ],
  };

  return (
    <div className="panel flex h-full flex-col p-3">
      <div className="mb-1 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-navy">
            期权流量扩散对比（CBOE Put/Call）
          </h3>
          <p className="text-[10px] text-navy-soft">
            当前量能比 vs 风险扩散红线阈值（0.80 / 1.25 / 1.25）
          </p>
        </div>
        <span
          className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold ${badge.className}`}
        >
          {badge.text}
        </span>
      </div>
      <ReactECharts
        option={option}
        style={{ height: 240 }}
        opts={{ renderer: 'svg' }}
        notMerge
      />
      <div className="mt-1 flex items-start justify-between gap-2 text-[10px] text-navy-muted">
        <p>结构特征：接近 2022 年初个股率先抬头特征</p>
        <p className="shrink-0 text-navy-soft">基准红线：1.25</p>
      </div>
    </div>
  );
}

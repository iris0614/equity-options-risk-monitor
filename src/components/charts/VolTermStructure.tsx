import ReactECharts from 'echarts-for-react';
import type { IndicatorSnapshot, MarketSeriesPoint } from '../../types';
import { VANNA_VIX_LINE } from '../../config/indicators';
import { formatNum } from '../../utils/format';

interface Props {
  snap: IndicatorSnapshot;
  series: MarketSeriesPoint[];
  asOf: string;
  vixTrigger: number;
}

export function VolTermStructure({ snap, series: _series, vixTrigger }: Props) {
  void _series;
  const threshold = vixTrigger || VANNA_VIX_LINE;

  const vix = snap.vix.value;
  const vix9d =
    snap.vix9dVix.value !== null && vix !== null
      ? Math.round(vix * snap.vix9dVix.value * 10) / 10
      : null;
  const vxv =
    snap.vixVxv.value !== null && vix !== null
      ? Math.round((vix / snap.vixVxv.value) * 10) / 10
      : null;

  const backwardation =
    (snap.vixVxv.value !== null && snap.vixVxv.value > 1) ||
    (snap.vix9dVix.value !== null && snap.vix9dVix.value > 1);

  const option = {
    color: ['#DC2626', '#94A3B8'],
    tooltip: {
      trigger: 'axis',
      valueFormatter: (v: number | null) =>
        v === null || v === undefined ? 'N/A' : Number(v).toFixed(1),
    },
    legend: {
      data: [
        { name: '当前期限结构', itemStyle: { color: '#DC2626' } },
        {
          name: `Vanna 触发阈值 (${threshold.toFixed(1)})`,
          itemStyle: { color: '#94A3B8' },
          lineStyle: { type: 'dashed', color: '#94A3B8' },
        },
      ],
      bottom: 0,
      textStyle: { fontSize: 11, color: '#3D4F66' },
      itemWidth: 14,
      itemHeight: 10,
    },
    grid: { left: 36, right: 16, top: 16, bottom: 44 },
    xAxis: {
      type: 'category',
      data: ['VIX9D (9天超短端)', 'VIX (30天基准)', 'VXV (3个月季度端)'],
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
      min: 10,
      max: 40,
      interval: 5,
      splitLine: { lineStyle: { color: '#E8EDF4' } },
      axisLabel: { fontSize: 10, color: '#5A6B7F' },
    },
    series: [
      {
        name: '当前期限结构',
        type: 'line',
        data: [vix9d, vix, vxv],
        symbol: 'circle',
        symbolSize: 10,
        showSymbol: true,
        lineStyle: { width: 3, color: '#DC2626' },
        itemStyle: {
          color: '#FFFFFF',
          borderColor: '#DC2626',
          borderWidth: 2,
        },
        areaStyle: { color: 'rgba(220, 38, 38, 0.08)' },
        z: 3,
      },
      {
        name: `Vanna 触发阈值 (${threshold.toFixed(1)})`,
        type: 'line',
        data: [threshold, threshold, threshold],
        symbol: 'none',
        lineStyle: { width: 1.5, type: 'dashed', color: '#94A3B8' },
        itemStyle: { color: '#94A3B8' },
        silent: true,
        z: 1,
      },
    ],
  };

  return (
    <div className="panel flex h-full flex-col p-3">
      <div className="mb-1 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-navy">
            波动率期限结构曲线
          </h3>
          <p className="text-[10px] text-navy-soft">
            VIX9D / VIX 30D / VXV 3M 实时推算（虚线为 {threshold.toFixed(1)}{' '}
            Vanna 阈值）
          </p>
        </div>
        <span
          className={`shrink-0 rounded px-2 py-0.5 text-[11px] font-semibold ${
            backwardation
              ? 'bg-red-50 text-danger'
              : 'bg-emerald-50 text-ok'
          }`}
        >
          {backwardation ? 'Backwardation 倒挂' : 'Contango 升水'}
        </span>
      </div>

      <ReactECharts
        option={option}
        style={{ height: 220 }}
        opts={{ renderer: 'svg' }}
        notMerge
      />

      <div className="mt-2 grid grid-cols-3 gap-2 border-t border-line pt-2 text-center">
        <div>
          <p className="text-[10px] text-navy-soft">VIX9D（推算）</p>
          <p className="font-mono text-base font-semibold text-navy">
            {formatNum(vix9d, 1)}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-navy-soft">VIX（30D基准）</p>
          <p className="font-mono text-base font-semibold text-navy">
            {formatNum(vix, 1)}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-navy-soft">VXV（3M推算）</p>
          <p className="font-mono text-base font-semibold text-navy">
            {formatNum(vxv, 1)}
          </p>
        </div>
      </div>
    </div>
  );
}

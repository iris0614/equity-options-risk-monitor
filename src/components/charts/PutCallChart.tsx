import ReactECharts from 'echarts-for-react';
import type { IndicatorSnapshot, ThresholdBand, IndicatorId } from '../../types';
import { formatAsOf } from '../../utils/format';

interface Props {
  snap: IndicatorSnapshot;
  thresholds: Record<IndicatorId, ThresholdBand>;
  asOf: string;
}

export function PutCallChart({ snap, thresholds, asOf }: Props) {
  const cats = ['个股 P/C', '全市场 P/C', '指数 P/C'];
  const current = [snap.equityPc.value, snap.totalPc.value, snap.indexPc.value];
  const warn = [
    thresholds.equityPc.warning,
    thresholds.totalPc.warning,
    thresholds.indexPc.warning,
  ];
  const trig = [
    thresholds.equityPc.triggered,
    thresholds.totalPc.triggered,
    thresholds.indexPc.triggered,
  ];

  const option = {
    color: ['#1D4ED8', '#94A3B8', '#B91C1C'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      valueFormatter: (v: number) => Number(v).toFixed(2),
    },
    legend: {
      data: ['当前', '警戒线', '触发线'],
      top: 0,
      textStyle: { fontSize: 11 },
    },
    grid: { left: 40, right: 12, top: 36, bottom: 28 },
    xAxis: {
      type: 'category',
      data: cats,
      axisLabel: { fontSize: 11 },
    },
    yAxis: {
      type: 'value',
      name: '比率',
      nameTextStyle: { fontSize: 10 },
      splitLine: { lineStyle: { color: '#E8EDF4' } },
    },
    series: [
      {
        name: '当前',
        type: 'bar',
        barWidth: 18,
        data: current,
        itemStyle: {
          color: (params: { dataIndex: number; value: number | null }) => {
            const v = params.value;
            if (v === null || v === undefined) return '#94A3B8';
            if (v >= trig[params.dataIndex]!) return '#B91C1C';
            if (v >= warn[params.dataIndex]!) return '#B45309';
            return '#1D4ED8';
          },
        },
      },
      {
        name: '警戒线',
        type: 'bar',
        barWidth: 10,
        data: warn,
        itemStyle: {
          color: 'transparent',
          borderColor: '#94A3B8',
          borderWidth: 1.5,
        },
      },
      {
        name: '触发线',
        type: 'bar',
        barWidth: 10,
        data: trig,
        itemStyle: {
          color: 'transparent',
          borderColor: '#B91C1C',
          borderWidth: 1.5,
          borderType: 'dashed',
        },
      },
    ],
  };

  return (
    <div className="panel flex h-full flex-col p-3">
      <div className="mb-1 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-navy">Put/Call 与阈值</h3>
          <p className="text-[10px] text-navy-soft">
            CBOE 风格比率 · <span className="text-warn">情景模拟</span>
          </p>
        </div>
        <span className="text-[10px] text-navy-soft">{formatAsOf(asOf)}</span>
      </div>
      <ReactECharts
        option={option}
        style={{ height: 280 }}
        opts={{ renderer: 'svg' }}
      />
    </div>
  );
}

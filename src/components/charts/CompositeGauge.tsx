import ReactECharts from 'echarts-for-react';
import type { CompositeScore, MarketSeriesPoint } from '../../types';
import { formatAsOf } from '../../utils/format';

interface Props {
  score: CompositeScore;
  series: MarketSeriesPoint[];
  asOf: string;
}

export function CompositePanel({ score, series, asOf }: Props) {
  const s = score.score;
  const gauge = {
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        radius: '95%',
        center: ['50%', '60%'],
        axisLine: {
          lineStyle: {
            width: 12,
            color: [
              [0.3, '#1A7F37'],
              [0.5, '#B45309'],
              [0.7, '#C2410C'],
              [0.85, '#B91C1C'],
              [1, '#7F1D1D'],
            ],
          },
        },
        pointer: {
          length: '55%',
          width: 4,
          itemStyle: { color: '#0F1C2E' },
        },
        axisTick: { show: false },
        splitLine: { length: 8, lineStyle: { color: '#94A3B8' } },
        axisLabel: { distance: 14, fontSize: 9, color: '#5A6B7F' },
        detail: {
          valueAnimation: true,
          formatter: s === null ? 'N/A' : `{value}`,
          fontSize: 22,
          fontWeight: 600,
          color: score.band?.color ?? '#5A6B7F',
          offsetCenter: [0, '30%'],
        },
        data: [{ value: s ?? 0 }],
      },
    ],
  };

  const hist = {
    color: ['#B91C1C'],
    tooltip: { trigger: 'axis' },
    grid: { left: 36, right: 12, top: 16, bottom: 24 },
    xAxis: {
      type: 'category',
      data: series.map((p) => p.date.slice(5)),
      axisLabel: { fontSize: 9 },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      splitLine: { lineStyle: { color: '#E8EDF4' } },
      axisLabel: { fontSize: 9 },
    },
    series: [
      {
        name: '综合分',
        type: 'line',
        data: series.map((p) => p.score),
        areaStyle: { color: 'rgba(185,28,28,0.08)' },
        showSymbol: true,
        symbolSize: 6,
        markLine: {
          symbol: 'none',
          label: { fontSize: 9 },
          data: [
            {
              yAxis: 70,
              lineStyle: { type: 'dashed', color: '#B91C1C' },
              label: { formatter: '脆弱 70' },
            },
          ],
        },
      },
    ],
  };

  return (
    <div className="panel grid gap-2 p-3 md:grid-cols-2">
      <div>
        <div className="mb-1 flex items-start justify-between">
          <div>
            <h3 className="text-sm font-semibold text-navy">综合评分仪表</h3>
            <p className="text-[10px] text-navy-soft">
              0–100 加权压力 · 非崩盘概率 ·{' '}
              <span className="text-warn">情景模拟</span>
            </p>
          </div>
          <span className="text-[10px] text-navy-soft">{formatAsOf(asOf)}</span>
        </div>
        <ReactECharts
          option={gauge}
          style={{ height: 180 }}
          opts={{ renderer: 'svg' }}
        />
      </div>
      <div>
        <h3 className="mb-1 text-sm font-semibold text-navy">评分历史序列</h3>
        <ReactECharts
          option={hist}
          style={{ height: 180 }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    </div>
  );
}

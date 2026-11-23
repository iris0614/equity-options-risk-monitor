import { DIMENSION_LABELS } from '../config/indicators';
import type { CompositeScore, DimensionWeights } from '../types';

interface Props {
  score: CompositeScore;
  weights: DimensionWeights;
}

export function ScoreTrace({ score, weights }: Props) {
  return (
    <section className="panel p-3 md:p-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-navy">
            评分计算轨迹（原始站点公式）
          </h2>
          <p className="text-[11px] text-navy-soft">
            波动 25 + 期限 15 + 做市商 30 + 离散 15 + 流量 15 = 100 · SKEW/DSPX/NVDA
            不计入
          </p>
        </div>
        <p className="max-w-xl text-[11px] text-warn">{score.disclaimer}</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="overflow-x-auto rounded border border-line">
          <table className="w-full min-w-[420px] text-left text-xs">
            <thead className="bg-canvas text-[10px] uppercase text-navy-soft">
              <tr>
                <th className="px-2 py-1.5">分量</th>
                <th className="px-2 py-1.5">得分</th>
                <th className="px-2 py-1.5">上限</th>
              </tr>
            </thead>
            <tbody>
              {score.components.map((c) => (
                <tr key={c.name} className="border-t border-line">
                  <td className="px-2 py-1.5 font-medium text-navy">{c.name}</td>
                  <td className="px-2 py-1.5 font-mono">
                    {c.points.toFixed(2)}
                  </td>
                  <td className="px-2 py-1.5 font-mono">{c.cap}</td>
                </tr>
              ))}
              <tr className="border-t border-line bg-canvas font-semibold">
                <td className="px-2 py-1.5">综合（Math.round）</td>
                <td className="px-2 py-1.5 font-mono" colSpan={2}>
                  {score.score === null ? 'N/A' : score.score}
                  {score.band
                    ? ` · ${score.band.labelZh} (${score.band.min}–${score.band.max})`
                    : ''}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="space-y-2 rounded border border-line p-3">
          <p className="text-xs font-semibold text-navy">维度权重上限（文档对齐）</p>
          <p className="text-[10px] text-navy-soft">
            评分由原始公式硬编码分量决定；下列权重用于界面说明，不改写公式结果。
          </p>
          {(Object.keys(weights) as (keyof DimensionWeights)[]).map((key) => (
            <div key={key} className="flex items-center gap-2 text-xs">
              <span className="w-36 text-navy-muted">
                {DIMENSION_LABELS[key].zh}
              </span>
              <span className="font-mono text-navy">{weights[key]}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

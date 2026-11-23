import { DIMENSION_LABELS } from '../config/indicators';
import type { CompositeScore, DimensionWeights } from '../types';

interface Props {
  score: CompositeScore;
  weights: DimensionWeights;
  onWeight: (key: keyof DimensionWeights, value: number) => void;
}

export function ScoreTrace({
  score,
  weights,
  onWeight,
}: Props) {
  const weightSum =
    weights.dispersion +
    weights.volLiquidity +
    weights.termTail +
    weights.putCall +
    weights.dealer;

  return (
    <section className="panel p-3 md:p-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-navy">评分计算轨迹与权重</h2>
          <p className="text-[11px] text-navy-soft">
            初始权重 15 / 20 / 25 / 15 / 25 · 当前合计 {weightSum}%
          </p>
        </div>
        <p className="max-w-xl text-[11px] text-warn">{score.disclaimer}</p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="overflow-x-auto rounded border border-line">
          <table className="w-full min-w-[420px] text-left text-xs">
            <thead className="bg-canvas text-[10px] uppercase text-navy-soft">
              <tr>
                <th className="px-2 py-1.5">维度</th>
                <th className="px-2 py-1.5">得分</th>
                <th className="px-2 py-1.5">权重</th>
                <th className="px-2 py-1.5">加权贡献</th>
              </tr>
            </thead>
            <tbody>
              {score.trace.map((t) => (
                <tr key={t.dimension} className="border-t border-line">
                  <td className="px-2 py-1.5 font-medium text-navy">
                    {DIMENSION_LABELS[t.dimension].zh}
                  </td>
                  <td className="px-2 py-1.5 font-mono">
                    {t.dimensionScore === null ? 'N/A' : t.dimensionScore.toFixed(1)}
                  </td>
                  <td className="px-2 py-1.5 font-mono">{t.weight}%</td>
                  <td className="px-2 py-1.5 font-mono">
                    {t.weighted === null ? 'N/A' : t.weighted.toFixed(1)}
                  </td>
                </tr>
              ))}
              <tr className="border-t border-line bg-canvas font-semibold">
                <td className="px-2 py-1.5">综合</td>
                <td className="px-2 py-1.5 font-mono" colSpan={3}>
                  {score.score === null ? 'N/A' : score.score.toFixed(1)}
                  {score.band ? ` · ${score.band.labelZh} (${score.band.min}–${score.band.max})` : ''}
                </td>
              </tr>
            </tbody>
          </table>
          <ul className="space-y-0.5 border-t border-line px-2 py-2 text-[10px] text-navy-muted">
            {score.trace.map((t) => (
              <li key={`d-${t.dimension}`}>{t.detail}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 rounded border border-line p-3">
          <p className="text-xs font-semibold text-navy">自定义权重</p>
          {(
            Object.keys(weights) as (keyof DimensionWeights)[]
          ).map((key) => (
            <label key={key} className="flex items-center gap-2 text-xs">
              <span className="w-28 text-navy-muted">
                {DIMENSION_LABELS[key].zh}
              </span>
              <input
                type="range"
                min={0}
                max={40}
                step={1}
                value={weights[key]}
                onChange={(e) => onWeight(key, Number(e.target.value))}
                className="flex-1"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={weights[key]}
                onChange={(e) => onWeight(key, Number(e.target.value))}
                className="w-14 rounded border border-line px-1 py-0.5 font-mono"
              />
              <span className="text-navy-soft">%</span>
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

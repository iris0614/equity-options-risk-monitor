import { DIMENSION_LABELS } from '../config/indicators';
import type { CompositeScore, DimensionId, IndicatorId } from '../types';
import { IndicatorCard } from './IndicatorCard';

interface Props {
  score: CompositeScore;
  onChange: (id: IndicatorId, value: number | null) => void;
}

const ORDER: DimensionId[] = [
  'dispersion',
  'volLiquidity',
  'termTail',
  'putCall',
  'dealer',
];

export function IndicatorGrid({ score, onChange }: Props) {
  return (
    <section className="panel p-3 md:p-4">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-navy">
          五大维度核心指标实时监控与压力测试
        </h2>
        <p className="text-[11px] text-navy-soft">
          支持直接输入或拖动滑块推演 · 即时重算评分 / 阶段 / 清单 · 缺失显示
          N/A
        </p>
      </div>
      <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {ORDER.map((dimId) => {
          const dim = score.dimensions.find((d) => d.id === dimId)!;
          const labels = DIMENSION_LABELS[dimId];
          return (
            <div key={dimId} className="rounded border border-line bg-white p-2.5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-xs font-semibold text-navy">
                    {labels.zh}
                  </h3>
                  <p className="text-[10px] text-navy-soft">
                    {labels.subtitle}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold text-navy">
                    {dim.score === null ? 'N/A' : dim.score.toFixed(0)}
                  </p>
                  <p className="text-[10px] text-navy-soft">权重 {dim.weight}%</p>
                </div>
              </div>
              <div className="space-y-2">
                {dim.indicators.map((ind) => (
                  <IndicatorCard
                    key={ind.id}
                    evalItem={ind}
                    onChange={onChange}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

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
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-navy">
            <span className="inline-block h-4 w-1 rounded-sm bg-navy" />
            五大维度核心指标实时监控与压力测试（支持直接输入或拖动滑块推演）
          </h2>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-navy-muted">
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-ok" />
            正常
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-warn" />
            警戒
          </span>
          <span className="inline-flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-danger" />
            触发红线
          </span>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {ORDER.map((dimId) => {
          const dim = score.dimensions.find((d) => d.id === dimId)!;
          const labels = DIMENSION_LABELS[dimId];
          return (
            <div
              key={dimId}
              className="flex flex-col justify-between rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="mb-1">
                <h3 className="text-sm font-semibold text-navy">
                  {labels.zh}
                </h3>
                <p className="text-[11px] text-slate-400">{labels.subtitle}</p>
              </div>
              <div>
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

import { STAGE_DEFS } from '../config/stages';
import type { StageResult } from '../types';
import { stageStateLabel } from '../utils/format';

interface Props {
  stages: StageResult;
}

function stateStyles(state: string) {
  switch (state) {
    case 'active':
      return 'border-danger bg-red-50 stage-active';
    case 'observing':
      return 'border-line bg-white';
    case 'passed':
      return 'border-slate-300 bg-slate-50';
    default:
      return 'border-line bg-white';
  }
}

export function StageCards({ stages }: Props) {
  return (
    <section className="panel p-3 md:p-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-navy">
            期权微观结构四阶段演化与负反馈闭环
          </h2>
          <p className="text-[11px] text-navy-soft">
            非必然线性 · 原始站点优先级判定
          </p>
        </div>
        {stages.nonLinearNote && (
          <p className="max-w-2xl text-[11px] leading-snug text-navy-muted">
            {stages.nonLinearNote}
          </p>
        )}
      </div>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
        {STAGE_DEFS.map((def) => {
          const j = stages.judgments.find((x) => x.id === def.id)!;
          return (
            <article
              key={def.id}
              className={`rounded border-2 p-3 transition ${stateStyles(j.state)}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-mono text-xs font-semibold text-navy-soft">
                    {def.id}
                  </p>
                  <h3 className="text-sm font-semibold text-navy">
                    {def.nameZh}
                  </h3>
                </div>
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                    j.state === 'active'
                      ? 'bg-danger text-white'
                      : 'bg-slate-200 text-navy-muted'
                  }`}
                >
                  {stageStateLabel(j.state)}
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-snug text-navy-muted">
                {def.description}
              </p>
              <p className="mt-2 text-[11px] leading-snug text-navy">
                {j.rationale}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}

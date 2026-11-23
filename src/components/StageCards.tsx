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
    case 'conflict':
      return 'border-amber-500 bg-amber-50';
    case 'observing':
      return 'border-amber-400 bg-amber-50/60';
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
          <h2 className="text-sm font-semibold text-navy">四阶段风险演进</h2>
          <p className="text-[11px] text-navy-soft">
            非必然线性 · 支持跳跃 / 反复 / 冲突
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
          const reqHits = j.enterEvals.filter(
            (e) => e.condition.required && e.satisfied,
          ).length;
          const reqTotal = j.enterEvals.filter((e) => e.condition.required)
            .length;
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
                      : j.state === 'conflict'
                        ? 'bg-warn text-white'
                        : 'bg-slate-200 text-navy-muted'
                  }`}
                >
                  {stageStateLabel(j.state)}
                </span>
              </div>
              <p className="mt-1 text-[11px] leading-snug text-navy-muted">
                {def.name}
              </p>
              <p className="mt-2 text-[11px] leading-snug text-navy">
                {j.rationale}
              </p>
              <div className="mt-2 space-y-0.5 border-t border-line/80 pt-2">
                <p className="text-[10px] text-navy-soft">
                  进入条件满足 {j.enterSatisfied}/{j.enterRequired} · 必要{' '}
                  {reqHits}/{reqTotal}
                </p>
                <ul className="max-h-20 space-y-0.5 overflow-auto text-[10px] text-navy-muted">
                  {j.enterEvals.map((e) => (
                    <li key={`${def.id}-${e.condition.indicatorId}-${e.condition.level}`}>
                      <span
                        className={
                          e.satisfied ? 'text-ok' : 'text-navy-soft'
                        }
                      >
                        {e.satisfied ? '✓' : '○'}
                      </span>{' '}
                      {e.condition.indicatorId} {e.condition.op}{' '}
                      {e.condition.level}
                      {e.condition.required ? ' *' : ''}
                      {e.value === null ? ' (N/A)' : ` (${e.value})`}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

import { STAGE_DEFS } from '../config/stages';
import type { StageId, StageResult } from '../types';
import { stageStateLabel } from '../utils/format';

interface Props {
  stages: StageResult;
}

/** Active card theme per stage: 1 green / 2 yellow / 3 red / 4 blue */
const ACTIVE_THEME: Record<
  StageId,
  { card: string; badge: string }
> = {
  '01': {
    card: 'border-emerald-500 bg-emerald-50',
    badge: 'bg-emerald-600 text-white',
  },
  '02': {
    card: 'border-amber-400 bg-amber-50',
    badge: 'bg-amber-500 text-white',
  },
  '03': {
    card: 'border-danger bg-red-50',
    badge: 'bg-danger text-white',
  },
  '04': {
    card: 'border-sky-500 bg-sky-50',
    badge: 'bg-sky-600 text-white',
  },
};

function cardStyles(id: StageId, state: string) {
  if (state === 'active') return ACTIVE_THEME[id].card;
  if (state === 'passed') return 'border-slate-300 bg-slate-50';
  return 'border-line bg-white';
}

function badgeStyles(id: StageId, state: string) {
  if (state === 'active') return ACTIVE_THEME[id].badge;
  return 'bg-slate-200 text-navy-muted';
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
              className={`rounded border-2 p-3 transition ${cardStyles(def.id, j.state)}`}
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
                  className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${badgeStyles(def.id, j.state)}`}
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

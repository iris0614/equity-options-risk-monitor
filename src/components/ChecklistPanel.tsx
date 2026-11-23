import {
  ESCALATION_CHECKLIST,
  REPAIR_CHECKLIST,
} from '../config/checklists';
import type { ChecklistItemState } from '../types';

interface Props {
  escalation: ChecklistItemState[];
  repair: ChecklistItemState[];
  onToggleEsc: (id: string) => void;
  onToggleRep: (id: string) => void;
}

function List({
  title,
  subtitle,
  countLabel,
  titleClass,
  defs,
  states,
  onToggle,
  triggeredLabel,
  idleLabel,
}: {
  title: string;
  subtitle: string;
  countLabel: string;
  titleClass: string;
  defs: typeof ESCALATION_CHECKLIST;
  states: ChecklistItemState[];
  onToggle: (id: string) => void;
  triggeredLabel: string;
  idleLabel: string;
}) {
  const byId = Object.fromEntries(states.map((s) => [s.id, s]));
  const autoCount = states.filter((s) => s.autoTriggered).length;
  return (
    <div className="rounded border border-line bg-white">
      <div
        className={`rounded-t px-3 py-2 text-xs font-semibold text-white ${titleClass}`}
      >
        <div className="flex items-center justify-between gap-2">
          <span>{title}</span>
          <span className="rounded bg-white/20 px-1.5 py-0.5 text-[10px]">
            {countLabel}: {autoCount}/4
          </span>
        </div>
        <p className="mt-0.5 text-[10px] font-normal text-white/90">
          {subtitle}
        </p>
      </div>
      <ul className="divide-y divide-line">
        {defs.map((d) => {
          const st = byId[d.id]!;
          const on = st.autoTriggered || st.manualConfirmed;
          return (
            <li
              key={d.id}
              className={`flex items-start gap-2 px-3 py-2 text-xs ${
                on ? 'bg-slate-50' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={st.manualConfirmed}
                onChange={() => onToggle(d.id)}
                className="mt-0.5"
                title="人工确认"
              />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-navy">{d.labelZh}</p>
                {d.sub && (
                  <p className="text-[10px] text-navy-soft">{d.sub}</p>
                )}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-0.5">
                {st.autoTriggered ? (
                  <span className="status-triggered">{triggeredLabel}</span>
                ) : (
                  <span className="status-na">{idleLabel}</span>
                )}
                {st.manualConfirmed && (
                  <span className="status-warning">人工确认</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ChecklistPanel({
  escalation,
  repair,
  onToggleEsc,
  onToggleRep,
}: Props) {
  return (
    <section className="panel p-3 md:p-4">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-navy">
          每日复盘 Checklist（人工勾选 + 指标自动高亮）
        </h2>
        <p className="text-[11px] text-navy-soft">
          左侧监控“踩踏向宏观全面防御扩散”，右侧监控“OPEX 交割重置与反向 Vanna
          修复”
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <List
          title="风险升级确认项（向全市场扩散）"
          subtitle="满足越多，下行加速风险越高"
          countLabel="风险触发"
          titleClass="bg-danger"
          defs={ESCALATION_CHECKLIST}
          states={escalation}
          onToggle={onToggleEsc}
          triggeredLabel="指标已触发"
          idleLabel="未触发"
        />
        <List
          title="止跌与 OPEX 重置确认项（反向 VANNA 修复）"
          subtitle="满足越多，空头回补概率越高"
          countLabel="修复触发"
          titleClass="bg-ok"
          defs={REPAIR_CHECKLIST}
          states={repair}
          onToggle={onToggleRep}
          triggeredLabel="条件满足"
          idleLabel="未满足"
        />
      </div>
    </section>
  );
}

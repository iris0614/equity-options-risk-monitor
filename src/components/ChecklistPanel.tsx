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
  defs,
  states,
  onToggle,
  triggeredLabel,
  idleLabel,
  tone,
}: {
  title: string;
  subtitle: string;
  defs: typeof ESCALATION_CHECKLIST;
  states: ChecklistItemState[];
  onToggle: (id: string) => void;
  triggeredLabel: string;
  idleLabel: string;
  tone: 'danger' | 'ok';
}) {
  const byId = Object.fromEntries(states.map((s) => [s.id, s]));
  const headerBg = tone === 'danger' ? 'bg-danger' : 'bg-ok';

  return (
    <div className="rounded-lg border border-line bg-white">
      <div className={`rounded-t-lg px-3 py-2 text-xs font-semibold text-white ${headerBg}`}>
        <div className="flex items-start justify-between gap-2">
          <span>{title}</span>
        </div>
        <p className="mt-0.5 text-[10px] font-normal text-white/90">
          {subtitle}
        </p>
      </div>
      <ul className="space-y-2 p-2.5">
        {defs.map((d) => {
          const st = byId[d.id]!;
          const autoOn = st.autoTriggered;
          const checked = autoOn || st.manualConfirmed;
          const rowTone =
            autoOn && tone === 'danger'
              ? 'border-red-300 bg-red-50'
              : autoOn && tone === 'ok'
                ? 'border-emerald-300 bg-emerald-50'
                : 'border-slate-200 bg-white';

          return (
            <li
              key={d.id}
              className={`flex items-start gap-2.5 rounded-md border px-2.5 py-2 text-xs ${rowTone}`}
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(d.id)}
                className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-blue-600"
                title={
                  autoOn
                    ? '指标已自动触发（可再点人工确认）'
                    : '人工确认'
                }
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-navy">{d.labelZh}</p>
                {d.sub && (
                  <p className="mt-0.5 text-[10px] text-navy-soft">{d.sub}</p>
                )}
              </div>
              <div className="flex shrink-0 flex-col items-end gap-0.5">
                {autoOn ? (
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-semibold text-white ${
                      tone === 'danger' ? 'bg-danger' : 'bg-ok'
                    }`}
                  >
                    {triggeredLabel}
                  </span>
                ) : (
                  <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500">
                    {idleLabel}
                  </span>
                )}
                {st.manualConfirmed && !autoOn && (
                  <span className="status-warning">人工确认</span>
                )}
                {st.manualConfirmed && autoOn && (
                  <span className="text-[10px] text-navy-soft">已人工确认</span>
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
  const riskCount = escalation.filter((s) => s.autoTriggered).length;
  const repairCount = repair.filter((s) => s.autoTriggered).length;

  return (
    <section className="panel p-3 md:p-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-navy">
            <span className="inline-block h-4 w-1 rounded-sm bg-accent" />
            每日复盘 Checklist（支持人工勾选 + 指标自动高亮触发状态）
          </h2>
          <p className="mt-0.5 text-[11px] text-navy-soft">
            左侧监控“踩踏向宏观全面防御扩散”，右侧监控“OPEX
            交割重置与反向 Vanna 修复”
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-semibold">
          <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-danger">
            风险触发: {riskCount}/4
          </span>
          <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-ok">
            修复触发: {repairCount}/4
          </span>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <List
          title="风险升级确认项（向全市场扩散）"
          subtitle="满足越多，下行加速风险越高"
          defs={ESCALATION_CHECKLIST}
          states={escalation}
          onToggle={onToggleEsc}
          triggeredLabel="指标已触发"
          idleLabel="未触发"
          tone="danger"
        />
        <List
          title="止跌与 OPEX 重置确认项（反向 VANNA 修复）"
          subtitle="满足越多，空头回补概率越高"
          defs={REPAIR_CHECKLIST}
          states={repair}
          onToggle={onToggleRep}
          triggeredLabel="条件满足"
          idleLabel="未满足"
          tone="ok"
        />
      </div>
    </section>
  );
}

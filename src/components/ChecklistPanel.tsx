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
  titleClass,
  defs,
  states,
  onToggle,
}: {
  title: string;
  titleClass: string;
  defs: typeof ESCALATION_CHECKLIST;
  states: ChecklistItemState[];
  onToggle: (id: string) => void;
}) {
  const byId = Object.fromEntries(states.map((s) => [s.id, s]));
  return (
    <div className="rounded border border-line bg-white">
      <div className={`rounded-t px-3 py-2 text-xs font-semibold text-white ${titleClass}`}>
        {title}
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
                <p className="text-[10px] text-navy-soft">{d.label}</p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-0.5">
                {st.autoTriggered ? (
                  <span className="status-triggered">自动触发</span>
                ) : (
                  <span className="status-na">未触发</span>
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
        <h2 className="text-sm font-semibold text-navy">双清单：恶化 / 修复</h2>
        <p className="text-[11px] text-navy-soft">
          自动条件随指标更新 · 勾选表示人工确认
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <List
          title="风险恶化清单 Risk Escalation"
          titleClass="bg-danger"
          defs={ESCALATION_CHECKLIST}
          states={escalation}
          onToggle={onToggleEsc}
        />
        <List
          title="流动性修复清单 Liquidity Repair"
          titleClass="bg-ok"
          defs={REPAIR_CHECKLIST}
          states={repair}
          onToggle={onToggleRep}
        />
      </div>
    </section>
  );
}

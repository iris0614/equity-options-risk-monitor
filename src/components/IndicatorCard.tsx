import { INDICATOR_BY_ID } from '../config/indicators';
import type { IndicatorEval, IndicatorId } from '../types';
import { statusClass, statusLabel } from '../utils/format';

interface Props {
  evalItem: IndicatorEval;
  onChange: (id: IndicatorId, value: number | null) => void;
}

function statusDot(status: IndicatorEval['status']): string {
  switch (status) {
    case 'triggered':
      return 'bg-danger';
    case 'warning':
      return 'bg-warn';
    case 'na':
      return 'bg-slate-300';
    default:
      return 'bg-ok';
  }
}

export function IndicatorCard({ evalItem, onChange }: Props) {
  const def = INDICATOR_BY_ID[evalItem.id];
  const value = evalItem.value;
  const fillPct =
    value === null
      ? 0
      : Math.min(
          100,
          Math.max(0, ((value - def.min) / (def.max - def.min)) * 100),
        );

  return (
    <div className="border-t border-slate-100 py-2.5 first:border-t-0 first:pt-0 last:pb-0">
      <div className="mb-1.5 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-block h-2 w-2 shrink-0 rounded-full ${statusDot(evalItem.status)}`}
            />
            <label
              htmlFor={`num-${def.id}`}
              className="truncate text-xs font-semibold text-navy"
              title={def.tooltip}
            >
              {def.labelZh}
            </label>
          </div>
          <p className="mt-0.5 truncate pl-3.5 text-[11px] text-slate-400">
            {def.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <input
            id={`num-${def.id}`}
            type="number"
            min={def.min}
            max={def.max}
            step={def.step}
            value={value ?? ''}
            placeholder="N/A"
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === '') {
                onChange(def.id, null);
                return;
              }
              const n = Number(raw);
              if (Number.isFinite(n)) onChange(def.id, n);
            }}
            className="w-[68px] rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-right font-mono text-xs tabular-nums text-navy"
          />
          {def.unit ? (
            <span className="w-5 text-[11px] text-slate-400">{def.unit}</span>
          ) : (
            <span className="w-5" />
          )}
          <span className={statusClass(evalItem.status)}>
            {statusLabel(evalItem.status)}
          </span>
        </div>
      </div>

      <div className="relative h-5 pl-3.5">
        <div className="absolute inset-y-0 left-3.5 right-0 flex items-center">
          <div className="relative h-1.5 w-full rounded-full bg-slate-200">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-blue-600/80"
              style={{ width: `${fillPct}%` }}
            />
            <input
              type="range"
              min={def.min}
              max={def.max}
              step={def.step}
              value={value ?? def.min}
              disabled={value === null}
              onChange={(e) => onChange(def.id, Number(e.target.value))}
              className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent accent-blue-600"
              aria-label={def.labelZh}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

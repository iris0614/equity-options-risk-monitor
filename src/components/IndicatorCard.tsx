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

function displayValue(
  value: number | null,
  decimals: number,
): string {
  if (value === null || Number.isNaN(value)) return '';
  return value.toFixed(decimals);
}

export function IndicatorCard({ evalItem, onChange }: Props) {
  const def = INDICATOR_BY_ID[evalItem.id];
  const value = evalItem.value;

  return (
    <div className="border-t border-slate-100 py-2.5 first:border-t-0 first:pt-1.5 last:pb-0">
      {/* Top: label block | value + badge — vertically centered */}
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-block h-2 w-2 shrink-0 rounded-full ${statusDot(evalItem.status)}`}
            />
            <label
              htmlFor={`num-${def.id}`}
              className="truncate text-xs font-semibold text-slate-900"
              title={def.tooltip}
            >
              {def.labelZh}
            </label>
          </div>
          <p className="mt-0.5 truncate pl-3.5 text-[11px] leading-snug text-slate-400">
            {def.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="flex items-center gap-1">
            <input
              id={`num-${def.id}`}
              type="number"
              min={def.min}
              max={def.max}
              step={def.step}
              value={displayValue(value, def.decimals)}
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
              className="w-[72px] rounded-md border border-slate-200 bg-white px-2 py-1 text-right font-mono text-xs font-semibold tabular-nums text-slate-900 shadow-sm"
            />
            {def.unit ? (
              <span className="text-[11px] text-slate-400">{def.unit}</span>
            ) : null}
          </div>
          <span
            className={`${statusClass(evalItem.status)} border ${
              evalItem.status === 'triggered'
                ? 'border-red-200'
                : evalItem.status === 'warning'
                  ? 'border-amber-200'
                  : evalItem.status === 'normal'
                    ? 'border-emerald-200'
                    : 'border-slate-200'
            }`}
          >
            {statusLabel(evalItem.status)}
          </span>
        </div>
      </div>

      {/* Bottom: full-width gray track + blue thumb only (no fill) */}
      <div className="pl-3.5">
        <input
          type="range"
          min={def.min}
          max={def.max}
          step={def.step}
          value={value ?? def.min}
          disabled={value === null}
          onChange={(e) => onChange(def.id, Number(e.target.value))}
          className="indicator-slider h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={def.labelZh}
        />
      </div>
    </div>
  );
}

import { INDICATOR_BY_ID } from '../config/indicators';
import type { IndicatorEval, IndicatorId } from '../types';
import { formatNum, statusClass, statusLabel } from '../utils/format';

interface Props {
  evalItem: IndicatorEval;
  onChange: (id: IndicatorId, value: number | null) => void;
}

export function IndicatorCard({ evalItem, onChange }: Props) {
  const def = INDICATOR_BY_ID[evalItem.id];
  const value = evalItem.value;

  return (
    <div className="rounded border border-line bg-canvas/60 px-2.5 py-2">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span
              className={`inline-block h-2 w-2 rounded-full ${
                evalItem.status === 'triggered'
                  ? 'bg-danger'
                  : evalItem.status === 'warning'
                    ? 'bg-warn'
                    : evalItem.status === 'na'
                      ? 'bg-slate-300'
                      : 'bg-ok'
              }`}
            />
            <h4 className="truncate text-xs font-semibold text-navy">
              {def.label}
            </h4>
          </div>
          <p className="mt-0.5 text-[10px] text-navy-soft">{def.labelZh}</p>
        </div>
        <span className={statusClass(evalItem.status)}>
          {statusLabel(evalItem.status)}
        </span>
      </div>

      <p
        className="mt-1 text-[10px] leading-snug text-navy-soft"
        title={def.tooltip}
      >
        {def.description}
      </p>

      <div className="mt-2 flex items-center gap-2">
        <input
          type="range"
          min={def.min}
          max={def.max}
          step={def.step}
          value={value ?? def.min}
          disabled={value === null}
          onChange={(e) => onChange(def.id, Number(e.target.value))}
          className="h-1.5 flex-1"
          aria-label={def.label}
        />
        <input
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
          className="w-[72px] rounded border border-line bg-white px-1.5 py-0.5 font-mono text-xs tabular-nums text-navy"
        />
        <span className="w-8 text-[10px] text-navy-soft">{def.unit}</span>
      </div>

      <div className="mt-1 flex items-center justify-between text-[10px]">
        <span className="font-mono text-navy">
          {formatNum(value, def.decimals)}
          {def.unit ? ` ${def.unit}` : ''}
        </span>
        <span className="text-navy-soft">{evalItem.note}</span>
      </div>
    </div>
  );
}

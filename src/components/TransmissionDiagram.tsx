import { TRANSMISSION_LINKS } from '../config/transmission';
import type { TransmissionEval } from '../types';

interface Props {
  links: TransmissionEval[];
}

export function TransmissionDiagram({ links }: Props) {
  const byId = Object.fromEntries(links.map((l) => [l.id, l]));

  return (
    <section className="panel p-3 md:p-4">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-navy">风险传导链路</h2>
          <p className="text-[11px] text-navy-soft">
            动态高亮当前激活环节 · Vanna 方向不默认「波动↑=卖压」
          </p>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div className="flex min-w-[720px] items-stretch gap-1">
          {TRANSMISSION_LINKS.map((link, idx) => {
            const ev = byId[link.id]!;
            const active = ev.active;
            const hot = ev.intensity >= 0.85;
            return (
              <div key={link.id} className="flex flex-1 items-stretch gap-1">
                <div
                  className={`flex-1 rounded border px-2 py-2 transition ${
                    hot
                      ? 'border-danger bg-red-50'
                      : active
                        ? 'border-amber-400 bg-amber-50'
                        : 'border-line bg-canvas'
                  }`}
                  title={ev.reason}
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-navy-soft">
                    Link {idx + 1}
                  </p>
                  <p className="text-xs font-semibold text-navy">
                    {link.labelZh}
                  </p>
                  <p className="mt-0.5 text-[10px] leading-snug text-navy-muted">
                    {link.label}
                  </p>
                  <p className="mt-1 line-clamp-2 text-[10px] text-navy-soft">
                    {ev.reason || link.description}
                  </p>
                  <div className="mt-1.5 h-1 overflow-hidden rounded bg-slate-200">
                    <div
                      className={`h-full transition-all duration-300 ${
                        hot ? 'bg-danger' : active ? 'bg-warn' : 'bg-slate-300'
                      }`}
                      style={{ width: `${Math.round(ev.intensity * 100)}%` }}
                    />
                  </div>
                </div>
                {idx < TRANSMISSION_LINKS.length - 1 && (
                  <div className="flex w-4 shrink-0 items-center justify-center">
                    <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden>
                      <path
                        d="M0 6h12m0 0L9 3m3 3L9 9"
                        fill="none"
                        stroke={
                          active || byId[TRANSMISSION_LINKS[idx + 1]!.id]?.active
                            ? '#B45309'
                            : '#C5CDD8'
                        }
                        strokeWidth="1.5"
                        className={
                          active ? 'flow-active' : undefined
                        }
                        strokeDasharray={active ? '4 4' : undefined}
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { INDICATOR_DEFS } from '../config/indicators';
import type { IndicatorId, SnapshotRecord, ThresholdBand } from '../types';
import { formatAsOf } from '../utils/format';

interface Props {
  thresholds: Record<IndicatorId, ThresholdBand>;
  onThreshold: (id: IndicatorId, patch: Partial<ThresholdBand>) => void;
  snapshots: SnapshotRecord[];
  onLoad: (id: string) => void;
  onRemove: (id: string) => void;
}

export function ConfigPanel({
  thresholds,
  onThreshold,
  snapshots,
  onLoad,
  onRemove,
}: Props) {
  return (
    <section className="panel p-3 md:p-4">
      <div className="mb-3">
        <h2 className="text-sm font-semibold text-navy">阈值配置与快照</h2>
        <p className="text-[11px] text-navy-soft">
          修改阈值即时影响状态、阶段与清单 · 快照存于浏览器 localStorage
        </p>
      </div>

      <div className="grid gap-3 lg:grid-cols-2">
        <div className="max-h-64 overflow-auto rounded border border-line">
          <table className="w-full text-left text-[11px]">
            <thead className="sticky top-0 bg-canvas text-[10px] uppercase text-navy-soft">
              <tr>
                <th className="px-2 py-1.5">指标</th>
                <th className="px-2 py-1.5">警戒</th>
                <th className="px-2 py-1.5">触发</th>
                <th className="px-2 py-1.5">方向</th>
              </tr>
            </thead>
            <tbody>
              {INDICATOR_DEFS.map((d) => {
                const t = thresholds[d.id];
                return (
                  <tr key={d.id} className="border-t border-line">
                    <td className="px-2 py-1 font-medium text-navy">{d.id}</td>
                    <td className="px-2 py-1">
                      <input
                        type="number"
                        step={d.step}
                        value={t.warning}
                        onChange={(e) =>
                          onThreshold(d.id, { warning: Number(e.target.value) })
                        }
                        className="w-20 rounded border border-line px-1 py-0.5 font-mono"
                      />
                    </td>
                    <td className="px-2 py-1">
                      <input
                        type="number"
                        step={d.step}
                        value={t.triggered}
                        onChange={(e) =>
                          onThreshold(d.id, {
                            triggered: Number(e.target.value),
                          })
                        }
                        className="w-20 rounded border border-line px-1 py-0.5 font-mono"
                      />
                    </td>
                    <td className="px-2 py-1 text-navy-soft">
                      {t.inverted ? '↓更差' : '↑更差'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="rounded border border-line p-2">
          <p className="mb-2 text-xs font-semibold text-navy">已存快照</p>
          {snapshots.length === 0 ? (
            <p className="text-[11px] text-navy-soft">暂无快照</p>
          ) : (
            <ul className="max-h-56 space-y-1 overflow-auto">
              {snapshots.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-2 rounded bg-canvas px-2 py-1.5 text-xs"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-navy">{s.name}</p>
                    <p className="text-[10px] text-navy-soft">
                      {formatAsOf(s.savedAt)} · {s.scenarioId}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => onLoad(s.id)}
                      className="rounded bg-navy px-2 py-0.5 text-[10px] text-white"
                    >
                      加载
                    </button>
                    <button
                      type="button"
                      onClick={() => onRemove(s.id)}
                      className="rounded border border-line px-2 py-0.5 text-[10px] text-navy-muted"
                    >
                      删除
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

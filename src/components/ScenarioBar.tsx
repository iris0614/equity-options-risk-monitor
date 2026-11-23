import { SCENARIOS } from '../config/scenarios';
import type { ScenarioId } from '../types';

interface Props {
  scenarioId: ScenarioId;
  onSelect: (id: ScenarioId) => void;
  onReset: () => void;
  onExport: () => void;
  onImportFile: (text: string) => void;
  onSaveSnapshot: () => void;
}

export function ScenarioBar({
  scenarioId,
  onSelect,
  onReset,
  onExport,
  onImportFile,
  onSaveSnapshot,
}: Props) {
  return (
    <section className="panel px-3 py-2.5 md:px-4">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="label-xs mr-1">情景切换</span>
          {SCENARIOS.map((s) => {
            const active = s.id === scenarioId;
            return (
              <button
                key={s.id}
                type="button"
                title={s.description}
                onClick={() => onSelect(s.id)}
                className={`rounded px-2.5 py-1 text-xs font-medium transition ${
                  active
                    ? 'bg-navy text-white'
                    : 'bg-canvas text-navy-muted hover:bg-slate-200'
                }`}
              >
                {s.labelZh}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onReset}
            className="rounded border border-line bg-white px-2.5 py-1 text-xs font-medium text-navy-muted hover:bg-canvas"
          >
            重置为 11/19 实盘数据
          </button>
          <button
            type="button"
            onClick={onSaveSnapshot}
            className="rounded border border-line bg-white px-2.5 py-1 text-xs font-medium text-navy-muted hover:bg-canvas"
          >
            保存快照
          </button>
          <button
            type="button"
            onClick={onExport}
            className="rounded border border-line bg-white px-2.5 py-1 text-xs font-medium text-navy-muted hover:bg-canvas"
          >
            导出 CSV
          </button>
          <label className="cursor-pointer rounded border border-line bg-white px-2.5 py-1 text-xs font-medium text-navy-muted hover:bg-canvas">
            导入 CSV
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                onImportFile(await file.text());
                e.target.value = '';
              }}
            />
          </label>
        </div>
      </div>
      <p className="mt-1.5 text-[11px] text-navy-soft">
        情景数据来自原始仪表盘硬编码样本（「情景模拟」），非实时行情接口。
      </p>
    </section>
  );
}

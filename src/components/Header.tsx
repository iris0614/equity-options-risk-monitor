import type { CompositeScore, StageResult } from '../types';
import {
  BASELINE_AS_OF_LABEL,
  DATA_SOURCES,
} from '../config/scenarios';
import { formatScore } from '../engine/score';

interface Props {
  asOf: string;
  score: CompositeScore;
  stages: StageResult;
  customMode: boolean;
}

export function Header({ score, stages, customMode }: Props) {
  const bandColor = score.band?.color ?? '#5A6B7F';
  const pct = score.score ?? 0;

  return (
    <header className="panel sticky top-0 z-20 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-white/95 md:px-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="label-xs mb-1">INSTITUTIONAL MONITOR</p>
          <h1 className="text-lg font-semibold leading-snug text-navy md:text-xl">
            美股期权微观结构与流动性踩踏监控仪表盘
          </h1>
          <p className="mt-1 text-xs text-navy-soft">
            数据基准：{BASELINE_AS_OF_LABEL} · 口径参考：{DATA_SOURCES}
            {customMode ? ' · 已自定义压力输入（情景模拟）' : ' · 情景模拟样本'}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
          <div className="min-w-[200px] rounded border border-line bg-canvas px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <span className="label-xs">综合压力指数</span>
              <span className="text-[10px] text-navy-soft">0–100 · 非崩盘概率</span>
            </div>
            <div className="mt-1 flex items-end gap-2">
              <span
                className="font-mono text-3xl font-semibold tabular-nums"
                style={{ color: bandColor }}
              >
                {formatScore(score.score)}
              </span>
              <span className="mb-1 text-sm text-navy-soft">/ 100</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${Math.min(100, Math.max(0, pct))}%`,
                  background: bandColor,
                }}
              />
            </div>
          </div>

          <div
            className="min-w-[260px] rounded border-2 px-3 py-2"
            style={{
              borderColor: stages.primary ? '#B91C1C' : '#D8DEE8',
              background: stages.primary ? '#FEF2F2' : '#F8FAFC',
            }}
          >
            <p className="label-xs">系统自动判定阶段</p>
            <p className="mt-1 text-sm font-semibold text-danger">
              {stages.title}
            </p>
            {stages.macroDefense && (
              <span className="mt-1 inline-block rounded bg-danger px-1.5 py-0.5 text-[10px] font-semibold text-white">
                宏观全面防御
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

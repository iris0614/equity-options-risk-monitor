import type { CompositeScore, StageResult } from '../types';
import { STAGE_DEFS } from '../config/stages';
import { formatAsOf, formatNum } from '../utils/format';
import { formatScore } from '../engine/score';

interface Props {
  asOf: string;
  score: CompositeScore;
  stages: StageResult;
  customMode: boolean;
}

export function Header({ asOf, score, stages, customMode }: Props) {
  const primary = stages.primary
    ? STAGE_DEFS.find((s) => s.id === stages.primary)
    : null;
  const bandColor = score.band?.color ?? '#5A6B7F';
  const pct = score.score ?? 0;

  return (
    <header className="panel sticky top-0 z-20 px-4 py-3 md:px-5 backdrop-blur supports-[backdrop-filter]:bg-white/95">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <p className="label-xs mb-1">Institutional Risk Monitor</p>
          <h1 className="text-lg font-semibold leading-snug text-navy md:text-xl">
            机构级美股期权微观结构与流动性风险监控仪表盘
          </h1>
          <p className="mt-1 text-xs text-navy-soft">
            As-of {formatAsOf(asOf)} · 数据标注「情景模拟」· 来源参考：CBOE /
            LSEG / 研究估算（非实盘）
            {customMode ? ' · 已自定义压力输入' : ''}
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
              {score.band && (
                <span
                  className="mb-1 ml-auto rounded px-1.5 py-0.5 text-[11px] font-semibold text-white"
                  style={{ background: bandColor }}
                >
                  {score.band.labelZh}
                </span>
              )}
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
            className="min-w-[240px] rounded border-2 px-3 py-2"
            style={{
              borderColor: primary ? '#B91C1C' : '#D8DEE8',
              background: primary ? '#FEF2F2' : '#F8FAFC',
            }}
          >
            <p className="label-xs">系统阶段判断</p>
            {primary ? (
              <>
                <p className="mt-1 text-sm font-semibold text-danger">
                  阶段 {primary.id}：{primary.nameZh}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-navy-muted">
                  {primary.name}
                </p>
              </>
            ) : (
              <p className="mt-1 text-sm font-medium text-navy-muted">
                无激活阶段 · 综合 {formatNum(score.score, 1)}
              </p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

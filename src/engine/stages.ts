import { STAGE_DEFS } from '../config/stages';
import type {
  IndicatorSnapshot,
  IndicatorStatus,
  StageCondition,
  StageConditionEval,
  StageId,
  StageJudgment,
  StageResult,
  StageState,
  ThresholdBand,
  IndicatorId,
} from '../types';
import { crossesLevel, evalStatus } from './thresholds';

function thrValue(
  band: ThresholdBand,
  level: 'warning' | 'triggered',
): number {
  return level === 'warning' ? band.warning : band.triggered;
}

function evalCondition(
  cond: StageCondition,
  snap: IndicatorSnapshot,
  thresholds: Record<IndicatorId, ThresholdBand>,
): StageConditionEval {
  const band = thresholds[cond.indicatorId];
  const value = snap[cond.indicatorId]?.value ?? null;
  const status: IndicatorStatus = evalStatus(value, band);
  const thresholdValue = thrValue(band, cond.level);
  let satisfied = false;
  if (value !== null) {
    satisfied = crossesLevel(value, band, cond.level, cond.op);
  }
  return { condition: cond, satisfied, status, value, thresholdValue };
}

function ratioMet(evals: StageConditionEval[], requiredOnly: boolean): {
  met: number;
  total: number;
  allRequired: boolean;
} {
  const relevant = requiredOnly
    ? evals.filter((e) => e.condition.required)
    : evals;
  const total = relevant.length;
  const met = relevant.filter((e) => e.satisfied).length;
  const req = evals.filter((e) => e.condition.required);
  const allRequired = req.length === 0 || req.every((e) => e.satisfied);
  return { met, total, allRequired };
}

/**
 * Enter if all required conditions met AND ≥50% of all enter conditions met.
 * Exit if all required exit conditions met.
 */
function stageState(
  enterEvals: StageConditionEval[],
  exitEvals: StageConditionEval[],
  isPrimaryCandidate: boolean,
  scoreHint: number | null,
): StageState {
  const enter = ratioMet(enterEvals, false);
  const enterReq = ratioMet(enterEvals, true);
  const exit = ratioMet(exitEvals, true);

  const enterPass =
    enterReq.allRequired &&
    enter.total > 0 &&
    enter.met / enter.total >= 0.5;

  const exitPass =
    exit.allRequired && exit.met === exit.total && exit.total > 0;

  // Do not mark "passed" from exit alone — calm markets satisfy many exits.
  // "passed" is applied later when a higher stage is primary.
  if (enterPass && exitPass) return 'conflict';
  if (enterPass && isPrimaryCandidate) return 'active';
  if (enterPass) return 'observing';
  if (
    enter.met > 0 &&
    scoreHint !== null &&
    scoreHint >= 50 &&
    enterReq.met > 0
  ) {
    return 'observing';
  }
  return 'inactive';
}

function rationaleFor(
  id: StageId,
  enterEvals: StageConditionEval[],
  state: StageState,
): string {
  const hit = enterEvals.filter((e) => e.satisfied).map((e) => {
    const v = e.value;
    return `${e.condition.indicatorId}=${v}`;
  });
  const miss = enterEvals
    .filter((e) => e.condition.required && !e.satisfied)
    .map((e) => e.condition.indicatorId);

  if (state === 'active') {
    return `进入条件满足：${hit.join(', ') || '—'}`;
  }
  if (state === 'conflict') {
    return `信号冲突：进入与退出条件同时满足（${hit.join(', ')}）`;
  }
  if (state === 'observing') {
    return `部分信号：${hit.join(', ') || '—'}；待确认：${miss.join(', ') || '—'}`;
  }
  if (state === 'passed') {
    return `已满足退出条件；此前特征：${hit.join(', ') || '—'}`;
  }
  return id === '01'
    ? '离散度/相关性尚未达到警戒'
    : '进入条件未满足';
}

/**
 * Non-linear stage engine: may jump, repeat, or conflict.
 * Primary = highest stage with enterPass; ties / conflicts listed.
 */
export function judgeStages(
  snap: IndicatorSnapshot,
  thresholds: Record<IndicatorId, ThresholdBand>,
  compositeScore: number | null,
): StageResult {
  const prelim = STAGE_DEFS.map((def) => {
    const enterEvals = def.enter.map((c) => evalCondition(c, snap, thresholds));
    const exitEvals = def.exit.map((c) => evalCondition(c, snap, thresholds));
    const enter = ratioMet(enterEvals, false);
    const enterReq = ratioMet(enterEvals, true);
    const enterPass =
      enterReq.allRequired &&
      enter.total > 0 &&
      enter.met / enter.total >= 0.5;
    return { def, enterEvals, exitEvals, enterPass, enter, enterReq };
  });

  const candidates = prelim.filter((p) => p.enterPass);
  // Prefer highest stage id among candidates (04 > 03 > …)
  const sorted = [...candidates].sort((a, b) =>
    b.def.id.localeCompare(a.def.id),
  );
  const primaryId: StageId | null = sorted[0]?.def.id ?? null;

  // Detect non-linear jump: active high stage without lower enterPass
  const conflicts: StageId[] = [];
  const judgments: StageJudgment[] = prelim.map((p) => {
    const isPrimary = p.def.id === primaryId;
    const state = stageState(
      p.enterEvals,
      p.exitEvals,
      isPrimary,
      compositeScore,
    );
    if (state === 'conflict') conflicts.push(p.def.id);

    return {
      id: p.def.id,
      state,
      enterSatisfied: p.enter.met,
      enterRequired: p.enter.total,
      exitSatisfied: ratioMet(p.exitEvals, false).met,
      exitRequired: p.exitEvals.length,
      enterEvals: p.enterEvals,
      exitEvals: p.exitEvals,
      rationale: rationaleFor(p.def.id, p.enterEvals, state),
    };
  });

  // UI convention: when a higher stage is primary, mark lower cards as passed
  // (not a proof of linear traversal — nonLinearNote still flags jumps).
  if (primaryId) {
    for (const j of judgments) {
      if (
        j.id < primaryId &&
        (j.state === 'inactive' || j.state === 'observing')
      ) {
        j.state = 'passed';
        j.rationale = `更高阶段 ${primaryId} 已激活；标记为已演进（非严格时序证明）。原信号：${j.rationale}`;
      }
    }
  }

  const jumped =
    primaryId !== null &&
    !candidates.some((c) => c.def.id === '01') &&
    (primaryId === '03' || primaryId === '04');

  const nonLinearNote = [
    jumped
      ? `非线跳跃：直接进入阶段 ${primaryId}，阶段 01 进入条件未完整满足。`
      : null,
    conflicts.length
      ? `冲突阶段：${conflicts.join(', ')}（进入/退出同时满足）。`
      : null,
    candidates.length > 1
      ? `多阶段并存候选：${candidates.map((c) => c.def.id).join(', ')}；主判 ${primaryId}。`
      : null,
  ]
    .filter(Boolean)
    .join(' ');

  return {
    primary: primaryId,
    judgments,
    conflicts,
    nonLinearNote:
      nonLinearNote ||
      '阶段路径允许跳跃、反复与信号冲突；非必然 01→02→03→04。',
  };
}

export function stageDefById(id: StageId) {
  return STAGE_DEFS.find((s) => s.id === id)!;
}

import { STAGE_DEFS } from '../config/stages';
import type {
  FlatState,
  IndicatorSnapshot,
  StageId,
  StageJudgment,
  StageResult,
  StageState,
  ThresholdBand,
  IndicatorId,
} from '../types';
import { toFlat } from './status';

export interface RegimeResult {
  stage: 1 | 2 | 3 | 4;
  title: string;
  color: 'green' | 'amber' | 'red' | 'blue';
  macroDefense: boolean;
}

/**
 * Original detectRegime — priority order preserved.
 */
export function detectRegime(s: FlatState): RegimeResult {
  const vix = s.vix;
  const vixVxv = s.vixVxv;
  const vvix = s.vvix;
  const dealerGamma = s.dealerGamma;
  const spxGex = s.gex;
  const skew = s.skew;
  const netDelta = s.netDeltaFlow;
  const vixeqVix = s.vixeqVix;
  const pcIndex = s.indexPc;
  const pcEquity = s.equityPc;

  const macroDefense =
    (pcIndex !== null &&
      pcEquity !== null &&
      pcIndex >= 1.25 &&
      pcEquity >= 0.8) ||
    (dealerGamma !== null && dealerGamma <= -8.6);

  if (
    vix !== null &&
    dealerGamma !== null &&
    spxGex !== null &&
    ((vix >= 26.0 &&
      ((vixVxv !== null && vixVxv >= 1.0) ||
        (vvix !== null && vvix >= 110))) ||
      (dealerGamma <= -4.5 && spxGex <= -50))
  ) {
    return {
      stage: 3,
      title: macroDefense
        ? '阶段三升级：Vanna 踩踏与宏观全面防御'
        : '阶段三：负反馈翻转与 Vanna 踩踏加速期',
      color: 'red',
      macroDefense,
    };
  }

  if (
    dealerGamma !== null &&
    spxGex !== null &&
    vix !== null &&
    skew !== null &&
    dealerGamma >= 1.5 &&
    spxGex >= 25 &&
    vix < 18.0 &&
    skew < 158
  ) {
    return {
      stage: 1,
      title: '阶段一：缩圈与离散稳态期',
      color: 'green',
      macroDefense: false,
    };
  }

  if (
    vixVxv !== null &&
    vvix !== null &&
    skew !== null &&
    netDelta !== null &&
    spxGex !== null &&
    vixeqVix !== null &&
    vixVxv < 1.0 &&
    vvix < 110 &&
    skew < 155 &&
    netDelta >= 0 &&
    spxGex < 25 &&
    vixeqVix < 2.0
  ) {
    return {
      stage: 4,
      title: '阶段四：极端出清与反向 Vanna 修复期',
      color: 'blue',
      macroDefense: false,
    };
  }

  return {
    stage: 2,
    title: '阶段二：拥挤见顶与先遣撤退期',
    color: 'amber',
    macroDefense: false,
  };
}

function stageIdFromNum(n: 1 | 2 | 3 | 4): StageId {
  return (`0${n}` as StageId);
}

/**
 * Map original regime into StageResult for UI cards.
 * Pill rule: n<current → 已演进; n>current → 观察中; =current → 当前激活.
 */
export function judgeStages(
  snap: IndicatorSnapshot,
  _thresholds: Record<IndicatorId, ThresholdBand>,
  _compositeScore: number | null,
): StageResult {
  const flat = toFlat(snap);
  const missingCore =
    flat.vix === null ||
    flat.gex === null ||
    flat.dealerGamma === null ||
    flat.vvix === null;

  if (missingCore) {
    return {
      primary: null,
      title: '数据不足，无法判定阶段',
      macroDefense: false,
      judgments: STAGE_DEFS.map((d) => ({
        id: d.id,
        state: 'inactive' as StageState,
        enterSatisfied: 0,
        enterRequired: 0,
        exitSatisfied: 0,
        exitRequired: 0,
        enterEvals: [],
        exitEvals: [],
        rationale: '核心指标缺失 → N/A',
      })),
      conflicts: [],
      nonLinearNote:
        '原始站点阶段判定为优先级规则（非线性）；缺失数据时不编造阶段。',
    };
  }

  const regime = detectRegime(flat);
  const primary = stageIdFromNum(regime.stage);
  const primaryNum = regime.stage;

  const judgments: StageJudgment[] = STAGE_DEFS.map((def) => {
    const n = Number(def.id);
    let state: StageState;
    if (n === primaryNum) state = 'active';
    else if (n < primaryNum) state = 'passed';
    else state = 'observing';

    return {
      id: def.id,
      state,
      enterSatisfied: state === 'active' || state === 'passed' ? 1 : 0,
      enterRequired: 1,
      exitSatisfied: 0,
      exitRequired: 0,
      enterEvals: [],
      exitEvals: [],
      rationale:
        state === 'active'
          ? regime.title
          : state === 'passed'
            ? '已演进（相对当前主阶段）'
            : '观察中',
    };
  });

  return {
    primary,
    title: regime.title,
    macroDefense: regime.macroDefense,
    judgments,
    conflicts: [],
    nonLinearNote:
      '阶段判定采用原始站点优先级：先测阶段三，再测阶段一，再测阶段四，否则阶段二。允许跳跃，非必然 01→02→03→04。',
  };
}

export function stageDefById(id: StageId) {
  return STAGE_DEFS.find((s) => s.id === id)!;
}

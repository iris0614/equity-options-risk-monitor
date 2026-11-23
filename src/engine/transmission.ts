import { TRANSMISSION_LINKS } from '../config/transmission';
import type {
  IndicatorSnapshot,
  StageResult,
  ThresholdBand,
  TransmissionEval,
  IndicatorId,
} from '../types';
import { toFlat } from './status';

/**
 * Dynamic highlight of the original 6-node chain.
 * Vanna does not assume vol↑ ⇒ sell; intensity rises with stage 3 + neg gamma.
 */
export function evalTransmission(
  snap: IndicatorSnapshot,
  stages: StageResult,
  _thresholds: Record<IndicatorId, ThresholdBand>,
): TransmissionEval[] {
  const s = toFlat(snap);
  const stage = stages.primary ? Number(stages.primary) : 0;

  const corr =
    (s.vixeqVix !== null && s.vixeqVix < 2.0) ||
    (s.dspx !== null && s.dspx < 39);
  const unwind = s.vixeqVix !== null && s.vixeqVix < 1.85;
  const gamma =
    (s.gex !== null && s.gex < 0) ||
    (s.dealerGamma !== null && s.dealerGamma < 0);
  const volTerm =
    (s.vix !== null && s.vix >= 20) ||
    (s.vixVxv !== null && s.vixVxv >= 0.95) ||
    (s.vvix !== null && s.vvix >= 100);
  const vanna =
    stage >= 3 ||
    (s.vix !== null &&
      s.vix >= 28 &&
      s.vixVxv !== null &&
      s.vixVxv > 1 &&
      s.dealerGamma !== null &&
      s.dealerGamma < 0);
  const cascade =
    stages.macroDefense ||
    (s.dealerGamma !== null && s.dealerGamma <= -8.6) ||
    (stage >= 3 &&
      s.netDeltaFlow !== null &&
      s.netDeltaFlow <= -60);

  const flags = {
    correlation: corr,
    dispersionUnwind: unwind || stage >= 2,
    gammaSqueeze: gamma || stage >= 3,
    volTerm: volTerm || stage >= 3,
    vanna,
    cascade,
  };

  const reasons = {
    correlation: corr
      ? 'VIXEQ/VIX 或 DSPX 显示相关性/离散压力'
      : '相关性压力未激活',
    dispersionUnwind: unwind
      ? 'VIXEQ/VIX < 1.85 — 离散平仓压力'
      : '离散平仓未触发',
    gammaSqueeze: gamma
      ? `GEX=${s.gex ?? 'N/A'} / DealerΓ=${s.dealerGamma ?? 'N/A'}`
      : '仍处正/中性 Gamma',
    volTerm: volTerm
      ? `VIX=${s.vix ?? 'N/A'} VIX/VXV=${s.vixVxv ?? 'N/A'} VVIX=${s.vvix ?? 'N/A'}`
      : '期限/波动未抬升',
    vanna: vanna
      ? 'VIX≥28 + 倒挂 + 负 Gamma 共振（头寸依赖，非默认 vol↑=卖压）'
      : 'Vanna 条件未齐备',
    cascade: cascade
      ? '宏观防御或击穿 -8.6B / 深负 Delta — 机械加速'
      : '加速器未激活',
  };

  return TRANSMISSION_LINKS.map((l) => {
    const active = flags[l.id];
    return {
      id: l.id,
      active,
      intensity: active
        ? l.id === 'cascade' || l.id === 'vanna'
          ? 1
          : 0.7
        : 0,
      reason: reasons[l.id],
    };
  });
}

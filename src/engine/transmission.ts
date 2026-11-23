import { TRANSMISSION_LINKS } from '../config/transmission';
import type {
  IndicatorSnapshot,
  StageResult,
  ThresholdBand,
  TransmissionEval,
  TransmissionLinkId,
  IndicatorId,
} from '../types';
import { evalStatus } from './thresholds';

/**
 * Dynamic transmission highlight.
 * Vanna link intensity depends on vannaSign — vol↑ does NOT always mean sell.
 */
export function evalTransmission(
  snap: IndicatorSnapshot,
  stages: StageResult,
  thresholds: Record<IndicatorId, ThresholdBand>,
): TransmissionEval[] {
  const status = (id: IndicatorId) =>
    evalStatus(snap[id]?.value ?? null, thresholds[id]);

  const vannaSign = snap.vannaSign?.value;
  const volUp =
    status('vix') === 'triggered' || status('vvix') === 'triggered';

  const links: Record<TransmissionLinkId, { active: boolean; intensity: number; reason: string }> = {
    dispersion: {
      active:
        status('vixeqVix') !== 'normal' && status('vixeqVix') !== 'na',
      intensity:
        status('vixeqVix') === 'triggered'
          ? 1
          : status('vixeqVix') === 'warning'
            ? 0.6
            : 0,
      reason: 'VIXEQ/VIX / DSPX dispersion stress',
    },
    volSpike: {
      active: status('vix') !== 'normal' && status('vix') !== 'na',
      intensity: status('vix') === 'triggered' ? 1 : 0.55,
      reason: `VIX=${snap.vix?.value ?? 'N/A'}`,
    },
    liquidity: {
      active: status('vvix') !== 'normal' && status('vvix') !== 'na',
      intensity: status('vvix') === 'triggered' ? 1 : 0.55,
      reason: `VVIX=${snap.vvix?.value ?? 'N/A'}`,
    },
    gammaFlip: {
      active:
        status('gex') === 'triggered' ||
        status('dealerGamma') === 'triggered' ||
        status('gex') === 'warning',
      intensity: status('gex') === 'triggered' ? 1 : 0.6,
      reason: `GEX=${snap.gex?.value ?? 'N/A'} $B`,
    },
    vanna: {
      active: false,
      intensity: 0,
      reason: '',
    },
    deltaHedge: {
      active:
        status('netDeltaFlow') === 'warning' ||
        status('netDeltaFlow') === 'triggered',
      intensity: status('netDeltaFlow') === 'triggered' ? 1 : 0.6,
      reason: `NetΔ=${snap.netDeltaFlow?.value ?? 'N/A'}`,
    },
    cascade: {
      active:
        stages.primary === '04' ||
        (status('netDeltaFlow') === 'triggered' &&
          status('indexPc') === 'triggered' &&
          status('vvix') === 'triggered'),
      intensity: stages.primary === '04' ? 1 : 0.75,
      reason: 'Broad put surge + deep negative delta + extreme VVIX',
    },
  };

  // Vanna: directionally gated
  if (vannaSign === null || vannaSign === undefined) {
    links.vanna = {
      active: false,
      intensity: 0,
      reason: 'Vanna 符号缺失 → N/A（不假设波动↑=卖压）',
    };
  } else if (vannaSign < 0 && volUp && links.gammaFlip.active) {
    links.vanna = {
      active: true,
      intensity: 1,
      reason: 'Vanna=-1 且波动抬升 + 负 Gamma → 卖压加速（头寸依赖）',
    };
  } else if (vannaSign > 0 && volUp) {
    links.vanna = {
      active: true,
      intensity: 0.45,
      reason: 'Vanna=+1：波动↑倾向买盘对冲，而非卖压',
    };
  } else if (vannaSign < 0 && !volUp) {
    links.vanna = {
      active: false,
      intensity: 0.2,
      reason: 'Vanna 为负但波动未触发 — 潜在卖压路径待命',
    };
  } else {
    links.vanna = {
      active: false,
      intensity: 0,
      reason: 'Vanna 中性 / 未与波动触发共振',
    };
  }

  return TRANSMISSION_LINKS.map((l) => ({
    id: l.id,
    active: links[l.id].active,
    intensity: links[l.id].intensity,
    reason: links[l.id].reason,
  }));
}

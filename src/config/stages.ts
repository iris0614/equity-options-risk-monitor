import type { StageDef } from '../types';

/**
 * Four risk stages with enter/exit conditions.
 * Stages are non-linear: jumps, repeats, and conflicts are allowed.
 */
export const STAGE_DEFS: StageDef[] = [
  {
    id: '01',
    name: 'Elevated Fragility',
    nameZh: '高位脆弱 / 离散度抬升',
    description:
      'Dispersion & correlation stress rising while spot vol still moderate. Early fragility window.',
    enter: [
      { indicatorId: 'vixeqVix', op: 'gte', level: 'warning', required: true },
      { indicatorId: 'dspx', op: 'gte', level: 'warning', required: false },
      { indicatorId: 'nvdaProxy', op: 'gte', level: 'warning', required: false },
    ],
    exit: [
      { indicatorId: 'vixeqVix', op: 'lt', level: 'warning', required: true },
      { indicatorId: 'dspx', op: 'lt', level: 'warning', required: false },
    ],
    transmissionLinks: ['dispersion'],
  },
  {
    id: '02',
    name: 'Vol Expansion & Liquidity Strain',
    nameZh: '波动扩张与流动性挤兑',
    description:
      'VIX/VVIX lift with put demand; term structure flattens. Liquidity premium rising.',
    enter: [
      { indicatorId: 'vix', op: 'gte', level: 'warning', required: true },
      { indicatorId: 'vvix', op: 'gte', level: 'warning', required: true },
      { indicatorId: 'totalPc', op: 'gte', level: 'warning', required: false },
      { indicatorId: 'vixVxv', op: 'gte', level: 'warning', required: false },
    ],
    exit: [
      { indicatorId: 'vix', op: 'lt', level: 'warning', required: true },
      { indicatorId: 'vvix', op: 'lt', level: 'warning', required: true },
    ],
    transmissionLinks: ['dispersion', 'volSpike', 'liquidity'],
  },
  {
    id: '03',
    name: 'Negative Gamma + Vanna Acceleration',
    nameZh: '负 Gamma 踩踏与 Vanna 加速',
    description:
      'Dealer short-gamma regime with active vanna/delta hedge feedback. Not every vol↑ implies sell — vannaSign gates direction.',
    enter: [
      { indicatorId: 'gex', op: 'lte', level: 'triggered', required: true },
      { indicatorId: 'dealerGamma', op: 'lte', level: 'warning', required: true },
      { indicatorId: 'vix', op: 'gte', level: 'triggered', required: false },
      { indicatorId: 'vvix', op: 'gte', level: 'triggered', required: false },
      { indicatorId: 'netDeltaFlow', op: 'lte', level: 'warning', required: false },
    ],
    exit: [
      { indicatorId: 'gex', op: 'gt', level: 'warning', required: true },
      { indicatorId: 'dealerGamma', op: 'gt', level: 'warning', required: false },
    ],
    transmissionLinks: ['gammaFlip', 'vanna', 'deltaHedge'],
  },
  {
    id: '04',
    name: 'Systemic Deleveraging',
    nameZh: '系统性去杠杆 / 流动性枯竭',
    description:
      'Broad put surge, deep negative delta flow, extreme VVIX, and backwardation — liquidation cascade risk.',
    enter: [
      { indicatorId: 'netDeltaFlow', op: 'lte', level: 'triggered', required: true },
      { indicatorId: 'indexPc', op: 'gte', level: 'triggered', required: true },
      { indicatorId: 'vvix', op: 'gte', level: 'triggered', required: true },
      { indicatorId: 'vix9dVix', op: 'gte', level: 'triggered', required: false },
      { indicatorId: 'gex', op: 'lte', level: 'triggered', required: false },
    ],
    exit: [
      { indicatorId: 'netDeltaFlow', op: 'gt', level: 'warning', required: true },
      { indicatorId: 'vvix', op: 'lt', level: 'triggered', required: true },
      { indicatorId: 'indexPc', op: 'lt', level: 'triggered', required: false },
    ],
    transmissionLinks: ['gammaFlip', 'vanna', 'deltaHedge', 'cascade'],
  },
];

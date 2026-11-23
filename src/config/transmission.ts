import type { TransmissionLink } from '../types';

export const TRANSMISSION_LINKS: TransmissionLink[] = [
  {
    id: 'dispersion',
    label: 'Dispersion Stress',
    labelZh: '离散度抬升',
    description: 'Single-stock vol / correlation stress feeds index hedge demand',
  },
  {
    id: 'volSpike',
    label: 'Vol Spike',
    labelZh: '波动跳升',
    description: 'VIX / VVIX expansion raises hedging urgency',
  },
  {
    id: 'liquidity',
    label: 'Liquidity Drain',
    labelZh: '流动性抽离',
    description: 'Wider spreads / thinner depth amplify flow impact',
  },
  {
    id: 'gammaFlip',
    label: 'Gamma Flip',
    labelZh: 'Gamma 翻转',
    description: 'Dealers flip short gamma → amplify spot moves',
  },
  {
    id: 'vanna',
    label: 'Vanna Trigger',
    labelZh: 'Vanna 触发',
    description:
      'Vol-driven delta rebalance. Direction depends on vannaSign — not assumed sell-on-vol↑',
  },
  {
    id: 'deltaHedge',
    label: 'Delta Hedge Flow',
    labelZh: 'Delta 对冲流',
    description: 'Mechanical delta hedging transmits into spot',
  },
  {
    id: 'cascade',
    label: 'Liquidation Cascade',
    labelZh: '机械加速抛售',
    description: 'Self-reinforcing sell / de-lever loop under thin liquidity',
  },
];

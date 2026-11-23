import type { TransmissionLink } from '../types';

/** Original 6-node negative-feedback chain. */
export const TRANSMISSION_LINKS: TransmissionLink[] = [
  {
    id: 'correlation',
    label: 'Correlation Rise',
    labelZh: '相关性抬升',
    description: '离散压缩 → 相关性抬升',
  },
  {
    id: 'dispersionUnwind',
    label: 'Dispersion Unwind',
    labelZh: '离散交易亏损平仓',
    description: '离散交易亏损平仓',
  },
  {
    id: 'gammaSqueeze',
    label: 'Neg Gamma / Delta Squeeze',
    labelZh: '机械买盘消失 & 负Gamma/负Delta挤压',
    description: '正 Gamma 阻尼消失，负敞口挤压',
  },
  {
    id: 'volTerm',
    label: 'Vol Spike & Backwardation',
    labelZh: 'VIX/VVIX跳升 & 期限倒挂',
    description: 'VIX/VVIX 跳升与期限倒挂',
  },
  {
    id: 'vanna',
    label: 'Vanna Trigger',
    labelZh: 'Vanna触发',
    description: 'Vanna 触发（方向取决于头寸，非默认 vol↑=卖压）',
  },
  {
    id: 'cascade',
    label: 'Mechanical Sell Accelerator',
    labelZh: '机械式砸盘加速器',
    description: '机械式砸盘加速',
  },
];

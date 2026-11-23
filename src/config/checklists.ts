import type { ChecklistItemDef } from '../types';

export const ESCALATION_CHECKLIST: ChecklistItemDef[] = [
  {
    id: 'esc-pc-surge',
    label: 'Index P/C > trigger (1.25)',
    labelZh: '指数 Put/Call 突破触发线',
    auto: { indicatorId: 'indexPc', op: 'gte', level: 'triggered' },
  },
  {
    id: 'esc-gex-floor',
    label: 'Dealer / GEX breaks historical floor',
    labelZh: 'GEX / Dealer Gamma 跌破历史下限',
    auto: { indicatorId: 'gex', op: 'lte', level: 'triggered' },
  },
  {
    id: 'esc-vvix',
    label: 'VVIX above red line',
    labelZh: 'VVIX 突破红线',
    auto: { indicatorId: 'vvix', op: 'gte', level: 'triggered' },
  },
  {
    id: 'esc-backwardation',
    label: 'Term structure in backwardation',
    labelZh: '期限结构进入 Backwardation',
    auto: { indicatorId: 'vixVxv', op: 'gte', level: 'triggered' },
  },
  {
    id: 'esc-vanna-sell',
    label: 'Vanna sign = sell-on-vol↑ (-1)',
    labelZh: 'Vanna 符号为波动↑卖压',
    auto: { indicatorId: 'vannaSign', op: 'lte', level: 'triggered' },
  },
  {
    id: 'esc-delta-flow',
    label: 'Net delta flow deeply negative',
    labelZh: '净 Delta 流显著为负',
    auto: { indicatorId: 'netDeltaFlow', op: 'lte', level: 'triggered' },
  },
  {
    id: 'esc-manual-gap',
    label: 'Overnight gap / circuit breaker watch (manual)',
    labelZh: '隔夜跳空 / 熔断观测（人工确认）',
  },
];

export const REPAIR_CHECKLIST: ChecklistItemDef[] = [
  {
    id: 'rep-vvix',
    label: 'VVIX back below warning',
    labelZh: 'VVIX 回落至警戒线以下',
    auto: { indicatorId: 'vvix', op: 'lt', level: 'warning' },
  },
  {
    id: 'rep-contango',
    label: 'Term structure returns to contango',
    labelZh: '期限结构回到 Contango',
    auto: { indicatorId: 'vixVxv', op: 'lt', level: 'warning' },
  },
  {
    id: 'rep-gex',
    label: 'GEX recovers above warning floor',
    labelZh: 'GEX 回升至警戒下限以上',
    auto: { indicatorId: 'gex', op: 'gt', level: 'warning' },
  },
  {
    id: 'rep-pc',
    label: 'Index P/C cools below warning',
    labelZh: '指数 P/C 回落至警戒以下',
    auto: { indicatorId: 'indexPc', op: 'lt', level: 'warning' },
  },
  {
    id: 'rep-vanna',
    label: 'Vanna sign neutral/positive',
    labelZh: 'Vanna 符号中性或正向',
    auto: {
      indicatorId: 'vannaSign',
      op: 'gte',
      level: 'custom',
      customValue: 0,
    },
  },
  {
    id: 'rep-manual-opex',
    label: 'Post-OPEX pin / gamma rebuild confirmed (manual)',
    labelZh: 'OPEX 后钉住 / Gamma 重建确认（人工）',
  },
];

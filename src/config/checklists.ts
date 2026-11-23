import type { ChecklistItemDef } from '../types';

/** Original CHECKLIST_RISK (4). */
export const ESCALATION_CHECKLIST: ChecklistItemDef[] = [
  {
    id: 'risk_1',
    label: 'Equity P/C ≥0.80 AND Total P/C ≥1.25',
    labelZh: '个股 P/C 突破 0.80 且全市场 P/C 冲击 1.25',
    sub: '确认高估值/拥挤个股去杠杆向全市场扩散',
    autoFn: 'risk1',
  },
  {
    id: 'risk_2',
    label: 'Index P/C ≥ 1.25',
    labelZh: '指数 P/C 放量站稳 1.25 上方（机构全面宏观防御）',
    sub: '蓝线突破基准线，标志宏观恐慌对冲全面打满',
    autoFn: 'risk2',
  },
  {
    id: 'risk_3',
    label: 'Dealer Agg Gamma ≤ -8.6B',
    labelZh: 'SPX Dealer Agg Gamma 有效跌穿 -8.6B 历史底线',
    sub: '做市商流动性缓冲彻底击穿历史极值区间',
    autoFn: 'risk3',
  },
  {
    id: 'risk_4',
    label: 'VIX>28 & VIX/VXV>1 & VVIX≥110',
    labelZh: 'VIX > 28、VIX/VXV > 1.00 且 VVIX 拒绝跌回 110 下方',
    sub: 'Vanna 螺旋持续强化，对冲工具维持挤兑状态',
    autoFn: 'risk4',
  },
];

/** Original CHECKLIST_RESET (4). */
export const REPAIR_CHECKLIST: ChecklistItemDef[] = [
  {
    id: 'reset_1',
    label: 'GEX > -30 AND Net Delta ≥ 0',
    labelZh: '月度 OPEX 交割日落地，Net Delta 与 GEX 出现周期性重置回拉',
    sub: 'SPX GEX 收窄至 -30B 以上或 Net Delta 回升至零轴上方',
    autoFn: 'reset1',
  },
  {
    id: 'reset_2',
    label: 'VVIX < 110',
    labelZh: 'VVIX 率先跌回 110 红线下方（尾部挤兑降温）',
    sub: '对 VIX 看涨期权的非理性抢筹退潮',
    autoFn: 'reset2',
  },
  {
    id: 'reset_3',
    label: 'VIX/VXV <1 AND VIX9D/VIX <1',
    labelZh: 'VIX/VXV 与 VIX9D/VIX 双双回落至 1.00 以下（解除 Vanna 倒挂条件）',
    sub: '波动率期限结构由 Backwardation 恢复至 Contango',
    autoFn: 'reset3',
  },
  {
    id: 'reset_4',
    label: 'VIXEQ/VIX ≥1.70 AND VIX <25',
    labelZh: 'VIXEQ/VIX 在 1.6 附近止跌企稳，隐含相关性停止飙升',
    sub: '离散交易平仓止血（VIXEQ/VIX >= 1.70 且 VIX < 25）',
    autoFn: 'reset4',
  },
];

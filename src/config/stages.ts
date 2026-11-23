import type { StageDef } from '../types';

/**
 * Four stages — names/descriptions from original site.
 * Enter/exit lists are descriptive for UI; live judgment uses detectRegime().
 */
export const STAGE_DEFS: StageDef[] = [
  {
    id: '01',
    name: 'Dispersion Steady State',
    nameZh: '缩圈与离散稳态期',
    description:
      '卖指数波 + 买个股波压低相关性；做市商正 Gamma 充当阻尼器，机械买盘托举权重股。',
    enter: [],
    exit: [],
    transmissionLinks: ['correlation'],
  },
  {
    id: '02',
    name: 'Crowding Peak & Early Retreat',
    nameZh: '拥挤见顶与先遣撤退期',
    description:
      'CBOE SKEW 飙升至 160~170 抢买尾部险；个股 P/C 率先筑底抬头，龙头上升通道松动。',
    enter: [],
    exit: [],
    transmissionLinks: ['correlation', 'dispersionUnwind'],
  },
  {
    id: '03',
    name: 'Negative Feedback + Vanna Acceleration',
    nameZh: '负反馈翻转与 Vanna 踩踏加速期',
    description:
      '离散平仓、VIX > 28 且期限倒挂、VVIX 破红线；负 Gamma 与 Vanna 双重逼迫做市商砸盘。',
    enter: [],
    exit: [],
    transmissionLinks: [
      'dispersionUnwind',
      'gammaSqueeze',
      'volTerm',
      'vanna',
      'cascade',
    ],
  },
  {
    id: '04',
    name: 'Extreme Clearance + Reverse Vanna Repair',
    nameZh: '极端出清与反向 Vanna 修复期',
    description:
      '月度 OPEX 交割重置叠加 Put 获利了结；VVIX 回落与倒挂收窄触发反向 Vanna 空头回补。',
    enter: [],
    exit: [],
    transmissionLinks: ['volTerm', 'vanna'],
  },
];

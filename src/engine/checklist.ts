import {
  ESCALATION_CHECKLIST,
  REPAIR_CHECKLIST,
} from '../config/checklists';
import type {
  ChecklistItemDef,
  ChecklistItemState,
  FlatState,
  IndicatorId,
  IndicatorSnapshot,
  ThresholdBand,
} from '../types';
import { toFlat } from './status';

function runAutoFn(
  fn: ChecklistItemDef['autoFn'],
  s: FlatState,
): boolean {
  if (!fn) return false;
  const {
    equityPc: pcEquity,
    totalPc: pcTotal,
    indexPc: pcIndex,
    dealerGamma,
    vix,
    vixVxv,
    vvix,
    gex: spxGex,
    netDeltaFlow: netDelta,
    vixeqVix,
    vix9dVix,
  } = s;

  switch (fn) {
    case 'risk1':
      return (
        pcEquity !== null &&
        pcTotal !== null &&
        pcEquity >= 0.8 &&
        pcTotal >= 1.25
      );
    case 'risk2':
      return pcIndex !== null && pcIndex >= 1.25;
    case 'risk3':
      return dealerGamma !== null && dealerGamma <= -8.6;
    case 'risk4':
      return (
        vix !== null &&
        vixVxv !== null &&
        vvix !== null &&
        vix > 28.0 &&
        vixVxv > 1.0 &&
        vvix >= 110
      );
    case 'reset1':
      // Original code uses AND though subtitle says OR — preserved as-is.
      return (
        spxGex !== null &&
        netDelta !== null &&
        spxGex > -30 &&
        netDelta >= 0
      );
    case 'reset2':
      return vvix !== null && vvix < 110;
    case 'reset3':
      return (
        vixVxv !== null &&
        vix9dVix !== null &&
        vixVxv < 1.0 &&
        vix9dVix < 1.0
      );
    case 'reset4':
      return (
        vixeqVix !== null &&
        vix !== null &&
        vixeqVix >= 1.7 &&
        vix < 25.0
      );
  }
}

export function evalChecklist(
  defs: ChecklistItemDef[],
  snap: IndicatorSnapshot,
  _thresholds: Record<IndicatorId, ThresholdBand>,
  manual: Record<string, boolean>,
): ChecklistItemState[] {
  const flat = toFlat(snap);
  return defs.map((d) => ({
    id: d.id,
    autoTriggered: runAutoFn(d.autoFn, flat),
    manualConfirmed: manual[d.id] ?? false,
  }));
}

export function evalDualChecklists(
  snap: IndicatorSnapshot,
  thresholds: Record<IndicatorId, ThresholdBand>,
  manualEsc: Record<string, boolean>,
  manualRep: Record<string, boolean>,
) {
  return {
    escalation: evalChecklist(
      ESCALATION_CHECKLIST,
      snap,
      thresholds,
      manualEsc,
    ),
    repair: evalChecklist(REPAIR_CHECKLIST, snap, thresholds, manualRep),
  };
}

import {
  ESCALATION_CHECKLIST,
  REPAIR_CHECKLIST,
} from '../config/checklists';
import type {
  ChecklistItemDef,
  ChecklistItemState,
  IndicatorId,
  IndicatorSnapshot,
  ThresholdBand,
} from '../types';
import { crossesLevel } from './thresholds';

function autoTriggered(
  item: ChecklistItemDef,
  snap: IndicatorSnapshot,
  thresholds: Record<IndicatorId, ThresholdBand>,
): boolean {
  if (!item.auto) return false;
  const { indicatorId, op, level, customValue } = item.auto;
  const value = snap[indicatorId]?.value ?? null;
  if (value === null) return false;
  const band = thresholds[indicatorId];

  if (level === 'custom') {
    const thr = customValue ?? 0;
    switch (op) {
      case 'gte':
        return value >= thr;
      case 'gt':
        return value > thr;
      case 'lte':
        return value <= thr;
      case 'lt':
        return value < thr;
    }
  }

  return crossesLevel(value, band, level, op);
}

export function evalChecklist(
  defs: ChecklistItemDef[],
  snap: IndicatorSnapshot,
  thresholds: Record<IndicatorId, ThresholdBand>,
  manual: Record<string, boolean>,
): ChecklistItemState[] {
  return defs.map((d) => ({
    id: d.id,
    autoTriggered: autoTriggered(d, snap, thresholds),
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

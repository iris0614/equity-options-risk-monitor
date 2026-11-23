import { useCallback, useMemo, useState } from 'react';
import { DEFAULT_THRESHOLDS } from '../config/thresholds';
import { DEFAULT_WEIGHTS } from '../config/weights';
import { SCENARIO_BY_ID } from '../config/scenarios';
import {
  cloneSnapshot,
  setIndicatorValue,
  snapshotFromScenario,
  SERIES_BY_SCENARIO,
} from '../data/baseline';
import { runMonitorModel } from '../engine';
import type {
  DimensionWeights,
  IndicatorId,
  IndicatorSnapshot,
  ScenarioId,
  SnapshotRecord,
  ThresholdBand,
} from '../types';
import { csvToPartialIndicators, snapshotToCsv, downloadText } from '../utils/csv';
import {
  deleteSnapshot,
  loadSnapshots,
  upsertSnapshot,
} from '../utils/storage';

function emptyManual(): Record<string, boolean> {
  return {};
}

export function useRiskMonitor() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>('baseline');
  const [indicators, setIndicators] = useState<IndicatorSnapshot>(() =>
    snapshotFromScenario('baseline'),
  );
  const [weights, setWeights] = useState<DimensionWeights>({ ...DEFAULT_WEIGHTS });
  const [thresholds, setThresholds] = useState<Record<IndicatorId, ThresholdBand>>(
    () => structuredClone(DEFAULT_THRESHOLDS),
  );
  const [manualEsc, setManualEsc] = useState<Record<string, boolean>>(emptyManual);
  const [manualRep, setManualRep] = useState<Record<string, boolean>>(emptyManual);
  const [snapshots, setSnapshots] = useState<SnapshotRecord[]>(() => loadSnapshots());
  const [customMode, setCustomMode] = useState(false);

  const asOf = SCENARIO_BY_ID[scenarioId]?.asOf ?? indicators.vix?.asOf ?? '';

  const model = useMemo(
    () =>
      runMonitorModel(
        indicators,
        weights,
        thresholds,
        asOf,
        manualEsc,
        manualRep,
      ),
    [indicators, weights, thresholds, asOf, manualEsc, manualRep],
  );

  const series = SERIES_BY_SCENARIO[scenarioId];

  const applyScenario = useCallback((id: ScenarioId) => {
    setScenarioId(id);
    setIndicators(snapshotFromScenario(id));
    setManualEsc(emptyManual());
    setManualRep(emptyManual());
    setCustomMode(false);
  }, []);

  const resetBaseline = useCallback(() => {
    applyScenario('baseline');
    setWeights({ ...DEFAULT_WEIGHTS });
    setThresholds(structuredClone(DEFAULT_THRESHOLDS));
  }, [applyScenario]);

  const updateIndicator = useCallback((id: IndicatorId, value: number | null) => {
    setIndicators((prev) => setIndicatorValue(prev, id, value));
    setCustomMode(true);
  }, []);

  const updateWeight = useCallback((key: keyof DimensionWeights, value: number) => {
    setWeights((w) => ({ ...w, [key]: value }));
  }, []);

  const updateThreshold = useCallback(
    (id: IndicatorId, patch: Partial<ThresholdBand>) => {
      setThresholds((t) => ({
        ...t,
        [id]: { ...t[id], ...patch },
      }));
    },
    [],
  );

  const toggleManualEsc = useCallback((id: string) => {
    setManualEsc((m) => ({ ...m, [id]: !m[id] }));
  }, []);

  const toggleManualRep = useCallback((id: string) => {
    setManualRep((m) => ({ ...m, [id]: !m[id] }));
  }, []);

  const exportCsv = useCallback(() => {
    const csv = snapshotToCsv(indicators);
    downloadText(
      `risk-monitor-${scenarioId}-${Date.now()}.csv`,
      csv,
      'text/csv;charset=utf-8',
    );
  }, [indicators, scenarioId]);

  const importCsv = useCallback((text: string) => {
    const partial = csvToPartialIndicators(text);
    setIndicators((prev) => {
      const next = cloneSnapshot(prev);
      for (const [id, value] of Object.entries(partial) as [
        IndicatorId,
        number | null,
      ][]) {
        next[id] = {
          ...next[id],
          value,
          simulated: true,
        };
      }
      return next;
    });
    setCustomMode(true);
  }, []);

  const saveSnapshot = useCallback(
    (name: string) => {
      const rec: SnapshotRecord = {
        id: `snap-${Date.now()}`,
        name,
        savedAt: new Date().toISOString(),
        scenarioId,
        indicators: cloneSnapshot(indicators),
        weights: { ...weights },
        thresholds: structuredClone(thresholds),
        checklist: Object.fromEntries(
          [
            ...model.checklists.escalation,
            ...model.checklists.repair,
          ].map((c) => [
            c.id,
            {
              id: c.id,
              autoTriggered: c.autoTriggered,
              manualConfirmed: c.manualConfirmed,
            },
          ]),
        ),
      };
      setSnapshots(upsertSnapshot(rec));
      return rec;
    },
    [scenarioId, indicators, weights, thresholds, model],
  );

  const loadSnapshot = useCallback((id: string) => {
    const list = loadSnapshots();
    const rec = list.find((s) => s.id === id);
    if (!rec) return;
    setScenarioId(rec.scenarioId);
    setIndicators(cloneSnapshot(rec.indicators));
    setWeights({ ...rec.weights });
    setThresholds(structuredClone(rec.thresholds));
    const esc: Record<string, boolean> = {};
    const rep: Record<string, boolean> = {};
    for (const [cid, st] of Object.entries(rec.checklist)) {
      if (cid.startsWith('esc-')) esc[cid] = st.manualConfirmed;
      if (cid.startsWith('rep-')) rep[cid] = st.manualConfirmed;
    }
    setManualEsc(esc);
    setManualRep(rep);
    setCustomMode(true);
  }, []);

  const removeSnapshot = useCallback((id: string) => {
    setSnapshots(deleteSnapshot(id));
  }, []);

  return {
    scenarioId,
    indicators,
    weights,
    thresholds,
    model,
    series,
    asOf,
    customMode,
    snapshots,
    applyScenario,
    resetBaseline,
    updateIndicator,
    updateWeight,
    updateThreshold,
    toggleManualEsc,
    toggleManualRep,
    exportCsv,
    importCsv,
    saveSnapshot,
    loadSnapshot,
    removeSnapshot,
  };
}

export type RiskMonitorApi = ReturnType<typeof useRiskMonitor>;

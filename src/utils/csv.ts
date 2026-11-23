import { INDICATOR_DEFS } from '../config/indicators';
import type { IndicatorId, IndicatorSnapshot } from '../types';

export function snapshotToCsv(snap: IndicatorSnapshot): string {
  const header = 'indicator,value,unit,simulated,asOf';
  const rows = INDICATOR_DEFS.map((d) => {
    const v = snap[d.id];
    const val = v.value === null || v.value === undefined ? '' : String(v.value);
    return `${d.id},${val},${d.unit},${v.simulated},${v.asOf}`;
  });
  return [header, ...rows].join('\n');
}

export function csvToPartialIndicators(
  csv: string,
): Partial<Record<IndicatorId, number | null>> {
  const lines = csv
    .trim()
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);
  if (lines.length < 2) return {};

  const header = lines[0]!.split(',').map((h) => h.trim().toLowerCase());
  const idIdx = header.indexOf('indicator');
  const valIdx = header.indexOf('value');
  if (idIdx < 0 || valIdx < 0) {
    throw new Error('CSV must include indicator,value columns');
  }

  const known = new Set(INDICATOR_DEFS.map((d) => d.id));
  const out: Partial<Record<IndicatorId, number | null>> = {};

  for (const line of lines.slice(1)) {
    const cols = line.split(',');
    const id = cols[idIdx]?.trim() as IndicatorId;
    if (!known.has(id)) continue;
    const raw = cols[valIdx]?.trim() ?? '';
    if (raw === '' || raw.toUpperCase() === 'N/A') {
      out[id] = null;
    } else {
      const n = Number(raw);
      out[id] = Number.isFinite(n) ? n : null;
    }
  }
  return out;
}

export function downloadText(filename: string, text: string, mime: string) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

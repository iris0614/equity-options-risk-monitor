import type { SnapshotRecord } from '../types';

const KEY = 'irm-snapshots-v1';

export function loadSnapshots(): SnapshotRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SnapshotRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSnapshots(list: SnapshotRecord[]) {
  localStorage.setItem(KEY, JSON.stringify(list));
}

export function upsertSnapshot(rec: SnapshotRecord) {
  const list = loadSnapshots().filter((s) => s.id !== rec.id);
  list.unshift(rec);
  saveSnapshots(list.slice(0, 30));
  return list;
}

export function deleteSnapshot(id: string) {
  const list = loadSnapshots().filter((s) => s.id !== id);
  saveSnapshots(list);
  return list;
}

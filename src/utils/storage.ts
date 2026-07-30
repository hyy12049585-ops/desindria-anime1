// ===== Local Storage Helpers =====

const PREFIX = "animeSite_";

export function saveToStorage<T>(key: string, data: T): void {
  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(PREFIX + key, serialized);
  } catch (err) {
    console.error(`[Storage] Failed to save "${key}":`, err);
  }
}

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`[Storage] Failed to load "${key}":`, err);
    return fallback;
  }
}

export function removeFromStorage(key: string): void {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch (err) {
    console.error(`[Storage] Failed to remove "${key}":`, err);
  }
}

export function clearAllStorage(): void {
  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => localStorage.removeItem(k));
  } catch (err) {
    console.error("[Storage] Failed to clear:", err);
  }
}

export function getStorageSize(): { used: string; keys: number } {
  let totalBytes = 0;
  let keyCount = 0;
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) {
      const val = localStorage.getItem(k) || "";
      totalBytes += k.length + val.length;
      keyCount++;
    }
  }
  const totalKB = (totalBytes * 2) / 1024; // UTF-16
  if (totalKB > 1024) {
    return { used: `${(totalKB / 1024).toFixed(2)} MB`, keys: keyCount };
  }
  return { used: `${totalKB.toFixed(1)} KB`, keys: keyCount };
}

export function exportStorageData(): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith(PREFIX)) {
      try {
        data[k.replace(PREFIX, "")] = JSON.parse(localStorage.getItem(k) || "null");
      } catch {
        data[k.replace(PREFIX, "")] = localStorage.getItem(k);
      }
    }
  }
  return data;
}

export function importStorageData(data: Record<string, unknown>): void {
  Object.entries(data).forEach(([key, value]) => {
    saveToStorage(key, value);
  });
}

export function hasStorageKey(key: string): boolean {
  return localStorage.getItem(PREFIX + key) !== null;
}

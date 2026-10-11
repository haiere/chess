const PREFIX = 'hajir-chess:';

function isAvailable() {
  try {
    const k = '__test__';
    localStorage.setItem(k, '1');
    localStorage.removeItem(k);
    return true;
  } catch { return false; }
}

const memoryStore = new Map();

export const storage = {
  get(key, fallback = null) {
    try {
      const raw = isAvailable()
        ? localStorage.getItem(PREFIX + key)
        : memoryStore.get(PREFIX + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch { return fallback; }
  },
  set(key, value) {
    try {
      const raw = JSON.stringify(value);
      if (isAvailable()) localStorage.setItem(PREFIX + key, raw);
      else memoryStore.set(PREFIX + key, raw);
    } catch { /* quota / privacy mode — abaikan */ }
  },
  remove(key) {
    try {
      if (isAvailable()) localStorage.removeItem(PREFIX + key);
      else memoryStore.delete(PREFIX + key);
    } catch { /* noop */ }
  }
};

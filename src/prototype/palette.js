import { useSyncExternalStore } from 'react';

// Bảng màu của prototype: 'garden' (Vườn) | 'graphite' (Than chì).
// Chế độ Sáng/Tối vẫn dùng utils/theme.js của kit → 2 × 2 = 4 tổ hợp để so sánh.
const KEY = 'anchay-proto-palette';
const listeners = new Set();

export const PALETTES = [
  { value: 'garden', label: 'Vườn' },
  { value: 'graphite', label: 'Than chì' },
];

const read = () => {
  try {
    return localStorage.getItem(KEY) === 'graphite' ? 'graphite' : 'garden';
  } catch {
    return 'garden';
  }
};

export function initPalette() {
  document.documentElement.dataset.palette = read();
}

export function setPalette(value) {
  try { localStorage.setItem(KEY, value); } catch { /* chỉ đổi trong phiên này */ }
  document.documentElement.dataset.palette = value;
  listeners.forEach((fn) => fn());
}

const subscribe = (fn) => { listeners.add(fn); return () => listeners.delete(fn); };
const snapshot = () => document.documentElement.dataset.palette || 'garden';

export function usePalette() {
  return useSyncExternalStore(subscribe, snapshot);
}

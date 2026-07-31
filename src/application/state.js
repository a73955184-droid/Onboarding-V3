import { emptyState } from '../domain/assessment-engine.js';

const KEY = 'aaronbux-onboarding-state-v2-4';

export function loadState() {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) || emptyState();
  } catch {
    return emptyState();
  }
}

export function saveState(state) {
  sessionStorage.setItem(KEY, JSON.stringify(state));
}

export function resetState() {
  sessionStorage.removeItem(KEY);
}

import { initialPlayerState, type PlayerState } from "@/data/types";

const KEY = "builder-kids-save-v1";

/**
 * LocalStorage persistence (locked decision: local-only for prototype).
 * The load/save surface is deliberately tiny so swapping in Supabase later
 * means changing this file only — the rest of the game never touches storage.
 */
export function loadState(): PlayerState {
  if (typeof window === "undefined") return initialPlayerState;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return initialPlayerState;
    const parsed = JSON.parse(raw) as PlayerState;
    if (parsed.version !== 1) return initialPlayerState; // future: migrate
    return parsed;
  } catch {
    return initialPlayerState;
  }
}

export function saveState(state: PlayerState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full/blocked — game keeps running in memory.
  }
}

export function clearSave(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
}

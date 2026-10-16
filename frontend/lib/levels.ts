import type { CefrLevel } from './types';

/**
 * XP required to advance one Falow level.
 * Mirrors the constant used by the backend (com.falow.xp.LevelService).
 */
export const XP_PER_LEVEL = 300;

const cefrOrder: CefrLevel[] = ['A1', 'A2', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C1+', 'C2'];

export function levelForXp(xp: number): number {
  return Math.max(1, Math.floor(xp / XP_PER_LEVEL) + 1);
}

export function xpIntoLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}

export function xpToNextLevel(xp: number): number {
  return XP_PER_LEVEL - xpIntoLevel(xp);
}

export function nextCefr(level: CefrLevel): CefrLevel {
  const index = cefrOrder.indexOf(level);
  return cefrOrder[Math.min(cefrOrder.length - 1, index + 1)];
}

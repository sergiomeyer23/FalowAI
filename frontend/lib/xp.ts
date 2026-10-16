import type { ActivityKind, CefrLevel, Exercise, ExerciseResult, LearningState, RecurringError, RecentSession } from './types';
import { levelForXp } from './levels';

/**
 * Anti-farming tiers: after the first attempt, each additional attempt earns
 * less. The schedule is data, not scattered magic numbers.
 */
const ANTI_FARMING_TIERS: ReadonlyArray<{ fromAttempt: number; multiplier: number }> = [
  { fromAttempt: 1, multiplier: 1 },
  { fromAttempt: 2, multiplier: 0.5 },
  { fromAttempt: 3, multiplier: 0.25 },
  { fromAttempt: 4, multiplier: 0.05 }
];

function antiFarmingMultiplierFor(attemptNumber: number): number {
  let multiplier = ANTI_FARMING_TIERS[ANTI_FARMING_TIERS.length - 1].multiplier;
  for (const tier of ANTI_FARMING_TIERS) {
    if (attemptNumber >= tier.fromAttempt) {
      multiplier = tier.multiplier;
    }
  }
  return multiplier;
}

export function calculateXpAward(
  baseXp: number,
  attemptNumber: number,
  correct: boolean,
  difficulty = 1
): number {
  const antiFarming = antiFarmingMultiplierFor(attemptNumber);
  const performance = correct ? 1 : 0.2;
  return Math.max(1, Math.round(baseXp * difficulty * performance * antiFarming));
}

export function activityKindFor(exercise: Exercise): ActivityKind {
  return exercise.skill === 'professional' ? 'professional' : exercise.skill;
}

function normalizeForErrorKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function matchesErrorKey(error: RecurringError, errorKey: string): boolean {
  const key = normalizeForErrorKey(errorKey);
  const title = normalizeForErrorKey(error.title);
  const keyAlias = errorKey.toLowerCase().replace(/\s+/g, '-');
  return title.includes(key) || key.includes(title) || error.id.toLowerCase().includes(keyAlias);
}

function updateError(state: LearningState, errorKey: string, correct: boolean) {
  return state.errors.map((error) => {
    if (!matchesErrorKey(error, errorKey)) return error;
    const occurrences = correct ? error.occurrences : error.occurrences + 1;
    const corrected = correct ? error.corrected + 1 : error.corrected;
    const rate = corrected / Math.max(occurrences, 1);
    return {
      ...error,
      occurrences,
      corrected,
      status: rate >= 0.85 ? 'Mastered' : rate >= 0.6 ? 'Improving' : 'Needs review',
      lastSeen: 'Just now'
    } as const;
  });
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function skillLevelFromScore(score: number): CefrLevel {
  if (score >= 94) return 'C2';
  if (score >= 88) return 'C1+';
  if (score >= 81) return 'C1';
  if (score >= 74) return 'B2+';
  if (score >= 67) return 'B2';
  if (score >= 59) return 'B1+';
  if (score >= 48) return 'B1';
  if (score >= 35) return 'A2';
  return 'A1';
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

export function applyExerciseResult(
  state: LearningState,
  exercise: Exercise,
  result: ExerciseResult
): { state: LearningState; awardedXp: number } {
  const attemptNumber = (state.activityAttempts[exercise.id] ?? 0) + 1;
  const awardedXp = calculateXpAward(exercise.baseXp, attemptNumber, result.correct, exercise.level.includes('C') ? 1.25 : 1);
  const skill = state.skills[exercise.skill];
  const scoreDelta = result.correct ? (attemptNumber === 1 ? 1.5 : 0.75) : -0.75;
  const nextScore = clamp(skill.score + scoreDelta, 0, 100);
  const nextXp = state.profile.xp + awardedXp;
  const today = todayKey();
  const dailyTotal = (state.dailyXp[today] ?? 0) + awardedXp;
  const updatedErrors = exercise.errorKey
    ? updateError(state, exercise.errorKey, result.correct)
    : state.errors;
  const session: RecentSession = {
    id: `${exercise.id}-${Date.now()}`,
    title: exercise.topic,
    kind: activityKindFor(exercise),
    score: result.score,
    xp: awardedXp,
    date: 'Just now'
  };

  return {
    awardedXp,
    state: {
      ...state,
      profile: {
        ...state.profile,
        xp: nextXp,
        falowLevel: levelForXp(nextXp),
        lastSession: 'Just now'
      },
      skills: {
        ...state.skills,
        [exercise.skill]: { ...skill, score: Math.round(nextScore), level: skillLevelFromScore(nextScore) }
      },
      errors: updatedErrors,
      completedActivityIds: result.correct && !state.completedActivityIds.includes(exercise.id)
        ? [...state.completedActivityIds, exercise.id]
        : state.completedActivityIds,
      activityAttempts: { ...state.activityAttempts, [exercise.id]: attemptNumber },
      recentSessions: [session, ...state.recentSessions].slice(0, 6),
      dailyXp: { ...state.dailyXp, [today]: dailyTotal },
      lastUpdated: new Date().toISOString()
    }
  };
}

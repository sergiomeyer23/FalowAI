import type { Exercise, ExerciseResult } from './types';

/**
 * Normalizes a user answer before comparing it with an accepted answer.
 * Case, surrounding whitespace, punctuation and repeated spaces are ignored.
 */
export function normalizeAnswer(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[“”"']/g, '')
    .replace(/[.!?,;:]+$/g, '')
    .replace(/\s+/g, ' ');
}

export function evaluateExercise(exercise: Exercise, answer: string): ExerciseResult {
  const normalized = normalizeAnswer(answer);
  const correct = exercise.acceptedAnswers.some((accepted) => normalizeAnswer(accepted) === normalized);

  return {
    correct,
    score: correct ? 100 : 0,
    answer,
    correctAnswer: exercise.answer,
    explanation: exercise.explanation,
    naturalAlternative: exercise.naturalAlternative
  };
}

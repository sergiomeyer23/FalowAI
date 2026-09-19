import type {
  CefrLevel,
  Exercise,
  ExerciseResult,
  LearningState,
  RecentSession,
  SkillKey,
  SpeakingFeedback
} from './types';

const cefrOrder: CefrLevel[] = ['A1', 'A2', 'B1', 'B1+', 'B2', 'B2+', 'C1', 'C1+', 'C2'];

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

export function levelForXp(xp: number): number {
  return Math.max(1, Math.floor(xp / 300) + 1);
}

export function xpIntoLevel(xp: number): number {
  return xp % 300;
}

export function xpToNextLevel(xp: number): number {
  return 300 - xpIntoLevel(xp);
}

export function calculateXpAward(
  baseXp: number,
  attemptNumber: number,
  correct: boolean,
  difficulty = 1
): number {
  const antiFarming = attemptNumber <= 1 ? 1 : attemptNumber === 2 ? 0.5 : attemptNumber === 3 ? 0.25 : 0.05;
  const performance = correct ? 1 : 0.2;
  return Math.max(1, Math.round(baseXp * difficulty * performance * antiFarming));
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
  const now = new Date().toISOString();
  const updatedErrors = exercise.errorKey
    ? updateError(state, exercise.errorKey, result.correct)
    : state.errors;
  const session: RecentSession = {
    id: `${exercise.id}-${Date.now()}`,
    title: exercise.topic,
    kind: exercise.skill === 'professional' ? 'professional' : exercise.skill,
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
      lastUpdated: now
    }
  };
}

function updateError(state: LearningState, errorKey: string, correct: boolean) {
  const simplify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const simplifiedKey = simplify(errorKey);
  return state.errors.map((error) => {
    const simplifiedTitle = simplify(error.title);
    const matches = simplifiedTitle.includes(simplifiedKey) || simplifiedKey.includes(simplifiedTitle) ||
      error.id.toLowerCase().includes(errorKey.toLowerCase().replace(/\s+/g, '-'));
    if (!matches) return error;
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

export function recommendationFor(state: LearningState): { eyebrow: string; title: string; body: string; action: string; href: string } {
  const weakest = Object.values(state.skills).sort((a, b) => a.score - b.score)[0];
  const urgentError = [...state.errors]
    .filter((error) => error.status !== 'Mastered')
    .sort((a, b) => (b.occurrences - b.corrected) - (a.occurrences - a.corrected))[0];

  if (weakest.key === 'speaking') {
    return {
      eyebrow: 'Recommended next',
      title: 'Say it before you study it',
      body: 'Your speaking evidence is lagging behind your reading. Explain a technical problem aloud and let Falow look for patterns.',
      action: 'Open speaking practice',
      href: '/speaking'
    };
  }
  if (urgentError) {
    return {
      eyebrow: 'Memory signal',
      title: `Review ${urgentError.title.toLowerCase()}`,
      body: `${urgentError.occurrences - urgentError.corrected} recent signals suggest this pattern is not stable yet. A short retrieval task will be more useful than another explanation.`,
      action: 'Start targeted review',
      href: '/practice'
    };
  }
  return {
    eyebrow: 'Recommended next',
    title: 'Push one level higher',
    body: `Your ${weakest.label.toLowerCase()} evidence is ready for a controlled challenge at ${nextCefr(weakest.level)}.`,
    action: 'Continue learning',
    href: '/practice'
  };
}

function nextCefr(level: CefrLevel): CefrLevel {
  const index = cefrOrder.indexOf(level);
  return cefrOrder[Math.min(cefrOrder.length - 1, index + 1)];
}

export function analyzeSpeakingTranscript(transcript: string): SpeakingFeedback {
  const clean = transcript.trim();
  const lower = clean.toLowerCase();
  const corrections: SpeakingFeedback['corrections'] = [];

  if (/\bi have went\b/.test(lower)) {
    corrections.push({
      original: 'I have went',
      corrected: 'I have gone',
      explanation: 'After have, use the past participle gone, not the simple past went.',
      severity: 'high'
    });
  }
  if (/\bdepend of\b/.test(lower)) {
    corrections.push({
      original: 'depend of',
      corrected: 'depend on',
      explanation: 'The verb depend is followed by the preposition on.',
      severity: 'medium'
    });
  }
  if (/\bdo a decision\b/.test(lower)) {
    corrections.push({
      original: 'do a decision',
      corrected: 'make a decision',
      explanation: 'Make a decision is the standard collocation.',
      severity: 'medium'
    });
  }
  if (/\byesterday[^.?!]*\b(go|need|have)\b/.test(lower)) {
    corrections.push({
      original: 'yesterday I go / need / have',
      corrected: 'yesterday I went / needed / had',
      explanation: 'A finished past time marker such as yesterday normally calls for the simple past.',
      severity: 'medium'
    });
  }

  const wordCount = clean ? clean.split(/\s+/).length : 0;
  const score = clean.length === 0 ? 0 : clamp(86 - corrections.length * 13 + (wordCount > 45 ? 5 : wordCount > 20 ? 2 : 0), 35, 96);
  const strengths = [];
  if (wordCount >= 20) strengths.push('You developed an idea rather than answering with a fragment.');
  if (/\b(because|however|therefore|although|first|then|finally)\b/i.test(clean)) strengths.push('You used a connector to make the explanation easier to follow.');
  if (corrections.length === 0 && wordCount > 10) strengths.push('No high-signal recurring error was detected in this transcript.');
  if (strengths.length === 0) strengths.push('You started the response clearly; now extend it with one concrete example.');

  return {
    response: corrections.length
      ? 'That is a useful explanation. I understood the main idea; let’s tighten two language choices before you try it again.'
      : 'Good — the explanation is clear enough to build on. Now make it more precise by adding the evidence you would check first.',
    summary: corrections.length
      ? `${corrections.length} pattern${corrections.length > 1 ? 's' : ''} worth reviewing before the next attempt.`
      : 'No high-signal correction was found in this short sample.',
    score,
    corrections,
    strengths,
    nextFocus: corrections[0]?.corrected ?? 'Add one specific example and one consequence to your explanation.'
  };
}

export function assessmentLevel(score: number): CefrLevel {
  if (score >= 88) return 'B2+';
  if (score >= 75) return 'B2';
  if (score >= 60) return 'B1+';
  if (score >= 40) return 'B1';
  return 'A2';
}

export function skillKeyForAssessment(score: number): SkillKey {
  if (score >= 85) return 'reading';
  if (score >= 70) return 'grammar';
  return 'speaking';
}

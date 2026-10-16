import type { LearningState, SkillSnapshot } from './types';
import { nextCefr } from './levels';

export interface Recommendation {
  eyebrow: string;
  title: string;
  body: string;
  action: string;
  href: string;
}

export function recommendationFor(state: LearningState): Recommendation {
  const skills = Object.values(state.skills).filter((skill): skill is SkillSnapshot => Boolean(skill));
  if (skills.length === 0) {
    return {
      eyebrow: 'Recommended next',
      title: 'Complete your first assessment',
      body: 'Your skill evidence starts with an assessment. Run one to give every level a real baseline.',
      action: 'Start assessment',
      href: '/assessment'
    };
  }

  const weakest = [...skills].sort((a, b) => a.score - b.score)[0];
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

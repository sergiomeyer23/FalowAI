export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B1+' | 'B2' | 'B2+' | 'C1' | 'C1+' | 'C2';

export type SkillKey =
  | 'grammar'
  | 'vocabulary'
  | 'reading'
  | 'listening'
  | 'writing'
  | 'speaking'
  | 'professional';

export type ActivityKind = 'grammar' | 'vocabulary' | 'reading' | 'listening' | 'writing' | 'speaking' | 'professional';

export interface SkillSnapshot {
  key: SkillKey;
  label: string;
  shortLabel: string;
  level: CefrLevel;
  score: number;
  color: string;
  accent: string;
}

export interface RecurringError {
  id: string;
  title: string;
  category: string;
  example: string;
  correction: string;
  occurrences: number;
  corrected: number;
  severity: 'low' | 'medium' | 'high';
  status: 'Needs review' | 'Improving' | 'Mastered';
  lastSeen: string;
}

export interface Activity {
  id: string;
  kind: ActivityKind;
  title: string;
  subtitle: string;
  duration: number;
  xp: number;
  level: CefrLevel;
  status: 'next' | 'available' | 'complete';
}

export type ExerciseType = 'choice' | 'short-answer';

export interface Exercise {
  id: string;
  type: ExerciseType;
  skill: SkillKey;
  level: CefrLevel;
  topic: string;
  objective: string;
  prompt: string;
  context?: string;
  options?: string[];
  mediaText?: string;
  acceptedAnswers: string[];
  answer: string;
  explanation: string;
  naturalAlternative?: string;
  errorKey?: string;
  baseXp: number;
}

export interface ExerciseResult {
  correct: boolean;
  score: number;
  answer: string;
  correctAnswer: string;
  explanation: string;
  naturalAlternative?: string;
}

export interface AssessmentQuestion {
  id: string;
  skill: SkillKey;
  level: CefrLevel;
  prompt: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Profile {
  name: string;
  cefr: CefrLevel;
  falowLevel: number;
  xp: number;
  streak: number;
  studyMinutesThisWeek: number;
  assessmentCompleted: boolean;
  lastSession: string;
}

export interface LearningState {
  profile: Profile;
  skills: Record<SkillKey, SkillSnapshot>;
  errors: RecurringError[];
  activities: Activity[];
  completedActivityIds: string[];
  activityAttempts: Record<string, number>;
  recentSessions: RecentSession[];
  assessmentHistory: AssessmentRecord[];
  vocabularyReviewCount: number;
  lastUpdated: string;
}

export interface RecentSession {
  id: string;
  title: string;
  kind: ActivityKind;
  score: number;
  xp: number;
  date: string;
}

export interface AssessmentRecord {
  id: string;
  date: string;
  previousLevel: CefrLevel;
  newLevel: CefrLevel;
  score: number;
  focus: string;
}

export interface SpeakingCorrection {
  original: string;
  corrected: string;
  explanation: string;
  severity: 'low' | 'medium' | 'high';
}

export interface SpeakingFeedback {
  response: string;
  summary: string;
  score: number;
  corrections: SpeakingCorrection[];
  strengths: string[];
  nextFocus: string;
}

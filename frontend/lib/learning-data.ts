import type { AssessmentQuestion, Activity, Exercise, LearningState, SkillKey, SkillSnapshot } from './types';

export const skillMeta: Record<SkillKey, Omit<SkillSnapshot, 'key' | 'level' | 'score'>> = {
  grammar: { label: 'Grammar', shortLabel: 'Grammar', color: '#4F8CFF', accent: 'blue' },
  vocabulary: { label: 'Vocabulary', shortLabel: 'Vocab', color: '#7C5CFC', accent: 'violet' },
  reading: { label: 'Reading', shortLabel: 'Reading', color: '#35C98B', accent: 'mint' },
  listening: { label: 'Listening', shortLabel: 'Listening', color: '#F2B84B', accent: 'amber' },
  writing: { label: 'Writing', shortLabel: 'Writing', color: '#E879A8', accent: 'pink' },
  speaking: { label: 'Speaking', shortLabel: 'Speaking', color: '#59C3F0', accent: 'cyan' },
  professional: { label: 'Professional English', shortLabel: 'Professional', color: '#B8A2FF', accent: 'lilac' }
};

export const initialActivities: Activity[] = [
  {
    id: 'grammar-contrast-01',
    kind: 'grammar',
    title: 'Past time, precise meaning',
    subtitle: 'Present perfect vs. simple past',
    duration: 12,
    xp: 20,
    level: 'B2',
    status: 'next'
  },
  {
    id: 'listening-workplace-01',
    kind: 'listening',
    title: 'Listen between the lines',
    subtitle: 'A meeting update with implied meaning',
    duration: 18,
    xp: 25,
    level: 'B2',
    status: 'available'
  },
  {
    id: 'speaking-database-01',
    kind: 'speaking',
    title: 'Explain a database problem',
    subtitle: 'Spontaneous professional speaking',
    duration: 15,
    xp: 30,
    level: 'B1+',
    status: 'available'
  },
  {
    id: 'vocabulary-collocations-01',
    kind: 'vocabulary',
    title: 'Make, do and take',
    subtitle: 'High-frequency workplace collocations',
    duration: 10,
    xp: 15,
    level: 'B1+',
    status: 'available'
  }
];

export const exercises: Exercise[] = [
  {
    id: 'grammar-past-contrast-01',
    type: 'choice',
    skill: 'grammar',
    level: 'B2',
    topic: 'past time reference',
    objective: 'distinguish a finished past event from an experience with present relevance',
    prompt: 'I can’t open the report because I ______ the password.',
    context: 'The speaker is talking about a situation that affects the present moment.',
    options: ['forgot', 'have forgotten', 'had forgotten', 'was forgetting'],
    acceptedAnswers: ['have forgotten'],
    answer: 'have forgotten',
    explanation: 'Use the present perfect because the past action has a clear consequence now: the report is still inaccessible.',
    naturalAlternative: 'I can’t open the report — I’ve forgotten the password.',
    errorKey: 'present perfect vs simple past',
    baseXp: 20
  },
  {
    id: 'grammar-past-contrast-02',
    type: 'short-answer',
    skill: 'grammar',
    level: 'B2',
    topic: 'third conditional',
    objective: 'form a counterfactual past condition accurately',
    prompt: 'If I ______ (know) about the outage, I would have warned the team.',
    context: 'Complete the verb in the third conditional.',
    acceptedAnswers: ['had known'],
    answer: 'had known',
    explanation: 'The if-clause uses past perfect for an unreal past condition: if I had known.',
    errorKey: 'third conditional form',
    baseXp: 25
  },
  {
    id: 'grammar-past-contrast-03',
    type: 'choice',
    skill: 'grammar',
    level: 'B2+',
    topic: 'past time reference',
    objective: 'use a finished time marker with the simple past',
    prompt: 'We ______ the migration last Friday, so the old server is offline now.',
    options: ['have completed', 'completed', 'had completed', 'complete'],
    acceptedAnswers: ['completed'],
    answer: 'completed',
    explanation: 'Last Friday is a finished, specific time, so the simple past is the natural choice.',
    naturalAlternative: 'We completed the migration last Friday, and the old server is offline now.',
    errorKey: 'present perfect vs simple past',
    baseXp: 20
  },
  {
    id: 'vocabulary-make-do-01',
    type: 'choice',
    skill: 'vocabulary',
    level: 'B1+',
    topic: 'collocations',
    objective: 'choose a natural collocation in a professional context',
    prompt: 'We need to ______ a decision before the meeting ends.',
    options: ['do', 'make', 'take up', 'create'],
    acceptedAnswers: ['make'],
    answer: 'make',
    explanation: 'The fixed collocation is make a decision. Take a decision also exists, especially in British English, but make is the most broadly natural choice here.',
    naturalAlternative: 'We need to make a decision before the meeting ends.',
    errorKey: 'make vs do',
    baseXp: 15
  }
];

export const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'assessment-01',
    skill: 'grammar',
    level: 'B1',
    prompt: 'I ______ in Cascavel since 2018.',
    options: ['live', 'lived', 'have lived', 'am living'],
    answerIndex: 2,
    explanation: 'Since + a continuing situation normally takes the present perfect.'
  },
  {
    id: 'assessment-02',
    skill: 'vocabulary',
    level: 'B1+',
    prompt: 'The closest meaning to “reliable” is:',
    options: ['expensive', 'dependable', 'temporary', 'visible'],
    answerIndex: 1,
    explanation: 'Reliable and dependable both describe something or someone you can trust to work well.'
  },
  {
    id: 'assessment-03',
    skill: 'reading',
    level: 'B2',
    prompt: '“The proposal is promising, albeit costly.” What does “albeit” signal?',
    options: ['A reason', 'A contrast or concession', 'A sequence', 'A conclusion'],
    answerIndex: 1,
    explanation: 'Albeit means although or even though, introducing a concession.'
  },
  {
    id: 'assessment-04',
    skill: 'grammar',
    level: 'B2',
    prompt: 'If the query ______ indexed correctly, it would run faster.',
    options: ['is', 'were', 'had been', 'has been'],
    answerIndex: 1,
    explanation: 'This is a second conditional about a hypothetical present situation: if it were indexed.'
  },
  {
    id: 'assessment-05',
    skill: 'writing',
    level: 'B2',
    prompt: 'Choose the most natural professional sentence.',
    options: [
      'I look forward to hear from you.',
      'I am looking forward to hearing from you.',
      'I look forward hearing from you.',
      'I look forwards to hear from you.'
    ],
    answerIndex: 1,
    explanation: 'Look forward to is followed by a noun or gerund: I look forward to hearing from you.'
  },
  {
    id: 'assessment-06',
    skill: 'listening',
    level: 'B2',
    prompt: 'In natural speech, “Could you send it over when you get a chance?” is usually:',
    options: ['An aggressive order', 'A polite request', 'A refusal', 'A warning'],
    answerIndex: 1,
    explanation: 'The phrasing softens a request and leaves the timing flexible.'
  },
  {
    id: 'assessment-07',
    skill: 'professional',
    level: 'B2+',
    prompt: 'Which sentence best explains a technical uncertainty?',
    options: [
      'The issue is maybe because the data is bad.',
      'The issue may stem from an inconsistency in the source data.',
      'The issue comes from bad data, I think maybe.',
      'The issue is having a problem in the data.'
    ],
    answerIndex: 1,
    explanation: 'May stem from is precise and appropriately cautious for professional communication.'
  },
  {
    id: 'assessment-08',
    skill: 'vocabulary',
    level: 'B2+',
    prompt: 'Which adjective best describes a decision based on careful evidence?',
    options: ['arbitrary', 'informed', 'random', 'casual'],
    answerIndex: 1,
    explanation: 'An informed decision is supported by relevant knowledge or evidence.'
  }
];

export const initialState: LearningState = {
  profile: {
    name: 'Sérgio',
    cefr: 'B1+',
    falowLevel: 17,
    xp: 4820,
    streak: 6,
    studyMinutesThisWeek: 112,
    assessmentCompleted: false,
    lastSession: 'Today, 08:42'
  },
  skills: {
    grammar: { key: 'grammar', ...skillMeta.grammar, level: 'B2', score: 74 },
    vocabulary: { key: 'vocabulary', ...skillMeta.vocabulary, level: 'B1+', score: 58 },
    reading: { key: 'reading', ...skillMeta.reading, level: 'B2+', score: 81 },
    listening: { key: 'listening', ...skillMeta.listening, level: 'B1+', score: 55 },
    writing: { key: 'writing', ...skillMeta.writing, level: 'B2', score: 72 },
    speaking: { key: 'speaking', ...skillMeta.speaking, level: 'B1+', score: 61 },
    professional: { key: 'professional', ...skillMeta.professional, level: 'B2', score: 68 }
  },
  errors: [
    {
      id: 'error-present-perfect',
      title: 'Present perfect vs. simple past',
      category: 'Verb tense',
      example: 'I have visited São Paulo last year.',
      correction: 'I visited São Paulo last year.',
      occurrences: 9,
      corrected: 5,
      severity: 'medium',
      status: 'Needs review',
      lastSeen: '2 days ago'
    },
    {
      id: 'error-make-do',
      title: 'Make vs. do',
      category: 'Collocation',
      example: 'I need to do a decision.',
      correction: 'I need to make a decision.',
      occurrences: 12,
      corrected: 8,
      severity: 'medium',
      status: 'Improving',
      lastSeen: 'Yesterday'
    },
    {
      id: 'error-prepositions',
      title: 'Prepositions in technical phrases',
      category: 'Preposition',
      example: 'It depends of the environment.',
      correction: 'It depends on the environment.',
      occurrences: 6,
      corrected: 2,
      severity: 'high',
      status: 'Needs review',
      lastSeen: 'Today'
    }
  ],
  activities: initialActivities,
  completedActivityIds: [],
  activityAttempts: {},
  recentSessions: [
    { id: 'session-1', title: 'SQL incident explanation', kind: 'professional', score: 78, xp: 36, date: 'Today' },
    { id: 'session-2', title: 'Collocations in context', kind: 'vocabulary', score: 84, xp: 15, date: 'Yesterday' },
    { id: 'session-3', title: 'Reading: The hidden cost of speed', kind: 'reading', score: 91, xp: 22, date: 'Sep 16' }
  ],
  assessmentHistory: [],
  vocabularyReviewCount: 18,
  lastUpdated: new Date().toISOString()
};

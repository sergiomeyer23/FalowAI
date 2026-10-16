import type { SpeakingCorrection, SpeakingFeedback, SkillKey } from './types';

/**
 * Um padrão catalogado descreve uma correção recorrente que Falow procura.
 * A lista é dados (e não código disperso): novos padrões são adicionados
 * aqui sem tocar nas funções de análise.
 */
interface LanguagePattern {
  id: string;
  /** Expressão regular que casa com o erro, na forma em que aparece no transcript. */
  pattern: RegExp;
  /** Como o erro apareceu quando o usuário o produziu. */
  original: string;
  /** A forma naturalmente correta. */
  corrected: string;
  explanation: string;
  severity: SpeakingCorrection['severity'];
}

const RULES: LanguagePattern[] = [
  // --- Verb tense and time reference ---
  {
    id: 'have-gone',
    pattern: /\bi have went\b/i,
    original: 'I have went',
    corrected: 'I have gone',
    explanation: 'After "have", use the past participle "gone", not the simple past "went".',
    severity: 'high'
  },
  {
    id: 'finished-time-simple-past',
    pattern: /\byesterday[^.?!]*\b(go|need|have)\b/i,
    original: 'yesterday I go / need / have',
    corrected: 'yesterday I went / needed / had',
    explanation: 'A finished time marker such as "yesterday" normally calls for the simple past.',
    severity: 'medium'
  },
  // --- Collocations ---
  {
    id: 'depend-on',
    pattern: /\bdepend of\b/i,
    original: 'depend of',
    corrected: 'depend on',
    explanation: 'The verb "depend" is followed by the preposition "on".',
    severity: 'high'
  },
  {
    id: 'make-a-decision',
    pattern: /\bdo a decision\b/i,
    original: 'do a decision',
    corrected: 'make a decision',
    explanation: '"Make a decision" is the standard collocation.',
    severity: 'medium'
  },
  // --- Common speech-recognition artifacts (ASR) ---
  {
    id: 'double-word',
    pattern: /\b(\w+) \1\b/i,
    original: 'the the',
    corrected: 'the',
    explanation: 'Repeated words are usually a transcription artifact.',
    severity: 'low'
  },
  {
    id: 'teh',
    pattern: /\bteh\b/i,
    original: 'teh',
    corrected: 'the',
    explanation: '"Teh" is a common misspelling of "the".',
    severity: 'low'
  },
  {
    id: 'recieve',
    pattern: /\brecieve\b/i,
    original: 'recieve',
    corrected: 'receive',
    explanation: '"Receive" is the regular past form.',
    severity: 'low'
  },
  {
    id: 'adress',
    pattern: /\badress\b/i,
    original: 'adress',
    corrected: 'address',
    explanation: '"Address" is the base form here.',
    severity: 'low'
  },
  {
    id: 'seperate',
    pattern: /\bseperate\b/i,
    original: 'seperate',
    corrected: 'separate',
    explanation: 'The adjective is "separate".',
    severity: 'low'
  },
  {
    id: 'occured',
    pattern: /\boccured\b/i,
    original: 'occured',
    corrected: 'occurred',
    explanation: 'The past tense is "occurred".',
    severity: 'low'
  },
  {
    id: 'wich',
    pattern: /\bwich\b/i,
    original: 'wich',
    corrected: 'which',
    explanation: '"Which" is the interrogative form.',
    severity: 'low'
  },
  {
    id: 'becuase',
    pattern: /\bbecuase\b/i,
    original: 'becuase',
    corrected: 'because',
    explanation: '"Because" is the conjunction.',
    severity: 'low'
  },
  {
    id: 'definately',
    pattern: /\bdefinately\b/i,
    original: 'definately',
    corrected: 'definitely',
    explanation: '"Definitely" is the adverb.',
    severity: 'low'
  },
  {
    id: 'thier',
    pattern: /\bthier\b/i,
    original: 'thier',
    corrected: 'their',
    explanation: '"Their" is the possessive form.',
    severity: 'low'
  },
  {
    id: 'untill',
    pattern: /\buntill\b/i,
    original: 'untill',
    corrected: 'until',
    explanation: '"Until" is the conjunction.',
    severity: 'low'
  }
];

function severityRank(severity: SpeakingCorrection['severity']): number {
  if (severity === 'high') return 0;
  if (severity === 'medium') return 1;
  return 2;
}

function collapseRepeatedWords(text: string): string {
  return text.replace(/\b(\w+)\s+\1\b/gi, '$1');
}

export function analyzeSpeakingTranscript(
  transcript: string,
  context?: { skill?: import('./types').SkillKey }
): SpeakingFeedback {
  const clean = collapseRepeatedWords(transcript.trim());
  const lower = clean.toLowerCase();
  const corrections: SpeakingCorrection[] = [];

  const orderedRules = [...RULES].sort((a, b) => severityRank(a.severity) - severityRank(b.severity));
  for (const rule of orderedRules) {
    const match = rule.pattern.exec(clean);
    if (!match) continue;
    if (corrections.some((correction) => correction.corrected === rule.corrected)) continue;
    corrections.push({
      original: rule.original,
      corrected: rule.corrected,
      explanation: rule.explanation,
      severity: rule.severity,
      ...(context?.skill ? { skill: context.skill } : {})
    });
  }

  const wordCount = clean ? clean.split(/\s+/).length : 0;
  const score = clean.length === 0 ? 0 : clamp(86 - corrections.length * 13 + (wordCount > 45 ? 5 : wordCount > 20 ? 2 : 0), 35, 96);
  const strengths: string[] = [];
  if (wordCount >= 20) strengths.push('You developed an idea rather than answering with a fragment.');
  if (/\b(because|however|therefore|although|first|then|finally)\b/i.test(clean)) strengths.push('You used a connector to make the explanation easier to follow.');
  if (corrections.length === 0 && wordCount > 10) strengths.push('No high-signal recurring error was detected in this transcript.');
  if (strengths.length === 0) strengths.push('You started the response clearly; now extend it with one concrete example.');

  return {
    response: corrections.length
      ? 'That is a useful explanation. I understood the main idea; let’s tighten a few language choices before you try it again.'
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

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

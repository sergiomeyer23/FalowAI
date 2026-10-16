import type { SpeakingFeedback } from './types';

export function analyzeSpeakingTranscript(transcript: string): SpeakingFeedback {
  const clean = transcript.trim();
  const lower = clean.toLowerCase();
  const corrections: SpeakingFeedback['corrections'] = [];

  if (/\bi have went\b/.test(lower)) {
    corrections.push({
      original: 'I have went',
      corrected: 'I have gone',
      explanation: 'After have, use the past participle gone, not the simple past.',
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

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

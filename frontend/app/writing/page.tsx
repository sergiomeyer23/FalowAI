'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { ArrowRightIcon, CheckIcon, TargetIcon } from '@/components/icons';
import { useLearningState } from '@/hooks/use-learning-state';
import { levelForXp } from '@/lib/learning-engine';

const task = 'Write a concise professional update explaining that a database incident has been contained, what you are checking next, and when the team will send another update.';

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function WritingPage() {
  const { state, updateState } = useLearningState();
  const [text, setText] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [evidence, setEvidence] = useState<{ score: number; words: number; sentences: number; connectors: number; xp: number; note: string } | null>(null);

  function submit() {
    if (!text.trim() || submitted) return;
    const words = text.trim().split(/\s+/).filter(Boolean);
    const sentences = text.split(/[.!?]+/).filter((part) => part.trim()).length;
    const connectors = (text.match(/\b(because|however|therefore|although|while|first|then|finally|so that|as a result)\b/gi) || []).length;
    const hasTechnicalDetail = /\b(query|database|incident|logs?|rollback|deploy|validation|root cause|monitoring|client|team)\b/i.test(text);
    const score = clamp(38 + Math.min(words.length, 90) * 0.35 + Math.min(sentences, 5) * 3 + Math.min(connectors, 3) * 5 + (hasTechnicalDetail ? 9 : 0), 0, 100);
    const roundedScore = Math.round(score);
    const xp = Math.max(5, Math.round(25 * (roundedScore / 100)));
    const note = words.length < 45
      ? 'The message is too short for the task. Add the consequence, the next check and a time for the next update.'
      : connectors === 0
        ? 'The content has enough length, but one or two explicit connectors would make the sequence easier to follow.'
        : hasTechnicalDetail
          ? 'The update includes concrete professional detail. The next improvement is precision of register and sentence-level naturalness.'
          : 'The structure is developing. Add one concrete technical detail so the reader can trust the update.';
    setEvidence({ score: roundedScore, words: words.length, sentences, connectors, xp, note });
    setSubmitted(true);
    updateState((current) => ({
      ...current,
      profile: { ...current.profile, xp: current.profile.xp + xp, falowLevel: levelForXp(current.profile.xp + xp), lastSession: 'Just now', studyMinutesThisWeek: current.profile.studyMinutesThisWeek + 10 },
      skills: { ...current.skills, writing: { ...current.skills.writing, score: Math.min(100, current.skills.writing.score + (roundedScore >= 70 ? 1 : 0)) } },
      recentSessions: [{ id: `writing-${Date.now()}`, title: 'Professional incident update', kind: 'writing' as const, score: roundedScore, xp, date: 'Just now' }, ...current.recentSessions].slice(0, 6),
      lastUpdated: new Date().toISOString()
    }));
  }

  function reset() {
    setText('');
    setSubmitted(false);
    setEvidence(null);
  }

  return <AppShell><PageHeader eyebrow="Writing lab · Professional English" title="Make the update useful." subtitle="Write for a real reader. This first rubric records observable evidence without pretending that a heuristic is a full semantic correction." action="Speaking lab" actionHref="/speaking" /><div className="practice-layout"><section className="card exercise-card"><div className="exercise-meta"><span className="pill blue"><TargetIcon size={12} /> B2</span><span className="pill">professional register</span><span className="pill">25 XP base</span></div><p className="exercise-context">Task: {task}</p><h2 className="exercise-prompt" style={{ fontSize: 22 }}>Your version</h2><textarea className="answer-input" style={{ minHeight: 230, resize: 'vertical', lineHeight: 1.65 }} value={text} onChange={(event) => setText(event.target.value)} placeholder="Write 70–120 words…" disabled={submitted} /><div className="exercise-footer"><span className="exercise-footer-note">{text.trim().split(/\s+/).filter(Boolean).length} words · aim for a complete update, not perfect decoration.</span>{submitted ? <button className="secondary-button" onClick={reset}>Write another version <ArrowRightIcon size={14} /></button> : <button className="primary-button" onClick={submit} disabled={!text.trim()} style={{ opacity: text.trim() ? 1 : .5 }}>Submit writing <ArrowRightIcon size={14} /></button>}</div>{evidence ? <div className="feedback correct"><div className="feedback-title"><CheckIcon size={16} /> Evidence recorded · +{evidence.xp} XP</div><p className="feedback-copy">{evidence.note}</p><div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', marginTop: 15 }}><span className="card-meta"><b style={{ color: 'white', fontSize: 18 }}>{evidence.score}</b> / 100 signal</span><span className="card-meta"><b style={{ color: 'white' }}>{evidence.words}</b> words</span><span className="card-meta"><b style={{ color: 'white' }}>{evidence.sentences}</b> sentences</span><span className="card-meta"><b style={{ color: 'white' }}>{evidence.connectors}</b> connectors</span></div><p className="feedback-next"><strong>Scope:</strong> this pass measures task completion, development and visible organization. Semantic corrections and a corrected/advanced version should be generated by the connected AI provider in the next backend-backed flow, not invented locally.</p></div> : null}</section><aside className="side-stack"><section className="card card-pad"><div className="section-heading"><div><h2>Writing evidence</h2><p>What this short task can observe.</p></div></div><div className="info-list"><div className="info-row"><span>Task completion</span><b>Did you answer all parts?</b></div><div className="info-row"><span>Coherence</span><b>Sequence and connectors</b></div><div className="info-row"><span>Professional register</span><b>Specific, useful language</b></div><div className="info-row"><span>Full correction</span><b style={{ color: 'var(--muted)' }}>Needs AI context</b></div></div></section><section className="card card-pad"><div className="section-heading"><div><h2>Keep it concrete</h2><p>Professional English is not just terminology.</p></div></div><p className="card-meta">A strong update gives the reader status, impact, next action and a time for the next signal. Complexity only helps when it makes the message more precise.</p><Link className="secondary-button" href="/progress" style={{ marginTop: 18, width: '100%' }}>See writing progress <ArrowRightIcon size={14} /></Link></section></aside></div></AppShell>;
}

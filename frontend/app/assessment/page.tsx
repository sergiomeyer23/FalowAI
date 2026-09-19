'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { ArrowRightIcon, CheckIcon, RefreshIcon, SparkIcon } from '@/components/icons';
import { useLearningState } from '@/hooks/use-learning-state';
import { assessmentQuestions } from '@/lib/learning-data';
import { assessmentLevel as getAssessmentLevel } from '@/lib/learning-engine';
import type { CefrLevel } from '@/lib/types';

export default function AssessmentPage() {
  const { state, updateState } = useLearningState();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [complete, setComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [resultLevel, setResultLevel] = useState<CefrLevel>('B1');

  const question = assessmentQuestions[questionIndex];
  const correctSoFar = answers.filter(Boolean).length;

  function next() {
    if (selected === null) return;
    const nextAnswers = [...answers, selected === question.answerIndex];
    if (questionIndex === assessmentQuestions.length - 1) {
      const finalScore = Math.round((nextAnswers.filter(Boolean).length / assessmentQuestions.length) * 100);
      const level = getAssessmentLevel(finalScore);
      setAnswers(nextAnswers);
      setScore(finalScore);
      setResultLevel(level);
      setComplete(true);
      updateState((current) => ({
        ...current,
        profile: { ...current.profile, cefr: level, assessmentCompleted: true, lastSession: 'Just now' },
        assessmentHistory: [{ id: `assessment-${Date.now()}`, date: 'Today', previousLevel: current.profile.cefr, newLevel: level, score: finalScore, focus: finalScore < 75 ? 'Listening and production' : 'Precision under pressure' }, ...current.assessmentHistory],
        lastUpdated: new Date().toISOString()
      }));
      return;
    }
    setAnswers(nextAnswers);
    setQuestionIndex((current) => current + 1);
    setSelected(null);
  }

  function restart() {
    setQuestionIndex(0);
    setSelected(null);
    setAnswers([]);
    setComplete(false);
    setScore(0);
    setResultLevel('B1');
  }

  if (complete) {
    return <AppShell><div className="page-header"><div><div className="eyebrow">Assessment complete · Evidence recorded</div><h1 className="page-title">A useful starting point.</h1><p className="page-subtitle">This is a directional baseline, not a permanent label. Falow will compare it with performance in production and over time.</p></div></div><section className="card assessment-card"><div className="assessment-result"><SparkIcon size={27} /><div className="result-level">{resultLevel}</div><div className="result-score">{score}% on the short diagnostic · previous profile {state.profile.cefr}</div><p className="card-meta" style={{ maxWidth: 530, margin: '22px auto' }}>{score >= 75 ? 'You showed a solid command of the tested structures. The next step is range, nuance and spontaneous communication.' : 'The result points to a B1/B1+ foundation. We will strengthen the weak signals before pushing complexity.'}</p><div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}><Link className="primary-button" href="/">Return to overview <ArrowRightIcon size={14} /></Link><button className="secondary-button" onClick={restart}><RefreshIcon size={14} /> Take again</button></div></div></section></AppShell>;
  }

  return <AppShell><div className="page-header"><div><div className="eyebrow">Baseline assessment · {assessmentQuestions.length} questions</div><h1 className="page-title">Let the evidence lead.</h1><p className="page-subtitle">No help, no timer. Choose the answer you would actually use. This first pass is deliberately short; future assessments will include production tasks.</p></div></div><section className="card assessment-card"><div className="assessment-progress"><span>Question {questionIndex + 1} of {assessmentQuestions.length}</span><span>{correctSoFar} correct so far</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${(questionIndex / assessmentQuestions.length) * 100}%` }} /></div><div className="exercise-meta" style={{ marginTop: 26, marginBottom: 0 }}><span className="pill blue">{question.level}</span><span className="pill">{question.skill}</span></div><h2 className="assessment-question">{question.prompt}</h2><div className="options">{question.options.map((option, index) => <button key={option} className={`option${selected === index ? ' selected' : ''}`} onClick={() => setSelected(index)}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{selected === index ? <CheckIcon size={15} /> : null}</button>)}</div><div className="exercise-footer"><span className="exercise-footer-note">The explanation will be available after this baseline is complete.</span><button className="primary-button" onClick={next} disabled={selected === null} style={{ opacity: selected === null ? .5 : 1 }}>{questionIndex === assessmentQuestions.length - 1 ? 'Finish assessment' : 'Next question'} <ArrowRightIcon size={14} /></button></div></section></AppShell>;
}

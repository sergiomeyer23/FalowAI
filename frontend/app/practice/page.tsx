'use client';

import Link from 'next/link';
import { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, RefreshIcon, TargetIcon } from '@/components/icons';
import { useLearningState } from '@/hooks/use-learning-state';
import { exercises } from '@/lib/learning-data';
import { applyExerciseResult, evaluateExercise } from '@/lib/learning-engine';
import type { Exercise, ExerciseResult } from '@/lib/types';

const letters = ['A', 'B', 'C', 'D'];

export default function PracticePage() {
  const { state, updateState } = useLearningState();
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<ExerciseResult | null>(null);
  const [awardedXp, setAwardedXp] = useState<number | null>(null);
  const exercise: Exercise = exercises[exerciseIndex % exercises.length];
  const attempts = state.activityAttempts[exercise.id] ?? 0;

  function submit() {
    if (!answer.trim() || feedback) return;
    const result = evaluateExercise(exercise, answer);
    const applied = applyExerciseResult(state, exercise, result);
    setFeedback(result);
    setAwardedXp(applied.awardedXp);
    updateState(() => applied.state);
  }

  function next() {
    setExerciseIndex((current) => (current + 1) % exercises.length);
    setAnswer('');
    setFeedback(null);
    setAwardedXp(null);
  }

  const isLastInLoop = exerciseIndex % exercises.length === exercises.length - 1;

  return (
    <AppShell>
      <PageHeader eyebrow="Deliberate practice · Grammar and vocabulary" title="Practice with a purpose." subtitle="Each answer is evidence. Falow uses it to decide what should return, what can get harder, and what is not stable yet." action="Progress" actionHref="/progress" />

      <div className="practice-layout">
        <section className="card exercise-card">
          <div className="exercise-meta"><span className="pill blue"><TargetIcon size={12} /> {exercise.level}</span><span className="pill">{exercise.topic}</span><span className="pill">{exercise.baseXp} XP first attempt</span><span className="pill">Attempt {attempts + 1}</span></div>
          {exercise.context ? <p className="exercise-context">{exercise.context}</p> : null}
          <h2 className="exercise-prompt">{exercise.prompt}</h2>
          {exercise.type === 'choice' ? <div className="options">
            {exercise.options?.map((option, index) => {
              const selected = answer === option;
              const correct = feedback && option === exercise.answer;
              const wrong = feedback && selected && !feedback.correct;
              return <button key={option} className={`option${selected ? ' selected' : ''}${correct ? ' correct' : ''}${wrong ? ' incorrect' : ''}`} onClick={() => !feedback && setAnswer(option)} disabled={Boolean(feedback)}><span className="option-letter">{letters[index]}</span><span>{option}</span>{correct ? <CheckIcon size={15} /> : null}</button>;
            })}
          </div> : <input className="answer-input" value={answer} onChange={(event) => setAnswer(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') submit(); }} placeholder="Type the missing form…" disabled={Boolean(feedback)} autoComplete="off" />}

          {feedback ? <div className={`feedback ${feedback.correct ? 'correct' : 'incorrect'}`}>
            <div className="feedback-title">{feedback.correct ? <><CheckIcon size={16} /> Correct. Keep the distinction available.</> : <><RefreshIcon size={16} /> Not stable yet. This one returns to memory.</>}</div>
            {!feedback.correct ? <p className="feedback-copy">Your answer: <strong>{feedback.answer || 'No answer'}</strong><br />Expected: <strong>{feedback.correctAnswer}</strong></p> : null}
            <p className="feedback-copy">{feedback.explanation}</p>
            {feedback.naturalAlternative ? <p className="feedback-next"><strong>Natural version:</strong> {feedback.naturalAlternative}</p> : null}
            <p className="feedback-next"><strong>{awardedXp} XP</strong> recorded for this attempt. Repeating immediately will earn less unless your performance improves.</p>
          </div> : null}

          <div className="exercise-footer">
            <div className="exercise-footer-note">{feedback ? 'Your result is saved in this browser for the next recommendation.' : 'Answer from memory first. The explanation comes after your attempt.'}</div>
            {!feedback ? <button className="primary-button" onClick={submit} disabled={!answer.trim()} style={{ opacity: answer.trim() ? 1 : .5 }}>Check answer <ArrowRightIcon size={14} /></button> : <button className="primary-button" onClick={next}>{isLastInLoop ? 'Start another round' : 'Next challenge'} <ArrowRightIcon size={14} /></button>}
          </div>
        </section>

        <aside className="side-stack">
          <section className="card card-pad">
            <div className="section-heading"><div><h2>Session signal</h2><p>What this activity is training</p></div></div>
            <div className="info-list">
              <div className="info-row"><span>Skill</span><b>{state.skills[exercise.skill].label}</b></div>
              <div className="info-row"><span>Objective</span><b style={{ maxWidth: 155, textAlign: 'right' }}>{exercise.objective}</b></div>
              <div className="info-row"><span>Memory status</span><b style={{ color: attempts > 1 ? 'var(--amber)' : 'var(--mint)' }}>{attempts > 1 ? 'Returning review' : 'New evidence'}</b></div>
            </div>
          </section>
          <section className="card card-pad">
            <div className="section-heading"><div><h2>Not a random quiz</h2><p>Falow separates exposure, practice, retention and mastery.</p></div></div>
            <p className="card-meta">A correct answer moves the signal slightly. Your recurring errors and transfer to speaking or writing matter more than one isolated score.</p>
            <Link className="secondary-button" href="/progress" style={{ marginTop: 18, width: '100%' }}>See your error memory <ArrowRightIcon size={14} /></Link>
          </section>
          <Link href="/" className="text-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><ArrowLeftIcon size={13} /> Back to overview</Link>
        </aside>
      </div>
    </AppShell>
  );
}

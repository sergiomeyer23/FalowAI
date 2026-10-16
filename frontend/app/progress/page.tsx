'use client';

import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { ArrowRightIcon, ChartIcon, CheckIcon, ClockIcon, FlameIcon, TargetIcon } from '@/components/icons';
import { useLearningState } from '@/hooks/use-learning-state';
import { recommendationFor, XP_PER_LEVEL, xpIntoLevel, xpToNextLevel } from '@/lib/learning-engine';
import type { LearningState, SkillKey } from '@/lib/types';

const skillOrder: SkillKey[] = ['grammar', 'vocabulary', 'reading', 'listening', 'writing', 'speaking', 'professional'];

type DayPoint = { key: string; label: string; xp: number };

const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** The last seven days, oldest first, taken from the daily XP history. */
function weeklyXpHistory(dailyXp: Record<string, number>): DayPoint[] {
  const points: DayPoint[] = [];
  const today = new Date();
  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(today.getTime() - offset * 86400000);
    points.push({
      key: date.toISOString().slice(0, 10),
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      xp: dailyXp[date.toISOString().slice(0, 10)] ?? 0
    });
  }
  return points;
}

function exportProgressCsv(state: LearningState): void {
  const rows: string[][] = [
    ['Falow profile', state.profile.name],
    ['Total XP', String(state.profile.xp)],
    ['Falow level', String(state.profile.falowLevel)],
    ['CEFR level', state.profile.cefr],
    ['Study minutes this week', String(state.profile.studyMinutesThisWeek)]
  ];
  rows.push([]);
  rows.push(['Skill', 'Level', 'Score', 'Color']);
  Object.entries(state.skills).forEach(([key, skill]) => rows.push([key, skill.level, String(skill.score), skill.color]));
  rows.push([]);
  rows.push(['Pattern', 'Category', 'Occurrences', 'Corrected', 'Status']);
  state.errors.forEach((error) => rows.push([
    error.title,
    error.category,
    String(error.occurrences),
    String(error.corrected),
    error.status
  ]));
  rows.push([]);
  rows.push(['Recent sessions']);
  state.recentSessions.forEach((session) => rows.push([
    session.title,
    session.kind,
    String(session.score),
    String(session.xp),
    session.date
  ]));

  const csv = rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\n');
  const blob = new Blob([`${csv}\n`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'falow-progress.csv';
  link.click();
  URL.revokeObjectURL(url);
}

export default function ProgressPage() {
  const { state } = useLearningState();
  const levelProgress = Math.round((xpIntoLevel(state.profile.xp) / XP_PER_LEVEL) * 100);
  const recommendation = recommendationFor(state);
  const weeklyHistory = weeklyXpHistory(state.dailyXp);
  return <AppShell>
    <PageHeader eyebrow="Evidence over XP" title="Your progress, in context." subtitle="XP reflects effort. CEFR and skill levels move only when there is enough evidence from performance." action="Run assessment" actionHref="/assessment" />
      <section className="card card-pad recommendation">
        <div className="eyebrow">{recommendation.eyebrow}</div>
        <h2 className="recommendation-title">{recommendation.title}</h2>
        <p className="recommendation-body">{recommendation.body}</p>
        <Link className="primary-button" href={recommendation.href}>{recommendation.action}<ArrowRightIcon size={14} /></Link>
      </section>
    <div className="page-grid">
      <section className="card progress-header-card"><div><div className="eyebrow">Falow Level {state.profile.falowLevel}</div><div className="progress-stat"><span className="progress-big">{state.profile.xp.toLocaleString('en-US')}</span><span className="progress-stat-copy">total XP<br />{xpToNextLevel(state.profile.xp)} XP to next level</span></div><div className="progress-track" style={{ marginTop: 18, maxWidth: 480 }}><div className="progress-fill" style={{ width: `${levelProgress}%` }} /></div><div style={{ display: 'flex', gap: 15, marginTop: 15, flexWrap: 'wrap' }}><span className="card-meta"><FlameIcon size={13} /> {state.profile.streak} day streak</span><span className="card-meta"><ClockIcon size={13} /> {state.profile.studyMinutesThisWeek} min this week</span></div></div><div className="ring-wrap"><div className="ring"><div className="ring-copy"><b>{state.profile.cefr}</b><span>overall</span></div></div></div></section>
      <section className="card card-pad">
        <div className="section-heading">
          <div>
            <h2>Weekly activity</h2>
            <p>XP awarded per day over the last seven days.</p>
          </div>
          <button type="button" className="secondary-button" onClick={() => exportProgressCsv(state)}>Export CSV</button>
        </div>
        <div className="weekly-chart" role="img" aria-label="XP awarded per day over the last seven days">
          {weeklyHistory.map((point) => (
            <div className="weekly-chart-column" key={point.key}>
              <span className="weekly-chart-value">{point.xp > 0 ? point.xp.toLocaleString('en-US') : '–'}</span>
              <div className="weekly-chart-bar" style={{ height: `${Math.max(point.xp, 2)}px` }} />
              <span className="weekly-chart-label">{point.label}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="card card-pad"><div className="section-heading"><div><h2>Skill evidence</h2><p>Current mastery estimates by area.</p></div><ChartIcon size={17} /></div><div className="skill-list">{skillOrder.map((key) => { const skill = state.skills[key]; return <div className="skill-progress-row" key={key}><span className="skill-progress-label">{skill.label}</span><div className="progress-track"><div className="progress-fill" style={{ width: `${skill.score}%`, background: skill.color, boxShadow: 'none' }} /></div><span className="skill-progress-value">{skill.level}</span></div>; })}</div></section>
      <section className="card card-pad"><div className="section-heading"><div><h2>Error memory</h2><p>Falow keeps patterns alive until they are stable in more than one context.</p></div><TargetIcon size={17} /></div><div className="table-wrap"><table className="error-table"><thead><tr><th>Pattern</th><th>Evidence</th><th>Success</th><th>Status</th></tr></thead><tbody>{state.errors.map((error) => { const success = Math.round((error.corrected / Math.max(error.occurrences, 1)) * 100); return <tr key={error.id}><td><b>{error.title}</b><div className="dim" style={{ marginTop: 4 }}>{error.category}</div></td><td className="dim">{error.occurrences} occurrences<br />{error.corrected} corrected</td><td>{success}%</td><td><span className={`pill ${error.status === 'Mastered' ? 'mint' : error.status === 'Improving' ? 'blue' : ''}`}>{error.status}</span></td></tr>; })}</tbody></table></div></section>
      <div className="bottom-grid" style={{ marginTop: 0 }}><section className="card card-pad"><div className="section-heading"><div><h2>Recent sessions</h2><p>What contributed to the current picture.</p></div><Link href="/practice" className="text-link">Practice <ArrowRightIcon size={13} /></Link></div><div className="info-list">{state.recentSessions.map((session) => <div className="info-row" key={session.id}><div style={{ minWidth: 0 }}><b style={{ display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{session.title}</b><span>{session.date} · {session.kind}</span></div><span style={{ color: session.score >= 80 ? 'var(--mint)' : 'var(--amber)' }}>{session.score}% · +{session.xp} XP</span></div>)}</div></section><section className="card card-pad"><div className="section-heading"><div><h2>CEFR journey</h2><p>Assessments, not grinding, move this estimate.</p></div></div>{state.assessmentHistory.length ? state.assessmentHistory.slice(0, 3).map((item) => <div className="info-row" key={item.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--line-soft)' }}><span>{item.date} · {item.focus}</span><b>{item.previousLevel} <ArrowRightIcon size={12} /> {item.newLevel}</b></div>) : <div className="empty-note">Your first assessment is still waiting. Complete it to give the baseline a fresh evidence point.</div>}<Link className="secondary-button" href="/assessment" style={{ marginTop: 16, width: '100%' }}>Update assessment <ArrowRightIcon size={14} /></Link></section></div>
    </div>
  </AppShell>;
}

'use client';

import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { FalowMark } from '@/components/falow-logo';
import { ArrowRightIcon, BookIcon, ChartIcon, CheckIcon, ClockIcon, FlameIcon, MicIcon, SparkIcon, TargetIcon } from '@/components/icons';
import { useLearningState } from '@/hooks/use-learning-state';
import { recommendationFor, xpIntoLevel, xpToNextLevel } from '@/lib/learning-engine';
import type { Activity, ActivityKind, SkillKey } from '@/lib/types';

const activityIcons: Record<ActivityKind, { icon: typeof BookIcon; className: string }> = {
  grammar: { icon: BookIcon, className: '' },
  vocabulary: { icon: SparkIcon, className: 'violet' },
  reading: { icon: BookIcon, className: 'mint' },
  listening: { icon: ChartIcon, className: 'amber' },
  writing: { icon: BookIcon, className: 'violet' },
  speaking: { icon: MicIcon, className: 'cyan' },
  professional: { icon: TargetIcon, className: 'cyan' }
};

const skillOrder: SkillKey[] = ['grammar', 'vocabulary', 'reading', 'listening', 'writing', 'speaking', 'professional'];

function activityHref(activity: Activity) {
  if (activity.kind === 'speaking' || activity.kind === 'professional') return '/speaking';
  if (activity.kind === 'writing') return '/writing';
  return `/practice?skill=${activity.kind}`;
}

export default function DashboardPage() {
  const { state } = useLearningState();
  const recommendation = recommendationFor(state);
  const levelProgress = Math.round((xpIntoLevel(state.profile.xp) / 300) * 100);
  const initials = state.profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  return (
    <AppShell>
      <div className="page-header">
        <div>
          <div className="eyebrow">Saturday, September 19 · Personal classroom</div>
          <h1 className="page-title">Good morning, {state.profile.name.split(' ')[0]}.</h1>
          <p className="page-subtitle">A focused session today will compound into the fluency you want to live in.</p>
        </div>
        <div className="header-actions">
          <Link className="secondary-button" href="/assessment">Check my level <ArrowRightIcon size={14} /></Link>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="card hero-card">
          <div className="hero-content">
            <div className="hero-top">
              <div>
                <div className="hero-greeting">Your current learning profile</div>
                <h2 className="hero-title">From learning English <strong>to living in English.</strong></h2>
              </div>
              <div className="level-mark"><SparkIcon size={13} /> <span>Falow Level</span> <b>{state.profile.falowLevel}</b></div>
            </div>
            <div className="hero-bottom">
              <div>
                <div className="cefr-display"><span className="cefr-value">{state.profile.cefr}</span><span className="cefr-label">overall CEFR<br />evidence-based estimate</span></div>
                <div style={{ display: 'flex', gap: 18, marginTop: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FlameIcon size={14} /><span style={{ fontSize: 11, color: 'var(--muted)' }}><b style={{ color: 'white' }}>{state.profile.streak}</b> day streak</span></div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><ClockIcon size={14} /><span style={{ fontSize: 11, color: 'var(--muted)' }}><b style={{ color: 'white' }}>{state.profile.studyMinutesThisWeek}</b> min this week</span></div>
                </div>
              </div>
              <div className="xp-block">
                <div className="xp-line"><span>{state.profile.xp.toLocaleString('en-US')} XP</span><b>{xpToNextLevel(state.profile.xp)} XP to Level {state.profile.falowLevel + 1}</b></div>
                <div className="progress-track"><div className="progress-fill" style={{ width: `${levelProgress}%` }} /></div>
                <div style={{ color: 'var(--muted-2)', fontSize: 10, marginTop: 7 }}>{levelProgress}% through your current level</div>
              </div>
            </div>
          </div>
        </section>

        <section className="card mission-card">
          <div className="section-heading">
            <div><h2>Today&apos;s mission</h2><p>Small, deliberate practice beats grinding.</p></div>
            <Link className="text-link" href="/practice">Open plan</Link>
          </div>
          <div className="mission-list">
            {state.activities.slice(0, 4).map((activity) => {
              const ActivityIcon = activityIcons[activity.kind].icon;
              const iconClass = activityIcons[activity.kind].className;
              const done = state.completedActivityIds.includes(activity.id);
              return (
                <Link href={activityHref(activity)} className="mission-item" key={activity.id}>
                  <div className={`mission-icon ${iconClass}`}><ActivityIcon size={15} /></div>
                  <div className="mission-copy"><div className="mission-title">{activity.title}</div><div className="mission-subtitle">{activity.subtitle}</div></div>
                  <div className="mission-time">{activity.duration} min</div>
                  <div className={`mission-status ${done ? 'complete' : activity.status === 'next' ? 'next' : ''}`} />
                </Link>
              );
            })}
          </div>
        </section>

        <section className="card skills-card full-width">
          <div className="section-heading">
            <div><h2>Skill mastery</h2><p>Different skills can be at different stages. That is useful signal, not a problem.</p></div>
            <Link className="text-link" href="/progress">View evidence <ArrowRightIcon size={13} /></Link>
          </div>
          <div className="skills-grid">
            {skillOrder.map((key) => {
              const skill = state.skills[key];
              return <div className="skill-tile" key={key}>
                <div className="skill-top"><span className="skill-name">{skill.shortLabel}</span><span className="skill-score">{skill.score}%</span></div>
                <div><div className="skill-level">{skill.level}</div><div className="skill-bar"><span style={{ width: `${skill.score}%`, background: skill.color }} /></div></div>
              </div>;
            })}
          </div>
        </section>
      </div>

      <div className="bottom-grid">
        <section className="card card-pad">
          <div className="section-heading"><div><h2>Recurring mistakes</h2><p>Patterns Falow will bring back into future practice.</p></div><Link className="text-link" href="/progress">Review all</Link></div>
          <div className="error-list">
            {state.errors.slice(0, 3).map((error) => {
              const success = Math.round((error.corrected / Math.max(error.occurrences, 1)) * 100);
              return <div className="error-item" key={error.id}><span className={`error-dot ${error.severity}`} /><div><div className="error-name">{error.title}</div><div className="error-stat">{error.occurrences} occurrences · last seen {error.lastSeen}</div></div><div className="error-rate">{success}%</div></div>;
            })}
          </div>
        </section>
        <section className="card card-pad recommendation">
          <div className="eyebrow">{recommendation.eyebrow}</div>
          <h2 className="recommendation-title">{recommendation.title}</h2>
          <div className="recommendation-body">{recommendation.body}</div>
          <Link className="primary-button" href={recommendation.href}>{recommendation.action}<ArrowRightIcon size={14} /></Link>
        </section>
      </div>

      {!state.profile.assessmentCompleted ? <div className="notice" style={{ marginTop: 18 }}><SparkIcon size={15} /><span>Your profile is currently a working baseline. Complete the short assessment when you want Falow to replace the starting estimate with fresh evidence.</span><Link href="/assessment" className="text-link" style={{ marginLeft: 'auto', whiteSpace: 'nowrap' }}>Start assessment</Link></div> : null}
    </AppShell>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { AlertIcon, CheckIcon, RefreshIcon } from '@/components/icons';
import { useLearningState } from '@/hooks/use-learning-state';

export default function SettingsPage() {
  const { state, setState, resetState } = useLearningState();
  const [name, setName] = useState(state.profile.name);
  const [saved, setSaved] = useState(false);
  useEffect(() => setName(state.profile.name), [state.profile.name]);
  function save() {
    setState((current) => ({ ...current, profile: { ...current.profile, name: name.trim() || current.profile.name }, lastUpdated: new Date().toISOString() }));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  }
  return <AppShell><PageHeader eyebrow="Personal installation" title="Settings." subtitle="This is a private learning environment. There are no plans, teams, public profiles or social features here." /><div className="page-grid" style={{ maxWidth: 780 }}><section className="card card-pad"><div className="section-heading"><div><h2>Student profile</h2><p>The name Falow uses in your classroom.</p></div></div><label className="card-meta" htmlFor="student-name" style={{ display: 'block', marginBottom: 8 }}>Name</label><input id="student-name" className="answer-input" value={name} onChange={(event) => setName(event.target.value)} /><div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}><button className="primary-button" onClick={save}><CheckIcon size={14} /> Save profile</button>{saved ? <span style={{ color: 'var(--mint)', fontSize: 11 }}>Saved locally.</span> : null}</div></section><section className="card card-pad"><div className="section-heading"><div><h2>Privacy by default</h2><p>Development mode stores learning state in this browser only.</p></div></div><div className="notice" style={{ marginTop: 0 }}><AlertIcon size={15} /><span>Speaking transcripts are kept in the current session state. The browser-first microphone flow does not upload or permanently store audio.</span></div></section><section className="card card-pad"><div className="section-heading"><div><h2>Reset local progress</h2><p>Useful while developing the curriculum. This cannot be undone.</p></div></div><button className="secondary-button" onClick={() => { if (window.confirm('Reset the local Falow learning state?')) resetState(); }}><RefreshIcon size={14} /> Reset this browser</button></section></div></AppShell>;
}

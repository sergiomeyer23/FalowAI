'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { FalowMark } from '@/components/falow-logo';
import { ArrowLeftIcon, ArrowRightIcon, LockIcon } from '@/components/login-icons';
import { login } from '@/lib/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const session = await login(username, password);
      window.sessionStorage.setItem('falow_token', session.token);
      setLoggedIn(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 20 }}><section className="card" style={{ width: 'min(100%, 430px)', padding: 30 }}><div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 36 }}><FalowMark /><div><div className="logo-word">falow</div><div className="logo-caption">private classroom</div></div></div>{loggedIn ? <div><div className="eyebrow" style={{ color: 'var(--mint)' }}>Authenticated</div><h1 className="page-title" style={{ fontSize: 29, marginTop: 9 }}>Welcome back.</h1><p className="page-subtitle">Your backend session is stored for this browser session. The local dashboard remains available while the API-backed persistence is being connected.</p><Link className="primary-button" href="/" style={{ marginTop: 25 }}>Open Falow <ArrowRightIcon size={14} /></Link></div> : <><div className="eyebrow">Personal access</div><h1 className="page-title" style={{ fontSize: 29, marginTop: 9 }}>Enter your classroom.</h1><p className="page-subtitle">This login is for the single student installation. No public accounts or customer administration.</p><form onSubmit={submit} style={{ display: 'grid', gap: 14, marginTop: 25 }}><label className="card-meta">Username<input className="answer-input" style={{ marginTop: 7 }} value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required /></label><label className="card-meta">Password<input className="answer-input" style={{ marginTop: 7 }} type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>{error ? <div className="notice" style={{ borderColor: 'rgba(238,109,121,.35)', background: 'rgba(238,109,121,.07)', color: '#ffc4ca' }}><LockIcon size={14} /><span>{error}</span></div> : null}<button className="primary-button" type="submit" disabled={loading}>{loading ? 'Checking…' : 'Sign in'} <ArrowRightIcon size={14} /></button></form><Link href="/" className="text-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 22 }}><ArrowLeftIcon size={13} /> Continue in local mode</Link></>}</section></main>;
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FalowMark } from './falow-logo';
import { ChartIcon, HomeIcon, LibraryIcon, MicIcon, SettingsIcon, TargetIcon } from './icons';
import { useLearningState } from '@/hooks/use-learning-state';

const navItems = [
  { href: '/', label: 'Overview', icon: HomeIcon },
  { href: '/practice', label: 'Practice', icon: TargetIcon },
  { href: '/speaking', label: 'Speaking', icon: MicIcon },
  { href: '/progress', label: 'Progress', icon: ChartIcon },
  { href: '/library', label: 'Learning library', icon: LibraryIcon }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { state } = useLearningState();
  const initials = state.profile.name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="shell">
      <aside className="sidebar">
        <Link href="/" className="logo-row" aria-label="Falow overview">
          <FalowMark compact />
          <span className="logo-copy">
            <span className="logo-word">falow</span>
            <span className="logo-caption">personal teacher</span>
          </span>
        </Link>

        <div className="nav-label">Your classroom</div>
        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
            return (
              <Link key={item.href} href={item.href} className={`nav-item${active ? ' active' : ''}`}>
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="nav-label">Personal</div>
        <nav className="nav-list">
          <Link href="/settings" className={`nav-item${pathname.startsWith('/settings') ? ' active' : ''}`}>
            <SettingsIcon size={17} />
            <span>Settings</span>
          </Link>
          <Link href="/login" className={`nav-item${pathname.startsWith('/login') ? ' active' : ''}`}>
            <TargetIcon size={17} />
            <span>Backend login</span>
          </Link>
        </nav>

        <div className="sidebar-bottom">
          <div className="profile-mini">
            <div className="avatar">{initials}</div>
            <div className="profile-mini-copy">
              <div className="profile-mini-name">{state.profile.name}</div>
              <div className="profile-mini-meta">{state.profile.cefr} · Level {state.profile.falowLevel}</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="main">
        <div className="mobile-topbar">
          <Link href="/" className="logo-row"><FalowMark compact /><span className="logo-word">falow</span></Link>
          <Link href="/settings" className="mobile-nav-link">Settings</Link>
        </div>
        <div className="main-inner">{children}</div>
      </main>
    </div>
  );
}

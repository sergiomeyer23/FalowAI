'use client';

import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { ArrowRightIcon, BookIcon, ChartIcon, MicIcon, SparkIcon, TargetIcon, VolumeIcon } from '@/components/icons';
import { useLearningState } from '@/hooks/use-learning-state';
import type { SkillKey } from '@/lib/types';

const modules: Array<{ key: SkillKey; title: string; description: string; level: string; icon: typeof BookIcon; color: string; href: string }> = [
  { key: 'grammar', title: 'Grammar', description: 'Move from correctness toward nuance, register and natural choice.', level: 'B2 focus', icon: BookIcon, color: 'rgba(79,140,255,.13)', href: '/practice' },
  { key: 'vocabulary', title: 'Vocabulary', description: 'Build range through collocations, word families and context.', level: 'B1+ focus', icon: SparkIcon, color: 'rgba(124,92,252,.14)', href: '/practice' },
  { key: 'reading', title: 'Reading', description: 'Train inference, tone, argument structure and implicit meaning.', level: 'B2+ focus', icon: BookIcon, color: 'rgba(53,201,139,.13)', href: '/practice?skill=reading' },
  { key: 'listening', title: 'Listening', description: 'Work with natural pace, detail, implication and real registers.', level: 'B1+ focus', icon: VolumeIcon, color: 'rgba(242,184,75,.13)', href: '/practice?skill=listening' },
  { key: 'writing', title: 'Writing', description: 'Turn clear sentences into coherent, precise professional texts.', level: 'B2 focus', icon: ChartIcon, color: 'rgba(232,121,168,.13)', href: '/writing' },
  { key: 'speaking', title: 'Speaking', description: 'Explain, respond, reformulate and sound natural under pressure.', level: 'B1+ focus', icon: MicIcon, color: 'rgba(89,195,240,.13)', href: '/speaking' },
  { key: 'professional', title: 'Professional English', description: 'Discuss code, data, incidents, meetings and decisions spontaneously.', level: 'B2 focus', icon: TargetIcon, color: 'rgba(184,162,255,.13)', href: '/speaking' }
];

export default function LibraryPage() {
  const { state } = useLearningState();
  return <AppShell><PageHeader eyebrow="One teacher · Multiple modes" title="Your learning library." subtitle="Every module is a different way for Falow to help you reach the same goal: precise, flexible English in real situations." /><div className="library-grid">{modules.map((module) => { const Icon = module.icon; const skill = state.skills[module.key]; return <Link className="card library-card" href={module.href} key={module.key}><div className="library-icon" style={{ background: module.color }}><Icon size={18} /></div><div className="library-title">{module.title}</div><div className="library-desc">{module.description}</div><div className="library-footer"><span className="library-level">{module.level} · current {skill.level}</span><ArrowRightIcon size={15} /></div></Link>; })}</div><div className="notice" style={{ marginTop: 18 }}><SparkIcon size={15} /><span>Falow keeps one continuous memory across these modes. A grammar pattern found in speaking can return in writing; a professional topic can become listening practice.</span></div></AppShell>;
}

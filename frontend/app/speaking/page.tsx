'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { AlertIcon, ArrowRightIcon, CheckIcon, MicIcon, VolumeIcon } from '@/components/icons';
import { useLearningState } from '@/hooks/use-learning-state';
import { analyzeSpeakingTranscript, levelForXp } from '@/lib/learning-engine';
import type { SpeakingFeedback } from '@/lib/types';

type SpeechRecognitionResultItem = { isFinal: boolean; 0: { transcript: string } };
type SpeechRecognitionEventLike = { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> };
type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
type SpeechWindow = Window & { SpeechRecognition?: SpeechRecognitionConstructor; webkitSpeechRecognition?: SpeechRecognitionConstructor };

const prompt = 'Explain how you would investigate a database query that is returning incorrect results.';

export default function SpeakingPage() {
  const { updateState } = useLearningState();
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const finalTextRef = useRef('');
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState<SpeakingFeedback | null>(null);
  const [notice, setNotice] = useState('');

  useEffect(() => () => recognitionRef.current?.stop(), []);

  function startListening() {
    const SpeechRecognition = (window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setNotice('Speech recognition is not available in this browser. Try Chrome or Edge, or type a transcript in a future connected STT session.');
      return;
    }
    setNotice('');
    setFeedback(null);
    setTranscript('');
    finalTextRef.current = '';
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      let interim = '';
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const item = event.results[index];
        if (item.isFinal) finalTextRef.current += `${item[0].transcript} `;
        else interim += item[0].transcript;
      }
      setTranscript(`${finalTextRef.current}${interim}`.trim());
    };
    recognition.onerror = (event) => {
      setNotice(`The browser could not capture that response (${event.error}). You can try again.`);
      setIsListening(false);
    };
    recognition.onend = () => {
      setIsListening(false);
      const finalText = finalTextRef.current.trim();
      if (finalText) {
        setTranscript(finalText);
        const result = analyzeSpeakingTranscript(finalText);
        setFeedback(result);
        updateState((state) => ({
          ...state,
          profile: { ...state.profile, lastSession: 'Just now', studyMinutesThisWeek: state.profile.studyMinutesThisWeek + 2 },
          recentSessions: [{ id: `speaking-${Date.now()}`, title: 'Database problem explanation', kind: 'speaking' as const, score: result.score, xp: 30, date: 'Just now' }, ...state.recentSessions].slice(0, 6),
          lastUpdated: new Date().toISOString()
        }));
      }
    };
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  }

  function stopListening() {
    recognitionRef.current?.stop();
  }

  function speakFeedback() {
    if (!feedback || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(feedback.response));
  }

  return (
    <AppShell>
      <PageHeader eyebrow="Speaking lab · Professional English" title="Make the idea clear out loud." subtitle="Falow waits until you finish. Then it looks at the transcript, gives language feedback, and asks you to carry the idea one step further." action="See progress" actionHref="/progress" />
      <div className="page-grid">
        <section className="card speaking-card">
          <FalowSpeakingBadge />
          <div className="prompt-label">Your prompt</div>
          <h2 className="speaking-prompt">“{prompt}”</h2>
          <button className={`mic-button${isListening ? ' listening' : ''}`} onClick={isListening ? stopListening : startListening} aria-label={isListening ? 'Stop recording' : 'Start recording'}><MicIcon size={30} /></button>
          <div className="mic-state">{isListening ? 'Listening — finish your thought, then tap to stop.' : 'Tap to speak · browser speech recognition · audio is not stored'}</div>
          {notice ? <div className="notice" style={{ width: 'min(100%, 680px)', marginTop: 18, textAlign: 'left' }}><AlertIcon size={15} /><span>{notice}</span></div> : null}
          <div className="transcript-box"><div className="eyebrow" style={{ color: 'var(--muted-2)', marginBottom: 8 }}>Transcript</div>{transcript ? transcript : <span className="transcript-empty">Your words will appear here after you speak.</span>}</div>
          {feedback ? <div className="speaking-feedback">
            <div className="card card-pad" style={{ background: 'rgba(53,201,139,.05)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 15 }}><div><div className="eyebrow" style={{ color: 'var(--mint)' }}>Falow&apos;s first read</div><p className="card-meta" style={{ color: '#dbe8e4', marginTop: 9 }}>{feedback.response}</p></div><button className="icon-button" onClick={speakFeedback} aria-label="Listen to Falow feedback"><VolumeIcon size={16} /></button></div>
              <div className="feedback-columns">
                <div><div className="card-title">Language corrections <span style={{ color: 'var(--muted)', fontWeight: 400 }}>· {feedback.summary}</span></div><div style={{ display: 'grid', gap: 8, marginTop: 11 }}>{feedback.corrections.length ? feedback.corrections.map((correction) => <div className="correction-row" key={`${correction.original}-${correction.corrected}`}><div className="correction-original">{correction.original}</div><div className="correction-fixed">{correction.corrected}</div><div className="correction-why">{correction.explanation}</div></div>) : <div className="empty-note">No high-signal recurring error was detected in this short sample. That is not the same as a full pronunciation evaluation.</div>}</div></div>
                <div><div className="card-title">Evidence</div><div style={{ marginTop: 12, display: 'flex', alignItems: 'baseline', gap: 8 }}><span style={{ fontSize: 33, fontWeight: 760, letterSpacing: '-.06em' }}>{feedback.score}</span><span className="card-meta">/ 100 language signal</span></div><div style={{ display: 'grid', gap: 9, marginTop: 14 }}>{feedback.strengths.map((strength) => <div key={strength} style={{ display: 'flex', gap: 7, color: '#c8d9d3', fontSize: 11, lineHeight: 1.45 }}><CheckIcon size={14} />{strength}</div>)}</div><div className="notice" style={{ marginTop: 15, borderColor: 'rgba(89,195,240,.22)', background: 'rgba(89,195,240,.06)', color: '#b9d9e8' }}><ArrowRightIcon size={14} /><span>Next focus: {feedback.nextFocus}</span></div></div>
              </div>
            </div>
          </div> : null}
        </section>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center' }}><span className="card-meta">Speaking feedback is based on the transcript available in this browser. Pronunciation is intentionally not scored without reliable audio evidence.</span><Link href="/practice" className="secondary-button" style={{ whiteSpace: 'nowrap' }}>Grammar practice <ArrowRightIcon size={14} /></Link></div>
      </div>
    </AppShell>
  );
}

function FalowSpeakingBadge() {
  return <div style={{ width: 52, height: 52, borderRadius: 16, display: 'grid', placeItems: 'center', background: 'rgba(89,195,240,.11)', color: 'var(--cyan)', border: '1px solid rgba(89,195,240,.23)', position: 'relative', zIndex: 1 }}><MicIcon size={22} /></div>;
}

'use client';

import { useCallback, useEffect, useState } from 'react';
import { initialState } from '@/lib/learning-data';
import type { LearningState } from '@/lib/types';

const STORAGE_KEY = 'falow-learning-state-v1';

export function useLearningState() {
  const [state, setState] = useState<LearningState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setState(JSON.parse(saved) as LearningState);
    } catch {
      // A corrupted local state should never prevent the lesson from opening.
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [hydrated, state]);

  const updateState = useCallback((updater: (current: LearningState) => LearningState) => {
    setState((current) => updater(current));
  }, []);

  const resetState = useCallback(() => {
    setState(initialState);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  return { state, setState, updateState, resetState, hydrated };
}

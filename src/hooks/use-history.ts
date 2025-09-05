'use client';

import { useState, useEffect, useCallback } from 'react';
import { GenerationHistory } from '@/types/video';

export interface UseHistoryReturn {
  history: GenerationHistory[];
  loading: boolean;
  addToHistory: (item: GenerationHistory) => void;
  removeFromHistory: (id: string) => void;
  clearHistory: () => void;
  refreshHistory: () => void;
}

export const useHistory = (): UseHistoryReturn => {
  const [history, setHistory] = useState<GenerationHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshHistory = useCallback(() => {
    try {
      const stored = localStorage.getItem('video-generation-history');
      if (stored) {
        const parsed = JSON.parse(stored) as GenerationHistory[];
        setHistory(parsed);
      }
    } catch (error) {
      console.error('Failed to load history:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToHistory = useCallback((item: GenerationHistory) => {
    setHistory(prev => {
      const updated = [item, ...prev.filter(h => h.id !== item.id)].slice(0, 50);
      try {
        localStorage.setItem('video-generation-history', JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save history:', error);
      }
      return updated;
    });
  }, []);

  const removeFromHistory = useCallback((id: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      try {
        localStorage.setItem('video-generation-history', JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to update history:', error);
      }
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem('video-generation-history');
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  }, []);

  useEffect(() => {
    refreshHistory();
  }, [refreshHistory]);

  return {
    history,
    loading,
    addToHistory,
    removeFromHistory,
    clearHistory,
    refreshHistory
  };
};
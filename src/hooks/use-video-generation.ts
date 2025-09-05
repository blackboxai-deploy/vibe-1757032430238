'use client';

import { useState, useCallback } from 'react';
import { VideoAPIClient } from '@/lib/video-api';
import { VideoGenerationRequest, VideoGenerationResponse, GenerationHistory } from '@/types/video';

export interface UseVideoGenerationReturn {
  isGenerating: boolean;
  currentGeneration: VideoGenerationResponse | null;
  error: string | null;
  progress: number;
  generateVideo: (request: VideoGenerationRequest, systemPrompt?: string) => Promise<void>;
  clearError: () => void;
  cancelGeneration: () => void;
}

export const useVideoGeneration = (): UseVideoGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentGeneration, setCurrentGeneration] = useState<VideoGenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const apiClient = VideoAPIClient.getInstance();

  const generateVideo = useCallback(async (request: VideoGenerationRequest, systemPrompt?: string) => {
    try {
      setIsGenerating(true);
      setError(null);
      setProgress(0);
      setCurrentGeneration(null);

      // Start generation
      const response = await apiClient.generateVideo(request, systemPrompt);
      setCurrentGeneration(response);

      if (response.status === 'processing') {
        // Simulate progress for processing videos
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            const newProgress = Math.min(prev + Math.random() * 10, 95);
            if (newProgress >= 95) {
              clearInterval(progressInterval);
            }
            return newProgress;
          });
        }, 1000);

        // Check status periodically (mock for now)
        const statusInterval = setInterval(async () => {
          try {
            const statusResponse = await apiClient.checkVideoStatus(response.id);
            if (statusResponse.status === 'completed' || statusResponse.status === 'failed') {
              clearInterval(statusInterval);
              clearInterval(progressInterval);
              setCurrentGeneration(statusResponse);
              setProgress(100);
              
              // Add to history
              if (statusResponse.status === 'completed') {
                addToHistory({
                  id: statusResponse.id,
                  prompt: request.prompt,
                  videoUrl: statusResponse.videoUrl,
                  status: 'completed',
                  createdAt: statusResponse.createdAt,
                  duration: request.duration,
                  aspectRatio: request.aspectRatio
                });
              }
            }
          } catch (err) {
            clearInterval(statusInterval);
            clearInterval(progressInterval);
            setError(err instanceof Error ? err.message : 'Status check failed');
          }
        }, 5000);
      } else if (response.status === 'completed') {
        setProgress(100);
        
        // Add to history immediately
        addToHistory({
          id: response.id,
          prompt: request.prompt,
          videoUrl: response.videoUrl,
          status: 'completed',
          createdAt: response.createdAt,
          duration: request.duration,
          aspectRatio: request.aspectRatio
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Generation failed');
      setCurrentGeneration(null);
    } finally {
      setIsGenerating(false);
    }
  }, [apiClient]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const cancelGeneration = useCallback(() => {
    setIsGenerating(false);
    setCurrentGeneration(null);
    setProgress(0);
  }, []);

  const addToHistory = useCallback((item: GenerationHistory) => {
    try {
      const existing = JSON.parse(localStorage.getItem('video-generation-history') || '[]');
      const updated = [item, ...existing.slice(0, 49)]; // Keep last 50 items
      localStorage.setItem('video-generation-history', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save to history:', err);
    }
  }, []);

  return {
    isGenerating,
    currentGeneration,
    error,
    progress,
    generateVideo,
    clearError,
    cancelGeneration
  };
};
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { VideoGenerationRequest } from '@/types/video';
import { useVideoGeneration } from '@/hooks/use-video-generation';
import { GenerationProgress } from './GenerationProgress';
import { VideoPreview } from './VideoPreview';

interface VideoGeneratorProps {
  systemPrompt?: string;
}

export const VideoGenerator = ({ systemPrompt }: VideoGeneratorProps) => {
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState<number>(5);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [quality, setQuality] = useState<'standard' | 'high'>('standard');

  const {
    isGenerating,
    currentGeneration,
    error,
    progress,
    generateVideo,
    clearError,
    cancelGeneration
  } = useVideoGeneration();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    const request: VideoGenerationRequest = {
      prompt: prompt.trim(),
      duration,
      aspectRatio,
      quality
    };

    await generateVideo(request, systemPrompt);
  };

  const handleCancel = () => {
    cancelGeneration();
    setPrompt('');
  };

  return (
    <div className="space-y-6">
      {/* Generation Form */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Generate AI Video</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Prompt Input */}
          <div className="space-y-2">
            <Label htmlFor="prompt" className="text-sm font-medium">
              Describe your video
            </Label>
            <Textarea
              id="prompt"
              placeholder="A serene ocean sunset with gentle waves, cinematic lighting, peaceful atmosphere..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[120px] resize-none"
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">
              Be descriptive and specific for better results
            </p>
          </div>

          {/* Settings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Duration */}
            <div className="space-y-2">
              <Label htmlFor="duration" className="text-sm font-medium">
                Duration
              </Label>
              <Select 
                value={duration.toString()} 
                onValueChange={(value) => setDuration(parseInt(value))}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 seconds</SelectItem>
                  <SelectItem value="5">5 seconds</SelectItem>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="15">15 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <Label htmlFor="aspect-ratio" className="text-sm font-medium">
                Aspect Ratio
              </Label>
              <Select 
                value={aspectRatio} 
                onValueChange={(value: '16:9' | '9:16' | '1:1') => setAspectRatio(value)}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                  <SelectItem value="9:16">9:16 (Portrait)</SelectItem>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quality */}
            <div className="space-y-2">
              <Label htmlFor="quality" className="text-sm font-medium">
                Quality
              </Label>
              <Select 
                value={quality} 
                onValueChange={(value: 'standard' | 'high') => setQuality(value)}
                disabled={isGenerating}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="high">High Quality</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-red-800 font-medium">Generation Failed</h4>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearError}
                  className="text-red-600 border-red-300 hover:bg-red-100"
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={handleGenerate} 
              disabled={!prompt.trim() || isGenerating}
              className="flex-1"
              size="lg"
            >
              {isGenerating ? 'Generating...' : 'Generate Video'}
            </Button>
            
            {isGenerating && (
              <Button 
                onClick={handleCancel} 
                variant="outline" 
                size="lg"
              >
                Cancel
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Display */}
      {isGenerating && (
        <GenerationProgress 
          progress={progress}
          status={currentGeneration?.status || 'pending'}
          estimatedTime={currentGeneration?.estimatedTime}
        />
      )}

      {/* Video Preview */}
      {currentGeneration?.videoUrl && (
        <VideoPreview 
          videoUrl={currentGeneration.videoUrl}
          prompt={prompt}
          onDownload={() => {
            if (currentGeneration.videoUrl) {
              const link = document.createElement('a');
              link.href = currentGeneration.videoUrl;
              link.download = `ai-video-${Date.now()}.mp4`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }}
        />
      )}
    </div>
  );
};
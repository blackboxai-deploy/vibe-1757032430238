'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface GenerationProgressProps {
  progress: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  estimatedTime?: number;
}

export const GenerationProgress = ({ progress, status, estimatedTime }: GenerationProgressProps) => {
  const getStatusText = () => {
    switch (status) {
      case 'pending':
        return 'Initializing video generation...';
      case 'processing':
        return 'Generating your video...';
      case 'completed':
        return 'Video generation completed!';
      case 'failed':
        return 'Video generation failed';
      default:
        return 'Processing...';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'processing':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Generation Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress value={progress} className="w-full h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{Math.round(progress)}% complete</span>
            {estimatedTime && status === 'processing' && (
              <span>Est. {formatTime(estimatedTime)} remaining</span>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-3">
          {status === 'processing' && (
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
          )}
          {status === 'completed' && (
            <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          {status === 'failed' && (
            <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
              <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          )}
          
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        {/* Additional Info */}
        {status === 'processing' && (
          <div className="text-xs text-muted-foreground bg-blue-50 p-3 rounded-lg">
            <p>⚡ Your video is being generated using advanced AI technology.</p>
            <p>💡 This process typically takes 1-3 minutes depending on video length and complexity.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useHistory } from '@/hooks/use-history';
import { GenerationHistory } from '@/types/video';

interface HistorySidebarProps {
  onVideoSelect?: (video: GenerationHistory) => void;
}

export const HistorySidebar = ({ onVideoSelect }: HistorySidebarProps) => {
  const { history, loading, removeFromHistory, clearHistory } = useHistory();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleVideoClick = (video: GenerationHistory) => {
    setSelectedId(video.id);
    onVideoSelect?.(video);
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromHistory(id);
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) {
      return 'Just now';
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="text-lg">Generation History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">History</CardTitle>
          {history.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
              className="text-xs"
            >
              Clear All
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {history.length} video{history.length !== 1 ? 's' : ''} generated
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {history.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">
              No videos generated yet
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Your generated videos will appear here
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[calc(100vh-200px)]">
            <div className="p-3 space-y-3">
              {history.map((video) => (
                <div
                  key={video.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50 ${
                    selectedId === video.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => handleVideoClick(video)}
                >
                  <div className="space-y-2">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getStatusColor(video.status)}`}
                      >
                        {video.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleRemove(video.id, e)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Button>
                    </div>

                    {/* Prompt Preview */}
                    <p className="text-xs text-gray-900 line-clamp-3 leading-tight">
                      {video.prompt}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        {video.duration && (
                          <span>{video.duration}s</span>
                        )}
                        {video.aspectRatio && (
                          <span>{video.aspectRatio}</span>
                        )}
                      </div>
                      <span>{formatDate(video.createdAt)}</span>
                    </div>

                    {/* Video Thumbnail/Preview */}
                    {video.videoUrl && video.status === 'completed' && (
                      <div className="relative">
                        <video
                          src={video.videoUrl}
                          className="w-full h-16 object-cover rounded border bg-gray-100"
                          muted
                          preload="metadata"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-black/50 rounded-full p-1">
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};
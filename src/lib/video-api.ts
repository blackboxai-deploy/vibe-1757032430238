import { VideoGenerationRequest, VideoGenerationResponse, APIError } from '@/types/video';

const API_BASE_URL = 'https://oi-server.onrender.com/chat/completions';
const API_HEADERS = {
  'CustomerId': 'cus_S16jfiBUH2cc7P',
  'Content-Type': 'application/json',
  'Authorization': 'Bearer xxx'
};

export class VideoAPIClient {
  private static instance: VideoAPIClient;

  static getInstance(): VideoAPIClient {
    if (!VideoAPIClient.instance) {
      VideoAPIClient.instance = new VideoAPIClient();
    }
    return VideoAPIClient.instance;
  }

  async generateVideo(request: VideoGenerationRequest, systemPrompt?: string): Promise<VideoGenerationResponse> {
    try {
      const enhancedPrompt = this.enhancePrompt(request.prompt, request);
      const messages = [
        ...(systemPrompt ? [{
          role: 'system' as const,
          content: systemPrompt
        }] : []),
        {
          role: 'user' as const,
          content: enhancedPrompt
        }
      ];

      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: API_HEADERS,
        body: JSON.stringify({
          model: 'replicate/google/veo-3',
          messages
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      // Check content type to handle different response formats
      const contentType = response.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        const data = await response.json();
        return this.processJSONResponse(data);
      } else if (contentType.includes('video/') || contentType.includes('application/octet-stream')) {
        return this.processBinaryResponse(response);
      } else {
        throw new Error(`Unexpected content type: ${contentType}`);
      }
    } catch (error) {
      console.error('Video generation error:', error);
      throw this.handleError(error);
    }
  }

  private enhancePrompt(prompt: string, request: VideoGenerationRequest): string {
    let enhancedPrompt = prompt;
    
    // Add technical specifications
    if (request.aspectRatio) {
      enhancedPrompt += ` [Aspect ratio: ${request.aspectRatio}]`;
    }
    
    if (request.duration) {
      enhancedPrompt += ` [Duration: ${request.duration} seconds]`;
    }
    
    if (request.quality === 'high') {
      enhancedPrompt += ` [High quality, cinematic, 4K resolution]`;
    }
    
    return enhancedPrompt;
  }

  private async processJSONResponse(data: any): Promise<VideoGenerationResponse> {
    const id = this.generateId();
    
    // Handle different JSON response formats
    if (data.choices && data.choices[0] && data.choices[0].message) {
      const content = data.choices[0].message.content;
      
      // Check if content contains a video URL or is a status response
      if (typeof content === 'string' && content.includes('http')) {
        return {
          id,
          status: 'completed',
          videoUrl: content.trim(),
          createdAt: new Date().toISOString()
        };
      }
    }
    
    // Handle async processing response
    return {
      id,
      status: 'processing',
      progress: 0,
      estimatedTime: 120, // 2 minutes estimated
      createdAt: new Date().toISOString()
    };
  }

  private async processBinaryResponse(response: Response): Promise<VideoGenerationResponse> {
    const id = this.generateId();
    const blob = await response.blob();
    
    // Create object URL for the video blob
    const videoUrl = URL.createObjectURL(blob);
    
    return {
      id,
      status: 'completed',
      videoUrl,
      createdAt: new Date().toISOString()
    };
  }

  private handleError(error: any): APIError {
    if (error instanceof Error) {
      return {
        message: error.message,
        code: 'API_ERROR'
      };
    }
    
    return {
      message: 'Unknown error occurred',
      code: 'UNKNOWN_ERROR',
      details: error
    };
  }

  private generateId(): string {
    return `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Helper method to check video generation status (for async operations)
  async checkVideoStatus(id: string): Promise<VideoGenerationResponse> {
    // This would typically make another API call to check status
    // For now, we'll return a mock response since the API might not support status checking
    return {
      id,
      status: 'completed',
      progress: 100,
      createdAt: new Date().toISOString()
    };
  }

  // Helper method to download video
  downloadVideo(videoUrl: string, filename: string): void {
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
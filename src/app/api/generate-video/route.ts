import { NextRequest, NextResponse } from 'next/server';
import { VideoAPIClient } from '@/lib/video-api';
import { VideoGenerationRequest } from '@/types/video';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, duration, aspectRatio, quality, systemPrompt } = body as VideoGenerationRequest & { systemPrompt?: string };

    // Validate input
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required and cannot be empty' },
        { status: 400 }
      );
    }

    if (prompt.length > 2000) {
      return NextResponse.json(
        { error: 'Prompt is too long. Maximum 2000 characters allowed.' },
        { status: 400 }
      );
    }

    // Validate duration
    if (duration && (duration < 1 || duration > 60)) {
      return NextResponse.json(
        { error: 'Duration must be between 1 and 60 seconds' },
        { status: 400 }
      );
    }

    // Validate aspect ratio
    if (aspectRatio && !['16:9', '9:16', '1:1'].includes(aspectRatio)) {
      return NextResponse.json(
        { error: 'Invalid aspect ratio. Must be 16:9, 9:16, or 1:1' },
        { status: 400 }
      );
    }

    // Validate quality
    if (quality && !['standard', 'high'].includes(quality)) {
      return NextResponse.json(
        { error: 'Invalid quality setting. Must be "standard" or "high"' },
        { status: 400 }
      );
    }

    const videoRequest: VideoGenerationRequest = {
      prompt: prompt.trim(),
      duration: duration || 5,
      aspectRatio: aspectRatio || '16:9',
      quality: quality || 'standard'
    };

    const apiClient = VideoAPIClient.getInstance();
    const response = await apiClient.generateVideo(videoRequest, systemPrompt);

    return NextResponse.json(response);
  } catch (error) {
    console.error('Video generation error:', error);
    
    if (error instanceof Error) {
      // Handle specific API errors
      if (error.message.includes('failed: 429')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please wait before generating another video.' },
          { status: 429 }
        );
      }
      
      if (error.message.includes('failed: 401')) {
        return NextResponse.json(
          { error: 'Authentication failed. Please check API configuration.' },
          { status: 401 }
        );
      }
      
      if (error.message.includes('failed: 500')) {
        return NextResponse.json(
          { error: 'Video generation service is temporarily unavailable.' },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred during video generation' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Video Generation API',
      endpoints: {
        POST: '/api/generate-video - Generate a new video',
        'POST body': {
          prompt: 'string (required) - Description of the video to generate',
          duration: 'number (optional) - Duration in seconds (1-60)',
          aspectRatio: 'string (optional) - "16:9", "9:16", or "1:1"',
          quality: 'string (optional) - "standard" or "high"',
          systemPrompt: 'string (optional) - Custom system prompt for generation'
        }
      }
    },
    { status: 200 }
  );
}
export interface VideoGenerationRequest {
  prompt: string;
  duration?: number;
  aspectRatio?: '16:9' | '9:16' | '1:1';
  quality?: 'standard' | 'high';
}

export interface VideoGenerationResponse {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  error?: string;
  progress?: number;
  estimatedTime?: number;
  createdAt: string;
}

export interface GenerationHistory {
  id: string;
  prompt: string;
  videoUrl?: string;
  thumbnail?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  duration?: number;
  aspectRatio?: string;
}

export interface SystemPromptConfig {
  enabled: boolean;
  prompt: string;
}

export interface VideoGenerationSettings {
  systemPrompt: SystemPromptConfig;
  defaultDuration: number;
  defaultAspectRatio: '16:9' | '9:16' | '1:1';
  defaultQuality: 'standard' | 'high';
}

export interface APIError {
  message: string;
  code?: string;
  details?: any;
}
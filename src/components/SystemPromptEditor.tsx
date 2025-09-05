'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { SystemPromptConfig } from '@/types/video';

interface SystemPromptEditorProps {
  onPromptChange: (config: SystemPromptConfig) => void;
}

const DEFAULT_SYSTEM_PROMPT = `You are an expert video generation assistant. Create compelling, detailed video descriptions that result in high-quality AI-generated videos.

Guidelines for optimal video generation:
- Focus on visual elements: lighting, composition, movement, and atmosphere
- Include specific details about colors, textures, and visual style
- Describe camera movements and angles when relevant
- Consider the emotional tone and mood of the scene
- Be specific about time of day, weather, or environmental conditions
- Include artistic style references when appropriate (cinematic, documentary, artistic, etc.)

Always prioritize clarity and visual richness in your descriptions to ensure the best possible video output.`;

export const SystemPromptEditor = ({ onPromptChange }: SystemPromptEditorProps) => {
  const [config, setConfig] = useState<SystemPromptConfig>({
    enabled: true,
    prompt: DEFAULT_SYSTEM_PROMPT
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempPrompt, setTempPrompt] = useState(config.prompt);

  useEffect(() => {
    // Load saved configuration from localStorage
    try {
      const saved = localStorage.getItem('video-system-prompt-config');
      if (saved) {
        const savedConfig = JSON.parse(saved) as SystemPromptConfig;
        setConfig(savedConfig);
        setTempPrompt(savedConfig.prompt);
        onPromptChange(savedConfig);
      } else {
        onPromptChange(config);
      }
    } catch (error) {
      console.error('Failed to load system prompt config:', error);
      onPromptChange(config);
    }
  }, [onPromptChange]);

  const saveConfig = (newConfig: SystemPromptConfig) => {
    try {
      localStorage.setItem('video-system-prompt-config', JSON.stringify(newConfig));
      setConfig(newConfig);
      onPromptChange(newConfig);
    } catch (error) {
      console.error('Failed to save system prompt config:', error);
    }
  };

  const handleToggle = (enabled: boolean) => {
    const newConfig = { ...config, enabled };
    saveConfig(newConfig);
  };

  const handleSave = () => {
    const newConfig = { ...config, prompt: tempPrompt };
    saveConfig(newConfig);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempPrompt(config.prompt);
    setIsEditing(false);
  };

  const handleReset = () => {
    setTempPrompt(DEFAULT_SYSTEM_PROMPT);
    const newConfig = { ...config, prompt: DEFAULT_SYSTEM_PROMPT };
    saveConfig(newConfig);
    setIsEditing(false);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">System Prompt Configuration</CardTitle>
            <p className="text-sm text-muted-foreground">
              Customize the AI's behavior for video generation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={config.enabled ? "default" : "secondary"} className="text-xs">
              {config.enabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="system-prompt-toggle" className="text-sm font-medium">
              Enable System Prompt
            </Label>
            <p className="text-xs text-muted-foreground">
              Use custom instructions to guide video generation
            </p>
          </div>
          <Switch
            id="system-prompt-toggle"
            checked={config.enabled}
            onCheckedChange={handleToggle}
          />
        </div>

        {/* Prompt Editor */}
        {config.enabled && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="system-prompt" className="text-sm font-medium">
                System Prompt
              </Label>
              <div className="flex gap-2">
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="text-xs"
                  >
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReset}
                      className="text-xs"
                    >
                      Reset
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      className="text-xs"
                    >
                      Save
                    </Button>
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <Textarea
                id="system-prompt"
                value={tempPrompt}
                onChange={(e) => setTempPrompt(e.target.value)}
                className="min-h-[200px] text-sm font-mono"
                placeholder="Enter your system prompt..."
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg border">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono leading-relaxed">
                  {config.prompt}
                </pre>
              </div>
            )}

            <div className="text-xs text-muted-foreground">
              <p>💡 <strong>Tips:</strong></p>
              <ul className="mt-1 space-y-1 ml-4">
                <li>• Be specific about visual elements and style preferences</li>
                <li>• Include guidance for camera movements and composition</li>
                <li>• Specify quality expectations and artistic direction</li>
                <li>• Consider including examples of desired output characteristics</li>
              </ul>
            </div>
          </div>
        )}

        {!config.enabled && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="text-sm font-medium text-yellow-800">System Prompt Disabled</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  Video generation will use the model's default behavior without custom instructions.
                  Enable the system prompt for more control over the output style and quality.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
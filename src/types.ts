export type SocialPlatform = 'linkedin' | 'x' | 'instagram';

export interface GenerationOptions {
  generateText: boolean;
  generateImage: boolean;
  tone: 'professional' | 'casual' | 'viral' | 'edgy';
}

export interface PlatformCredentials {
  platform: SocialPlatform;
  apiKey?: string;
  accessToken?: string;
}

export interface PostResult {
  postContent: string;
  hashtags: string[];
  captionVariation: string;
  insights?: string[];
  platform: SocialPlatform;
  generatedImageUrl?: string;
}

export interface ConnectedAccount {
  platform: SocialPlatform;
  handle: string;
  isConnected: boolean;
  credentials?: PlatformCredentials;
}

export type GeneratingStatus = 'idle' | 'researching' | 'strategizing' | 'generating' | 'error' | 'success'; 

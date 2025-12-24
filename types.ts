
export type Platform = 'youtube' | 'tiktok' | 'instagram' | 'facebook' | 'unknown';

export interface MediaMetadata {
  title: string;
  author: string;
  thumbnail: string;
  platform: Platform;
  duration?: string;
  formats: MediaFormat[];
}

export interface MediaFormat {
  id: string;
  quality: string;
  type: 'video' | 'audio' | 'image';
  size?: string;
  ext: string;
}

export interface DownloadHistory {
  id: string;
  url: string;
  title: string;
  platform: Platform;
  timestamp: number;
}

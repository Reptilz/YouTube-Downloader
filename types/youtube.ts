// Types pour l'application YouTube
export interface YoutubeVideo {
  url: string;
  title?: string;
  thumbnail?: string;
  formats?: Array<{
    quality: string;
    format: string;
    url: string;
  }>;
}

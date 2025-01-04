// Types pour l'application YouTube

export interface VideoFormat {
  quality: string
  format: string
  hasAudio: boolean
  hasVideo: boolean
  contentLength?: string
  url: string
}

export interface YoutubeVideo {
  url: string
  videoId: string
  title: string
  thumbnail?: string
  duration: string
  author: string
  formats: VideoFormat[]
}

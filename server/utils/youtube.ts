import ytdl from '@distube/ytdl-core'
import { YOUTUBE_COOKIES } from '../config/youtube-cookies'

// Fonction pour extraire l'ID de la vidéo d'une URL YouTube
function extractVideoId(url: string): string | null {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[7].length === 11) ? match[7] : null
}

// Création de l'agent avec les cookies
const agent = ytdl.createAgent(YOUTUBE_COOKIES, {
  keepAlive: true,
  keepAliveMsecs: 50000,
  maxSockets: 50
})

// Fonction pour obtenir les informations d'une vidéo
export async function getVideoInfo(url: string) {
  try {
    // Utiliser getBasicInfo d'abord pour une réponse plus rapide
    const basicInfo = await ytdl.getBasicInfo(url, { agent })

    // Si les informations de base sont récupérées avec succès, obtenir les formats
    const info = await ytdl.getInfo(url, { 
      agent,
      // Utiliser les clients recommandés
      playerClients: ['WEB_CREATOR', 'IOS']
    })

    // Filtrer et formater les formats disponibles
    const formats = info.formats
      .filter(format => {
        const hasAudio = format.hasAudio
        const hasVideo = format.hasVideo
        return hasAudio && hasVideo
      })
      .map(format => ({
        quality: format.qualityLabel || 'unknown',
        format: format.container,
        hasAudio: format.hasAudio,
        hasVideo: format.hasVideo,
        contentLength: format.contentLength,
        itag: format.itag.toString(),
        mimeType: format.mimeType,
        fps: format.fps,
        url: format.url
      }))
      .sort((a, b) => {
        const getQualityNumber = (quality: string) => 
          parseInt(quality?.match(/\d+/)?.[0] || '0')
        return getQualityNumber(b.quality) - getQualityNumber(a.quality)
      })

    return {
      url,
      videoId: basicInfo.videoDetails.videoId,
      title: basicInfo.videoDetails.title,
      thumbnail: basicInfo.videoDetails.thumbnails[0]?.url || '',
      duration: basicInfo.videoDetails.lengthSeconds,
      author: basicInfo.videoDetails.author.name,
      formats
    }
  } catch (error: any) {
    console.error('Error getting video info:', error)
    throw error
  }
}

// Fonction pour obtenir l'URL de téléchargement d'un format spécifique
export async function getDownloadUrl(url: string, formatId: string) {
  try {
    const info = await ytdl.getInfo(url, { 
      agent,
      playerClients: ['WEB_CREATOR', 'IOS']
    })
    
    const format = info.formats.find(f => f.itag.toString() === formatId)
    
    if (!format) {
      throw new Error('Format not found')
    }
    
    return {
      url: format.url,
      filename: `${info.videoDetails.title}.${format.container}`.replace(/[^a-z0-9.]/gi, '_').toLowerCase(),
      mimeType: format.mimeType || 'video/mp4'
    }
  } catch (error: any) {
    console.error('Error getting download URL:', error)
    throw error
  }
}

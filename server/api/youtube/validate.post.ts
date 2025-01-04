// API endpoint pour la validation d'URL YouTube
import { video_info, yt_validate } from 'play-dl'
import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event)
    const { url } = body

    if (!url) {
      throw createError({
        statusCode: 400,
        message: 'URL is required'
      })
    }

    // Valider l'URL YouTube
    if (!yt_validate(url)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid YouTube URL'
      })
    }

    // Obtenir les informations de la vidéo
    const info = await video_info(url)
    
    // Filtrer et formater les formats disponibles
    const formats = info.format
      .filter(format => {
        return format.mimeType?.includes('video') && 
               format.audioQuality !== null // S'assurer que le format a de l'audio
      })
      .map(format => {
        const qualityLabel = format.qualityLabel || 
          (format.quality === 'hd1080' ? '1080p' : 
           format.quality === 'hd720' ? '720p' : 
           format.quality === 'medium' ? '480p' : '360p')

        return {
          quality: qualityLabel,
          format: format.mimeType?.split(';')[0].split('/')[1] || 'mp4',
          hasAudio: format.audioQuality !== null,
          hasVideo: true,
          contentLength: format.contentLength,
          itag: format.itag,
          mimeType: format.mimeType || 'video/mp4',
          fps: format.fps,
          url: format.url
        }
      })
      .sort((a, b) => {
        const getQualityNumber = (quality: string) => 
          parseInt(quality?.match(/\d+/)?.[0] || '0')
        return getQualityNumber(b.quality) - getQualityNumber(a.quality)
      })

    if (formats.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No valid formats found for this video'
      })
    }

    // Retourner les informations de la vidéo
    return {
      url,
      videoId: info.video_details.id || '',
      title: info.video_details.title || '',
      thumbnail: info.video_details.thumbnails[0]?.url || '',
      duration: info.video_details.durationInSec.toString(),
      author: info.video_details.channel?.name || '',
      formats
    }
  } catch (error: any) {
    console.error('YouTube validation error:', error)
    
    let errorMessage = 'An error occurred while processing the video'
    if (error.message.includes('private video')) {
      errorMessage = 'Cette vidéo est privée'
    } else if (error.message.includes('not found')) {
      errorMessage = 'Cette vidéo n\'existe pas'
    } else if (error.message.includes('copyright')) {
      errorMessage = 'Cette vidéo n\'est pas disponible pour des raisons de droits d\'auteur'
    }
    
    throw createError({
      statusCode: error.statusCode || 500,
      message: errorMessage
    })
  }
})

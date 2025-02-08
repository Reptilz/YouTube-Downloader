// API endpoint pour la validation d'URL YouTube
import { video_info, yt_validate } from 'play-dl'
import { H3Event } from 'h3'

export default defineEventHandler(async (event: H3Event) => {
  console.log('[API] Début de la validation de l\'URL YouTube')
  
  try {
    const body = await readBody(event)
    console.log('[API] Body reçu:', body)
    
    const { url } = body

    if (!url) {
      console.log('[API] Erreur: URL manquante')
      throw createError({
        statusCode: 400,
        statusMessage: 'URL is required',
        data: { received: body }
      })
    }

    console.log('[API] Validation de l\'URL:', url)
    // Valider l'URL YouTube
    if (!yt_validate(url)) {
      console.log('[API] Erreur: URL YouTube invalide')
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid YouTube URL',
        data: { url }
      })
    }

    console.log('[API] Récupération des informations de la vidéo')
    // Obtenir les informations de la vidéo
    const info = await video_info(url)
    console.log('[API] Informations vidéo récupérées')
    
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
      console.log('[API] Erreur: Aucun format vidéo disponible')
      throw createError({
        statusCode: 404,
        statusMessage: 'No video formats available',
        data: { url }
      })
    }

    console.log('[API] Formats disponibles:', formats.length)
    
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
    console.error('[API] Erreur lors de la validation:', error)
    
    let errorMessage = 'An error occurred while processing the video'
    if (error.message.includes('private video')) {
      errorMessage = 'Cette vidéo est privée'
    } else if (error.message.includes('not found')) {
      errorMessage = 'Cette vidéo n\'existe pas'
    } else if (error.message.includes('copyright')) {
      errorMessage = 'Cette vidéo n\'est pas disponible pour des raisons de droits d\'auteur'
    }
    
    // Si c'est déjà une erreur H3, la renvoyer
    if (error.statusCode) {
      throw error
    }
    
    // Sinon, créer une nouvelle erreur avec plus de détails
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: {
        message: error.message,
        name: error.name,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
    })
  }
})

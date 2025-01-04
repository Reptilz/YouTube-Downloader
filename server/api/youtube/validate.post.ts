// API endpoint pour la validation d'URL YouTube
import ytdl from 'ytdl-core'
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
    if (!ytdl.validateURL(url)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid YouTube URL'
      })
    }

    // Obtenir les informations de la vidéo
    const info = await ytdl.getBasicInfo(url)
    
    // Extraire les formats disponibles
    const formats = ytdl.filterFormats(info.formats, 'videoandaudio').map(format => ({
      quality: format.qualityLabel || format.quality,
      format: format.container,
      hasAudio: format.hasAudio,
      hasVideo: format.hasVideo,
      contentLength: format.contentLength,
      url: format.url
    }))

    // Retourner les informations de la vidéo
    return {
      url,
      videoId: info.videoDetails.videoId,
      title: info.videoDetails.title,
      thumbnail: info.videoDetails.thumbnails[0]?.url,
      duration: info.videoDetails.lengthSeconds,
      author: info.videoDetails.author.name,
      formats
    }
  } catch (error: any) {
    console.error('YouTube validation error:', error)
    
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'An error occurred while processing the video'
    })
  }
})

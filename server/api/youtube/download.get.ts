import { video_info, yt_validate, stream } from 'play-dl'
import { H3Event } from 'h3'
import { Readable } from 'stream'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const query = getQuery(event)
    const { url, itag } = query

    if (!url || !itag) {
      throw createError({
        statusCode: 400,
        message: 'URL and itag are required'
      })
    }

    // Valider l'URL YouTube
    if (!yt_validate(url as string)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid YouTube URL'
      })
    }

    // Obtenir les informations de la vidéo
    const info = await video_info(url as string)
    const format = info.format.find(f => f.itag === parseInt(itag as string))
    
    if (!format) {
      throw createError({
        statusCode: 400,
        message: 'Format not found'
      })
    }

    // Créer un nom de fichier sécurisé
    const safeFilename = info.video_details.title
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
    const fileExtension = format.mimeType?.split(';')[0].split('/')[1] || 'mp4'
    const filename = `${safeFilename}.${fileExtension}`

    try {
      // Créer le stream de téléchargement avec les options appropriées
      const videoStream = await stream(url as string, {
        quality: parseInt(itag as string),
        htmldata: info.html,
        language: 'en'
      })

      // Configurer les headers pour le téléchargement
      setHeaders(event, {
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Type': format.mimeType || 'video/mp4',
        'Cache-Control': 'no-cache',
        'Content-Transfer-Encoding': 'binary'
      })

      // Retourner le stream
      return sendStream(event, videoStream.stream as unknown as Readable)
    } catch (streamError) {
      console.error('Streaming error:', streamError)
      throw createError({
        statusCode: 500,
        message: 'Error while streaming the video'
      })
    }
  } catch (error: any) {
    console.error('YouTube download error:', error)
    
    let errorMessage = 'An error occurred while downloading the video'
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

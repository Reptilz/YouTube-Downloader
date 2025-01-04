import ytdl from 'ytdl-core'
import { H3Event } from 'h3'
import { Readable } from 'stream'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const query = getQuery(event)
    const { url, format } = query

    if (!url || !format) {
      throw createError({
        statusCode: 400,
        message: 'URL and format are required'
      })
    }

    // Valider l'URL YouTube
    if (!ytdl.validateURL(url as string)) {
      throw createError({
        statusCode: 400,
        message: 'Invalid YouTube URL'
      })
    }

    // Obtenir les informations de la vidéo
    const info = await ytdl.getInfo(url as string)
    
    // Trouver le format demandé
    const videoFormat = info.formats.find(f => f.container === format)
    
    if (!videoFormat) {
      throw createError({
        statusCode: 400,
        message: `Format ${format} not available for this video`
      })
    }

    // Configurer les headers pour le téléchargement
    setHeaders(event, {
      'Content-Disposition': `attachment; filename="${info.videoDetails.title}.${format}"`,
      'Content-Type': `video/${format}`
    })

    // Créer le stream de téléchargement
    const stream = ytdl(url as string, {
      format: videoFormat
    })

    // Convertir le stream en buffer pour l'envoyer
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = []
      stream.on('data', (chunk: Buffer) => chunks.push(chunk))
      stream.on('end', () => resolve(Buffer.concat(chunks)))
      stream.on('error', reject)
    })
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'An error occurred while downloading the video'
    })
  }
})

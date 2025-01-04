// Ce fichier peut être supprimé car nous n'utilisons plus play-dl
import { setToken } from 'play-dl'

// Plugin temporaire vide en attendant la suppression
export default defineNitroPlugin(async () => {
  try {
    await setToken({
      useragent: [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ]
    })
    console.log('play-dl configured successfully')
  } catch (error) {
    console.error('Error configuring play-dl:', error)
  }
})

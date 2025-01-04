import ytdl from '@distube/ytdl-core'

export default defineNitroPlugin(() => {
  // Configuration globale de ytdl-core
  const cookies = [
    { name: 'CONSENT', value: 'YES+' },
    { name: 'VISITOR_INFO1_LIVE', value: 'randomstring' },
    { name: 'LOGIN_INFO', value: '' },
    { name: 'YSC', value: 'randomstring' },
    { name: 'PREF', value: 'f4=4000000&hl=en' },
    { name: '__Secure-3PSID', value: '' }
  ]

  // Création de l'agent avec les cookies
  ytdl.createAgent(cookies, {
    keepAlive: true,
    keepAliveMsecs: 50000,
    maxSockets: 50
  })
})

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  
  nitro: {
    preset: 'netlify',
    logLevel: 'debug',
    debug: true,
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': '*'
        }
      }
    }
  },
  
  app: {
    head: {
      title: 'YouTube Downloader',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || ''
    }
  },
  ssr: true
})

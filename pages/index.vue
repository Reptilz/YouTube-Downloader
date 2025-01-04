<!-- Page d'accueil -->
<template>
  <div class="max-w-4xl mx-auto">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        YouTube Downloader
      </h1>
      <p class="text-lg text-gray-600">
        Téléchargez vos vidéos YouTube préférées facilement
      </p>
    </div>

    <!-- Formulaire d'URL -->
    <YoutubeUrlInput
      @submit="handleUrlSubmit"
      :disabled="isLoading"
    />

    <!-- Message d'erreur -->
    <div v-if="error" class="mt-4 p-4 bg-red-50 text-red-600 rounded-md">
      {{ error }}
    </div>

    <!-- Affichage de la vidéo -->
    <div v-if="video" class="mt-8">
      <YoutubeVideoPlayer
        :video-id="video.videoId"
        :thumbnail="video.thumbnail"
        :title="video.title"
      />
      
      <!-- Bouton de téléchargement -->
      <YoutubeDownloadButton
        :video="video"
        :is-loading="isLoading"
        @download="handleDownload"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { YoutubeVideo } from '~/types/youtube'
import YoutubeUrlInput from '~/components/youtube/UrlInput.vue'
import YoutubeVideoPlayer from '~/components/youtube/VideoPlayer.vue'
import YoutubeDownloadButton from '~/components/youtube/DownloadButton.vue'

definePageMeta({
  layout: 'default'
})

const video = ref<YoutubeVideo | null>(null)
const isLoading = ref(false)
const error = ref('')

const handleUrlSubmit = async (url: string) => {
  try {
    isLoading.value = true
    error.value = ''
    
    // Appel à l'API pour valider l'URL et obtenir les informations de la vidéo
    const response = await $fetch('/api/youtube/validate', {
      method: 'POST',
      body: { url }
    })
    
    video.value = response as YoutubeVideo
  } catch (e) {
    error.value = 'Erreur lors du chargement de la vidéo'
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

const handleDownload = async (format: string) => {
  if (!video.value) return
  
  try {
    isLoading.value = true
    error.value = ''
    
    // Appel à l'API pour télécharger la vidéo
    const response = await $fetch('/api/youtube/download', {
      method: 'GET',
      params: {
        url: video.value.url,
        format
      }
    })
    
    // Créer un lien de téléchargement
    const link = document.createElement('a')
    link.href = response.downloadUrl
    link.download = `${video.value.title || 'video'}.${format}`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (e) {
    error.value = 'Erreur lors du téléchargement de la vidéo'
    console.error(e)
  } finally {
    isLoading.value = false
  }
}
</script>

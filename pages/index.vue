<!-- Page d'accueil -->
<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        YouTube Downloader
      </h1>
      <p class="text-lg text-gray-600">
        Téléchargez vos vidéos YouTube préférées facilement
      </p>
    </div>

    <!-- Formulaire d'URL -->
    <div class="max-w-2xl mx-auto">
      <YoutubeUrlInput
        @submit="handleUrlSubmit"
        :disabled="isLoading"
      />
    </div>

    <!-- Affichage de la vidéo -->
    <div v-if="video" class="mt-8 max-w-2xl mx-auto">
      <YoutubeVideoPlayer
        :video-id="video.videoId"
        :thumbnail="video.thumbnail"
        :title="video.title"
        :author="video.author"
        :duration="video.duration"
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
import { useNotifications } from '~/composables/useNotifications'

definePageMeta({
  layout: 'default'
})

const video = ref<YoutubeVideo | null>(null)
const isLoading = ref(false)
const { showSuccess, showError } = useNotifications()

const handleUrlSubmit = async (url: string) => {
  try {
    isLoading.value = true
    
    const response = await $fetch('/api/youtube/validate', {
      method: 'POST',
      body: { url }
    })
    
    video.value = response as YoutubeVideo
    showSuccess('Vidéo chargée avec succès')
  } catch (e: any) {
    showError(e.message || 'Erreur lors du chargement de la vidéo')
    console.error(e)
  } finally {
    isLoading.value = false
  }
}

const handleDownload = async (format: string) => {
  if (!video.value) return
  
  try {
    isLoading.value = true
    
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
    
    showSuccess('Téléchargement démarré')
  } catch (e: any) {
    showError(e.message || 'Erreur lors du téléchargement de la vidéo')
    console.error(e)
  } finally {
    isLoading.value = false
  }
}
</script>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { YoutubeVideo, VideoFormat } from '~/types/youtube'
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/24/solid'

const props = defineProps<{
  video: YoutubeVideo
  isLoading: boolean
}>()

const emit = defineEmits<{
  download: [format: VideoFormat]
}>()

const selectedFormat = ref<VideoFormat | null>(null)

// Formater la taille du fichier
const formatFileSize = (bytes?: string) => {
  if (!bytes) return 'Taille inconnue'
  const size = parseInt(bytes)
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

// Formater le type MIME pour un affichage plus lisible
const formatMimeType = (mimeType: string) => {
  const match = mimeType.match(/video\/([^;]+)/)
  return match ? match[1].toUpperCase() : 'Unknown'
}

// Trier et filtrer les formats disponibles
const availableFormats = computed(() => {
  return props.video.formats
    .filter(format => format.hasVideo && format.hasAudio)
    .sort((a, b) => {
      const qualityA = parseInt(a.quality?.match(/\d+/)?.[0] || '0')
      const qualityB = parseInt(b.quality?.match(/\d+/)?.[0] || '0')
      return qualityB - qualityA
    })
})

const handleDownload = async (format: VideoFormat) => {
  try {
    const params = new URLSearchParams({
      url: props.video.url,
      itag: format.itag.toString()
    })
    
    // Créer l'URL de téléchargement
    const downloadUrl = `/api/youtube/download?${params.toString()}`
    
    // Créer un lien temporaire pour le téléchargement
    const link = document.createElement('a')
    link.href = downloadUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Download error:', error)
    // Gérer l'erreur ici
  }
}
</script>

<template>
  <div class="mt-4">
    <Menu as="div" class="relative inline-block text-left w-full">
      <div class="flex space-x-2">
        <MenuButton
          class="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="isLoading"
        >
          <span v-if="selectedFormat">
            {{ selectedFormat.quality }} - {{ formatMimeType(selectedFormat.mimeType) }}
          </span>
          <span v-else>Sélectionner la qualité</span>
          <ChevronDownIcon class="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
        </MenuButton>

        <button
          @click="selectedFormat && handleDownload(selectedFormat)"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          :disabled="!selectedFormat || isLoading"
        >
          <span v-if="isLoading">Chargement...</span>
          <span v-else>Télécharger</span>
        </button>
      </div>

      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <MenuItems
          class="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none max-h-60 overflow-y-auto"
        >
          <div class="py-1">
            <MenuItem v-for="format in availableFormats" :key="format.itag" v-slot="{ active }">
              <button
                @click="selectedFormat = format"
                :class="[
                  active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                  'block w-full text-left px-4 py-2 text-sm'
                ]"
              >
                <div class="flex justify-between items-center">
                  <span>{{ format.quality }}{{ format.fps ? ` ${format.fps}fps` : '' }}</span>
                  <span class="text-gray-500">
                    {{ formatMimeType(format.mimeType) }} - {{ formatFileSize(format.contentLength) }}
                  </span>
                </div>
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>

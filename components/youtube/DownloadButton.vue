<script setup lang="ts">
import { ref } from 'vue'
import { ArrowDownTrayIcon } from '@heroicons/vue/24/solid'
import type { YoutubeVideo } from '~/types/youtube'

const props = defineProps<{
  video?: YoutubeVideo
  isLoading?: boolean
}>()

const selectedFormat = ref('')
const downloadProgress = ref(0)
const error = ref('')

const emit = defineEmits<{
  'download': [format: string]
}>()

const handleDownload = async () => {
  if (!selectedFormat.value) {
    error.value = 'Veuillez sélectionner un format'
    return
  }

  error.value = ''
  emit('download', selectedFormat.value)
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto mt-6">
    <div v-if="video?.formats?.length" class="space-y-4">
      <div>
        <label for="format" class="block text-sm font-medium text-gray-700">
          Format de téléchargement
        </label>
        <select
          id="format"
          v-model="selectedFormat"
          class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Sélectionnez un format</option>
          <option
            v-for="format in video.formats"
            :key="format.url"
            :value="format.format"
          >
            {{ format.quality }} - {{ format.format }}
          </option>
        </select>
      </div>

      <div v-if="error" class="text-sm text-red-600">
        {{ error }}
      </div>

      <button
        @click="handleDownload"
        :disabled="isLoading || !selectedFormat"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 w-full justify-center"
      >
        <ArrowDownTrayIcon v-if="!isLoading" class="h-5 w-5 mr-2" />
        <span v-if="isLoading">Téléchargement en cours...</span>
        <span v-else>Télécharger</span>
      </button>

      <div v-if="downloadProgress > 0" class="w-full bg-gray-200 rounded-full h-2.5">
        <div
          class="bg-green-600 h-2.5 rounded-full"
          :style="{ width: downloadProgress + '%' }"
        ></div>
      </div>
    </div>
  </div>
</template>

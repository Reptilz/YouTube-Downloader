<script setup lang="ts">
import { ref } from 'vue'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/solid'

const url = ref('')
const isLoading = ref(false)
const error = ref('')

const emit = defineEmits<{
  'submit': [url: string]
}>()

const validateUrl = (url: string): boolean => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/
  return youtubeRegex.test(url)
}

const handleSubmit = () => {
  error.value = ''
  if (!url.value) {
    error.value = 'Veuillez entrer une URL YouTube'
    return
  }
  
  if (!validateUrl(url.value)) {
    error.value = 'URL YouTube invalide'
    return
  }

  isLoading.value = true
  emit('submit', url.value)
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <form @submit.prevent="handleSubmit" class="mt-4">
      <div class="flex flex-col space-y-4">
        <label for="youtube-url" class="block text-sm font-medium text-gray-700">
          URL de la vidéo YouTube
        </label>
        
        <div class="relative rounded-md shadow-sm">
          <input
            id="youtube-url"
            v-model="url"
            type="text"
            placeholder="https://www.youtube.com/watch?v=..."
            class="block w-full rounded-md border-gray-300 pr-10 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            :class="{ 'border-red-300': error }"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div v-if="error" class="text-sm text-red-600">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="isLoading"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <span v-if="isLoading">Chargement...</span>
          <span v-else>Charger la vidéo</span>
        </button>
      </div>
    </form>
  </div>
</template>

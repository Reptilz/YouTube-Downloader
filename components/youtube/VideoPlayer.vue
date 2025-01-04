<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  videoId?: string
  thumbnail?: string
  title?: string
}>()

const videoUrl = computed(() => {
  if (!props.videoId) return ''
  return `https://www.youtube.com/embed/${props.videoId}`
})
</script>

<template>
  <div class="w-full max-w-2xl mx-auto mt-8">
    <div v-if="videoId" class="aspect-w-16 aspect-h-9">
      <iframe
        :src="videoUrl"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="w-full h-full rounded-lg shadow-lg"
      ></iframe>
    </div>
    
    <div v-else-if="thumbnail" class="relative aspect-w-16 aspect-h-9">
      <img
        :src="thumbnail"
        :alt="title"
        class="w-full h-full object-cover rounded-lg shadow-lg"
      />
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="bg-black bg-opacity-50 p-4 rounded-full">
          <span class="text-white text-lg">Chargement...</span>
        </div>
      </div>
    </div>

    <h2 v-if="title" class="mt-4 text-xl font-semibold text-gray-900">
      {{ title }}
    </h2>
  </div>
</template>

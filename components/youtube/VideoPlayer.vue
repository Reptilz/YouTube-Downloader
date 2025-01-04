<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  videoId: string
  thumbnail?: string
  title: string
  author: string
  duration: string
}>()

const formatDuration = (seconds: string) => {
  const duration = parseInt(seconds)
  const minutes = Math.floor(duration / 60)
  const remainingSeconds = duration % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const videoUrl = computed(() => {
  if (!props.videoId) return ''
  return `https://www.youtube.com/embed/${props.videoId}`
})
</script>

<template>
  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
    <div class="relative w-full" style="padding-top: 56.25%">
      <iframe
        :src="videoUrl"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        class="absolute top-0 left-0 w-full h-full"
      ></iframe>
    </div>
    <div class="p-4">
      <h2 class="text-xl font-semibold text-gray-900 mb-2">{{ title }}</h2>
      <div class="flex items-center justify-between text-sm text-gray-600">
        <span>{{ author }}</span>
        <span>{{ formatDuration(duration) }}</span>
      </div>
    </div>
  </div>
</template>

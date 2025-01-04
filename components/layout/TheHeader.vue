<script setup lang="ts">
import { HomeIcon } from '@heroicons/vue/24/solid'
</script>

<template>
  <header class="bg-white shadow">
    <nav class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex h-16 justify-between items-center">
        <div class="flex items-center">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <HomeIcon class="h-8 w-8 text-indigo-600" />
            <span class="text-xl font-bold text-gray-900">YouTube Downloader</span>
          </NuxtLink>
        </div>
        <div class="flex items-center space-x-4">
          <a href="https://github.com" 
             target="_blank"
             class="text-gray-600 hover:text-gray-900">
            GitHub
          </a>
        </div>
      </div>
    </nav>
  </header>
</template>

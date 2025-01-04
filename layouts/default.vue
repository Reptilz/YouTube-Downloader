<script setup lang="ts">
import TheHeader from '~/components/layout/TheHeader.vue'
import TheFooter from '~/components/layout/TheFooter.vue'
// Les composants sont automatiquement importés grâce à la configuration de Nuxt
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <TheHeader />
    <main class="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

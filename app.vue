<template>
  <div>
    <ToastContainer ref="toastContainerRef" />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import ToastContainer from '~/components/ui/ToastContainer.vue'
import { useNotifications } from '~/composables/useNotifications'
import { onMounted, ref } from 'vue'

const toastContainerRef = ref<InstanceType<typeof ToastContainer> | null>(null)
const { setContainer } = useNotifications()

onMounted(() => {
  if (toastContainerRef.value) {
    setContainer(toastContainerRef.value)
  }
})
</script>

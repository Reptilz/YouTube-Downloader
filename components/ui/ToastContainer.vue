<script setup lang="ts">
import { ref } from 'vue'
import Toast from './Toast.vue'

interface Toast {
  id: number
  type: 'success' | 'error' | 'warning'
  message: string
  duration?: number
}

const toasts = ref<Toast[]>([])
let nextId = 0

const addToast = (type: 'success' | 'error' | 'warning', message: string, duration = 5000) => {
  const id = nextId++
  toasts.value.push({ id, type, message, duration })
}

const removeToast = (id: number) => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// Expose the addToast method to the template
defineExpose({ addToast })
</script>

<template>
  <div
    aria-live="assertive"
    class="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 z-50"
  >
    <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
      <Toast
        v-for="toast in toasts"
        :key="toast.id"
        :type="toast.type"
        :message="toast.message"
        :duration="toast.duration"
        :show="true"
        @close="removeToast(toast.id)"
      />
    </div>
  </div>
</template>

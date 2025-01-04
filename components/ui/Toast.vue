<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  XCircleIcon,
  XMarkIcon
} from '@heroicons/vue/24/solid'

const props = defineProps<{
  type: 'success' | 'error' | 'warning'
  message: string
  duration?: number
  show: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const isVisible = ref(props.show)

const icons = {
  success: CheckCircleIcon,
  error: XCircleIcon,
  warning: ExclamationCircleIcon
}

const colors = {
  success: 'bg-green-50 text-green-800',
  error: 'bg-red-50 text-red-800',
  warning: 'bg-yellow-50 text-yellow-800'
}

const iconColors = {
  success: 'text-green-400',
  error: 'text-red-400',
  warning: 'text-yellow-400'
}

onMounted(() => {
  if (props.duration) {
    setTimeout(() => {
      isVisible.value = false
      emit('close')
    }, props.duration)
  }
})
</script>

<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isVisible"
      class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5"
    >
      <div :class="[colors[type], 'p-4']">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <component
              :is="icons[type]"
              class="h-6 w-6"
              :class="iconColors[type]"
              aria-hidden="true"
            />
          </div>
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm font-medium">
              {{ message }}
            </p>
          </div>
          <div class="ml-4 flex flex-shrink-0">
            <button
              type="button"
              class="inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              @click="emit('close')"
            >
              <span class="sr-only">Fermer</span>
              <XMarkIcon class="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

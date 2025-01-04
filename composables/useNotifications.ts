import { ref } from 'vue'

interface ToastContainerInstance {
  addToast: (type: 'success' | 'error' | 'warning', message: string, duration?: number) => void
}

const toastContainer = ref<ToastContainerInstance | null>(null)

export const useNotifications = () => {
  const setContainer = (container: ToastContainerInstance) => {
    toastContainer.value = container
  }

  const showNotification = (type: 'success' | 'error' | 'warning', message: string, duration = 5000) => {
    if (toastContainer.value) {
      toastContainer.value.addToast(type, message, duration)
    } else {
      console.warn('Toast container not initialized')
    }
  }

  const showSuccess = (message: string, duration?: number) => {
    showNotification('success', message, duration)
  }

  const showError = (message: string, duration?: number) => {
    showNotification('error', message, duration)
  }

  const showWarning = (message: string, duration?: number) => {
    showNotification('warning', message, duration)
  }

  return {
    setContainer,
    showSuccess,
    showError,
    showWarning
  }
}
